import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import bannerImg from "../assets/DB-gambar-banner.png";
import DashboardLayout from "../components/DashboardLayout";

function DashboardPage() {
	const _navigate = useNavigate();

	// STATE UNTUK DATA API (KOSONGAN/LOADING STATE)
	const [stats, setStats] = useState({
		totalSampah: "0 kg",
		nilaiEkonomi: "Rp 0",
		totalTransaksi: "0",
		rank: "-",
	});
	const [top3, setTop3] = useState([]);
	const [transaksiTerbaru, setTransaksiTerbaru] = useState([]);
	const [aktivitas, setAktivitas] = useState([]);
	const [namaWilayah, setNamaWilayah] = useState("Memuat...");
	const [grafikBulanan, setGrafikBulanan] = useState([]);
	const [breakdownKategori, setBreakdownKategori] = useState([]);

	// ==========================================
	// FETCH DATA ASLI DARI API & LOCALSTORAGE
	// ==========================================
	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				const token =
					localStorage.getItem("token") || sessionStorage.getItem("token");
				if (!token) return;

				// Extract username and wilayah_id from token payload directly
				const payload = JSON.parse(atob(token.split(".")[1]));
				const _usernameJwt = payload.sub;
				let activeWilayahId = payload.wilayah_id;

				const userStr =
					localStorage.getItem("user") || sessionStorage.getItem("user");
				const userData = userStr ? JSON.parse(userStr) : null;
				let targetNama = "BEM Wilayah";
				if (userData?.nama_wilayah) {
					targetNama = userData.nama_wilayah;
				} else if (userData?.nama) {
					targetNama = userData.nama;
				}

				// Fallback yang lebih tangguh: gunakan ROLE untuk mencari nama wilayah
				if (!activeWilayahId) {
					try {
						let computedTarget = userData?.nama_wilayah || userData?.nama || "";

						// Jika ada role (misal: "bem_faperta" -> "BEM FAPERTA" atau "ormawa_ppku" -> "Ormawa Eksekutif PPKU")
						if (
							userData?.role &&
							userData.role !== "bem_km" &&
							userData.role !== "bem_wilayah"
						) {
							if (userData.role.startsWith("bem_")) {
								computedTarget = userData.role
									.replace("bem_", "BEM ")
									.toUpperCase();
							} else if (userData.role.startsWith("ormawa_")) {
								if (userData.role === "ormawa_ppku") {
									computedTarget = "Ormawa Eksekutif PPKU";
								} else {
									computedTarget = userData.role
										.replace("ormawa_", "ORMAWA ")
										.toUpperCase();
								}
							}
						}
						targetNama = computedTarget;

						const wilRes = await fetch(
							`${import.meta.env.VITE_API_URL}/wilayah/aktif`,
							{
								headers: { Authorization: `Bearer ${token}` },
							},
						);
						const wilData = await wilRes.json();

						if (wilData.status === "sukses" && wilData.data) {
							const match = wilData.data.find(
								(w) =>
									w.nama === targetNama || w.nama.toUpperCase() === targetNama,
							);
							if (match) activeWilayahId = match.id;
						}
					} catch (e) {
						console.error("Fallback wilayah ID gagal:", e);
					}
				}

				if (!activeWilayahId) {
					console.warn(
						"Wilayah ID tidak ditemukan pada token dan fallback gagal. Data akan kosong.",
					);
				}

				setNamaWilayah(targetNama);

				// 1. Fetch Data Statistik Dashboard dari Backend
				try {
					if (activeWilayahId) {
						const response = await fetch(
							`${import.meta.env.VITE_API_URL}/dashboard/${activeWilayahId}`,
							{
								headers: { Authorization: `Bearer ${token}` },
							},
						);
						const resData = await response.json();
						if (resData.status === "sukses") {
							// JIKA BERHASIL, KITA TIMPA NAMA WILAYAH DENGAN NAMA DARI DATABASE (Akurat!)
							if (resData.nama_wilayah) {
								targetNama = resData.nama_wilayah;
								setNamaWilayah(resData.nama_wilayah);
							}

							setStats((prev) => ({
								...prev,
								totalSampah: `${resData.rekap_wilayah?.total_berat_gram ? resData.rekap_wilayah.total_berat_gram / 1000 : 0} kg`,
								nilaiEkonomi: new Intl.NumberFormat("id-ID", {
									style: "currency",
									currency: "IDR",
									minimumFractionDigits: 0,
								}).format(resData.rekap_wilayah?.total_rupiah || 0),
								totalTransaksi: resData.rekap_wilayah?.jumlah_transaksi || 0,
							}));
							if (
								resData.grafik_bulanan &&
								Array.isArray(resData.grafik_bulanan)
							) {
								setGrafikBulanan(resData.grafik_bulanan);
							}
							if (
								resData.breakdown_kategori &&
								Array.isArray(resData.breakdown_kategori)
							) {
								setBreakdownKategori(
									resData.breakdown_kategori.map((k) => ({
										name: k.nama_kategori,
										value: k.total_berat_gram / 1000,
									})),
								);
							}
						}
					}
				} catch (e) {
					console.error("Gagal ambil statistik:", e);
				}

				// 2. Fetch Leaderboard (Top 3)
				try {
					const lbRes = await fetch(
						`${import.meta.env.VITE_API_URL}/dashboard/leaderboard`,
						{
							headers: { Authorization: `Bearer ${token}` },
						},
					);
					const lbData = await lbRes.json();
					if (lbData.status === "sukses" && lbData.data) {
						setTop3(lbData.data.slice(0, 3) || []);
						const rankObj = lbData.data.find(
							(w) => w.nama_wilayah === targetNama,
						);
						if (rankObj) {
							setStats((prev) => ({
								...prev,
								rank: `#${rankObj.peringkat} Wilayah`,
							}));
						}
					}
				} catch (e) {
					console.error("Gagal fetch leaderboard:", e);
				}

				// 3. Fetch Aktivitas Terbaru
				try {
					if (activeWilayahId) {
						const actRes = await fetch(
							`${import.meta.env.VITE_API_URL}/dashboard/${activeWilayahId}/aktivitas`,
							{
								headers: { Authorization: `Bearer ${token}` },
							},
						);
						const actData = await actRes.json();
						if (actData.status === "sukses") {
							setAktivitas(actData.data || []);
						}
					}
				} catch (e) {
					console.error("Gagal fetch aktivitas:", e);
				}

				// 4. Fetch Transaksi Terbaru
				try {
					const trxRes = await fetch(
						`${import.meta.env.VITE_API_URL}/transaksi`,
						{
							headers: { Authorization: `Bearer ${token}` },
						},
					);
					const trxData = await trxRes.json();
					if (trxData.status === "sukses") {
						const myTrx = trxData.data.filter(
							(t) => t.nama_wilayah === targetNama,
						);
						setTransaksiTerbaru(myTrx.slice(0, 5) || []);
					}
				} catch (e) {
					console.error("Gagal fetch transaksi:", e);
				}
			} catch (error) {
				console.error("Gagal menginisialisasi dashboard:", error);
			}
		};

		fetchDashboardData();
	}, []);

	const formatRp = (angka) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(angka);
	const formatTanggalSingkat = (isoString) => {
		if (!isoString) return "";
		const date = new Date(isoString);
		return date.toLocaleDateString("id-ID", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	return (
		<DashboardLayout>
			{/* BANNER UTAMA */}
			<div className="bg-gradient-to-r from-[#F5EFE6] via-[#F5EFE6] to-[#8FA57A]/30 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-sm relative overflow-hidden mt-2 border border-white/60">
				<div className="z-10 max-w-xl mb-6 md:mb-0">
					<h2 className="text-4xl font-extrabold text-[#0B4D1E] mb-4">
						Selamat Datang, {namaWilayah}{" "}
						<span className="text-green-600">🌱</span>
					</h2>
					<p className="text-gray-700 font-medium text-lg mb-8">
						Kelola transaksi sampah wilayah dengan lebih terstruktur dan
						transparan.
					</p>
					<Link
						to="/input-transaksi"
						className="inline-flex bg-[#F4A300] text-white px-8 py-4 rounded-full font-bold items-center gap-2 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
					>
						Input Transaksi
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</Link>
				</div>
				<div className="w-full md:w-80 lg:w-96 flex-shrink-0 z-10 flex justify-center md:justify-end">
					<img
						src={bannerImg}
						alt="Ilustrasi Banner"
						className="w-full max-w-[280px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
					/>
				</div>
			</div>

			{/* KUMPULAN CARDS BEM WILAYAH */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
				{[
					{
						title: "Total Sampah",
						value: stats.totalSampah,
						icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
						badge: "All Time",
					},
					{
						title: "Nilai Ekonomi",
						value: stats.nilaiEkonomi,
						icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
						badge: "Total",
					},
					{
						title: "Total Transaksi",
						value: stats.totalTransaksi,
						icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
						badge: "Selesai",
					},
					{
						title: "Ranking KPI",
						value: stats.rank,
						icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
						badge: "Global",
					},
				].map((stat, idx) => (
					<div
						key={idx}
						className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer"
					>
						<div className="flex justify-between items-start mb-4">
							<div className="p-4 rounded-2xl bg-[#EAE5DA] text-[#0B4D1E]">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-7 w-7"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d={stat.icon}
									/>
								</svg>
							</div>
							<span className="bg-[#E8F5E9] text-[#2E7D32] text-xs font-extrabold px-3 py-1.5 rounded-full">
								{stat.badge}
							</span>
						</div>
						<p className="text-gray-500 text-sm font-medium">{stat.title}</p>
						<h3 className="text-3xl font-extrabold text-[#0B4D1E] mt-1">
							{stat.value}
						</h3>
					</div>
				))}
			</div>

			{/* SECTION GRAFIK (3 KOLOM) */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
				{/* Tren Sampah Bulanan */}
				<div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
					<div>
						<h3 className="font-extrabold text-xl text-[#0B4D1E] mb-1">
							Tren Sampah Bulanan
						</h3>
						<p className="text-gray-500 text-sm mb-6">
							Pengumpulan sampah per bulan (kg)
						</p>
					</div>
					<div className="h-64">
						{grafikBulanan.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<LineChart
									data={grafikBulanan.map((g) => ({
										name: g.bulan,
										berat:
											(g.total_berat !== undefined
												? g.total_berat
												: g.berat || 0) / 1000,
									}))}
								>
									<CartesianGrid strokeDasharray="3 3" vertical={false} />
									<XAxis
										dataKey="name"
										axisLine={false}
										tickLine={false}
										tick={{ fontSize: 12, fill: "#9CA3AF" }}
									/>
									<YAxis
										axisLine={false}
										tickLine={false}
										tick={{ fontSize: 12, fill: "#9CA3AF" }}
										width={30}
									/>
									<Tooltip
										cursor={{ stroke: "#E5E7EB", strokeWidth: 2 }}
										contentStyle={{
											borderRadius: "1rem",
											border: "none",
											boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
										}}
										formatter={(value) => [`${value} kg`, "Berat"]}
									/>
									<Line
										type="monotone"
										dataKey="berat"
										stroke="#125B2A"
										strokeWidth={4}
										dot={{ r: 5, fill: "#125B2A" }}
										activeDot={{ r: 8 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						) : (
							<div className="w-full h-full bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 flex items-center justify-center">
								<p className="text-gray-400 font-medium">
									Belum ada data tren sampah.
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Pertumbuhan Nilai Ekonomi */}
				<div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
					<div>
						<h3 className="font-extrabold text-xl text-[#0B4D1E] mb-1">
							Nilai Ekonomi Bulanan
						</h3>
						<p className="text-gray-500 text-sm mb-6">
							Pendapatan wilayah dari setoran sampah (Rp)
						</p>
					</div>
					<div className="h-64">
						{grafikBulanan.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={grafikBulanan.map((g) => ({
										name: g.bulan,
										nilai:
											g.total_nilai !== undefined
												? g.total_nilai
												: g.rupiah || 0,
									}))}
								>
									<CartesianGrid strokeDasharray="3 3" vertical={false} />
									<XAxis
										dataKey="name"
										axisLine={false}
										tickLine={false}
										tick={{ fontSize: 12, fill: "#9CA3AF" }}
									/>
									<YAxis
										axisLine={false}
										tickLine={false}
										tick={{ fontSize: 12, fill: "#9CA3AF" }}
										width={55}
										tickFormatter={(val) => `${val / 1000}k`}
									/>
									<Tooltip
										cursor={{ fill: "#F3F4F6" }}
										contentStyle={{
											borderRadius: "1rem",
											border: "none",
											boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
										}}
										formatter={(val) => `Rp ${val.toLocaleString()}`}
									/>
									<Bar
										dataKey="nilai"
										fill="#F4A300"
										radius={[6, 6, 0, 0]}
										barSize={35}
									/>
								</BarChart>
							</ResponsiveContainer>
						) : (
							<div className="w-full h-full bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 flex items-center justify-center">
								<p className="text-gray-400 font-medium">
									Belum ada data nilai ekonomi.
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Kategori Sampah Terbanyak */}
				<div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
					<div>
						<h3 className="font-extrabold text-xl text-[#0B4D1E] mb-1">
							Kategori Sampah Terbanyak
						</h3>
						<p className="text-gray-500 text-sm mb-6">
							Proporsi setoran berdasarkan kategori (kg)
						</p>
					</div>
					<div className="h-64 relative flex items-center justify-center">
						{breakdownKategori.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Tooltip
										contentStyle={{
											borderRadius: "1rem",
											border: "none",
											boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
										}}
										formatter={(value) => `${value.toFixed(1)} kg`}
									/>
									<Pie
										data={breakdownKategori}
										innerRadius={55}
										outerRadius={90}
										paddingAngle={2}
										dataKey="value"
										nameKey="name"
										label={({ name }) => name}
										labelLine={false}
										style={{ fontSize: "11px", fontWeight: "bold" }}
									>
										{breakdownKategori.map((_entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={
													["#125B2A", "#F4A300", "#8FA57A", "#EAE5DA"][
														index % 4
													]
												}
											/>
										))}
									</Pie>
								</PieChart>
							</ResponsiveContainer>
						) : (
							<div className="w-full h-full bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 flex items-center justify-center">
								<p className="text-gray-400 font-medium">
									Belum ada data kategori sampah.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* ROW 2: TRANSAKSI TERBARU & LEADERBOARD */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
				<div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2 hover:-translate-y-1 transition-transform duration-300">
					<div className="flex justify-between items-center mb-6">
						<h3 className="font-extrabold text-xl text-[#0B4D1E]">
							Transaksi Terbaru
						</h3>
						<Link
							to="/riwayat"
							className="text-sm font-bold text-[#0B4D1E] hover:text-[#F4A300] flex items-center gap-1 transition-colors"
						>
							Lihat Selengkapnya
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M14 5l7 7m0 0l-7 7m7-7H3"
								/>
							</svg>
						</Link>
					</div>
					<div className="space-y-4">
						{transaksiTerbaru.map((trx, idx) => (
							<div
								key={idx}
								className="flex justify-between items-center bg-[#F5EFE6] p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-gray-100"
							>
								<div>
									<p className="font-bold text-[#0B4D1E]">
										{trx.nama_kategori} - {trx.berat / 1000} kg
									</p>
									<p className="text-xs text-gray-500 mt-1">
										{formatTanggalSingkat(trx.tanggal)} • Oleh:{" "}
										{trx.nama_petugas}
									</p>
								</div>
								<div className="font-extrabold text-[#0B4D1E]">
									{formatRp(trx.total_nilai)}
								</div>
							</div>
						))}
						{transaksiTerbaru.length === 0 && (
							<p className="text-sm text-gray-500 italic text-center py-4">
								Belum ada transaksi bulan ini
							</p>
						)}
					</div>
				</div>

				{/* Top 3 Wilayah */}
				<div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between">
					<div>
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2 bg-yellow-100 rounded-lg text-[#F4A300]">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
									/>
								</svg>
							</div>
							<h3 className="font-extrabold text-xl text-[#0B4D1E]">
								Top 3 Wilayah
							</h3>
						</div>

						<div className="space-y-4">
							{top3.map((item, index) => {
								const icons = ["🏆", "🥈", "🥉"];
								const bgs = ["bg-yellow-400", "bg-gray-400", "bg-[#CD7F32]"];
								const isMe = item.nama_wilayah === namaWilayah;
								return (
									<div
										key={index}
										className={`flex items-center gap-4 p-3 rounded-2xl ${isMe ? "border-2 border-[#F4A300] bg-orange-50" : "bg-[#F5EFE6]"}`}
									>
										<div
											className={`w-10 h-10 ${bgs[index]} rounded-full flex items-center justify-center text-white text-xl`}
										>
											{icons[index]}
										</div>
										<div>
											<p className="font-bold text-[#0B4D1E]">
												{item.nama_wilayah}{" "}
												{isMe && (
													<span className="ml-2 bg-[#F4A300] text-white text-[10px] px-2 py-0.5 rounded-full">
														You
													</span>
												)}
											</p>
											<p className="text-xs text-gray-500">
												{item.poin_kpi} poin
											</p>
										</div>
									</div>
								);
							})}
							{top3.length === 0 && (
								<p className="text-sm text-gray-500 italic text-center py-4">
									Belum ada data KPI
								</p>
							)}
						</div>
					</div>
					<Link
						to="/leaderboard"
						className="w-full mt-6 text-sm font-bold text-[#0B4D1E] hover:text-[#F4A300] flex items-center justify-center gap-2"
					>
						Lihat Semua Peringkat{" "}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M14 5l7 7m0 0l-7 7m7-7H3"
							/>
						</svg>
					</Link>
				</div>
			</div>

			{/* ROW 3: AKTIVITAS */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
				<div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-300 flex flex-col lg:col-span-3">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 bg-green-100 rounded-lg text-green-600">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
								/>
							</svg>
						</div>
						<h3 className="font-extrabold text-xl text-[#0B4D1E]">Aktivitas</h3>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
						{aktivitas.map((akt, idx) => (
							<div
								key={idx}
								className="relative pl-12 border-l-2 border-green-100 py-2"
							>
								<div
									className={`absolute -left-[19px] top-2 w-9 h-9 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${idx % 2 === 0 ? "bg-green-100 text-green-600" : "bg-yellow-100 text-[#F4A300]"}`}
								>
									{idx % 2 === 0 ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
											/>
										</svg>
									)}
								</div>
								<p className="font-bold text-[#0B4D1E] text-sm">{akt.judul}</p>
								<p className="text-xs text-gray-500 mt-1">{akt.deskripsi}</p>
								<p className="text-xs text-gray-400 mt-1">{akt.waktu}</p>
							</div>
						))}
						{aktivitas.length === 0 && (
							<p className="text-sm text-gray-500 italic py-4 col-span-3 text-center">
								Belum ada riwayat aktivitas
							</p>
						)}
					</div>
					<Link
						to="/aktivitas"
						className="w-full mt-8 text-sm font-bold text-[#0B4D1E] hover:text-[#F4A300] flex items-center justify-center gap-2 transition-colors"
					>
						Lihat Semua Aktivitas
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M14 5l7 7m0 0l-7 7m7-7H3"
							/>
						</svg>
					</Link>
				</div>
			</div>
		</DashboardLayout>
	);
}

export default DashboardPage;
