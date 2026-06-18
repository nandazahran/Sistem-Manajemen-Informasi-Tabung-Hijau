import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import bannerImg from "../../assets/DB-gambar-banner.png";
import DuiLayout from "../../components/DuiLayout";

function DuiDashboardPage() {
	const navigate = useNavigate();

	const [stats, setStats] = useState([
		{
			title: "Total Sampah Terkelola",
			value: "0 kg",
			badge: "Memuat...",
			icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2",
		},
		{
			title: "Total Nilai Ekonomi",
			value: "Rp 0",
			badge: "Memuat...",
			icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
		},
		{
			title: "Wilayah Aktif",
			value: "0",
			badge: "Memuat...",
			icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
		},
		{
			title: "Total Transaksi",
			value: "0",
			badge: "Memuat...",
			icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
		},
		{
			title: "KPI Tertinggi",
			value: "0",
			badge: "-",
			icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
		},
		{
			title: "Kategori Terbanyak",
			value: "-",
			badge: "-",
			icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
		},
	]);

	const [lineData, setLineData] = useState([]);
	const [barData, setBarData] = useState([]);
	const [pieKategori, setPieKategori] = useState([]);
	const [pieWilayah, setPieWilayah] = useState([]);

	useEffect(() => {
		const fetchDuiDashboard = async () => {
			try {
				const token =
					localStorage.getItem("token") || sessionStorage.getItem("token");
				if (!token) return;
				const headers = { Authorization: `Bearer ${token}` };

				// Fetch Global Dashboard
				const dashRes = await fetch(
					`${import.meta.env.VITE_API_URL}/dashboard`,
					{ headers },
				);
				const dashData = await dashRes.json();

				// Fetch Leaderboard
				const lbRes = await fetch(
					`${import.meta.env.VITE_API_URL}/dashboard/leaderboard`,
					{ headers },
				);
				const lbData = await lbRes.json();

				// Fetch Wilayah Aktif
				const wilRes = await fetch(
					`${import.meta.env.VITE_API_URL}/wilayah/aktif`,
					{ headers },
				);
				const wilData = await wilRes.json();

				// --- Susun Data ---
				const formatRp = (angka) =>
					new Intl.NumberFormat("id-ID", {
						style: "currency",
						currency: "IDR",
						minimumFractionDigits: 0,
					}).format(angka);

				const newStats = [...stats];
				if (dashData.status === "sukses") {
					newStats[0].value = `${(dashData.rekap_seluruh_ipb?.total_berat_gram || 0) / 1000} kg`;
					newStats[0].badge = "Total Seluruh Wilayah";
					newStats[1].value = formatRp(
						dashData.rekap_seluruh_ipb?.total_rupiah || 0,
					);
					newStats[1].badge = "Total Nilai Terkumpul";
					newStats[3].value = (
						dashData.rekap_seluruh_ipb?.jumlah_transaksi || 0
					).toString();
					newStats[3].badge = "Total Seluruh Wilayah";

					if (
						dashData.grafik_bulanan &&
						Array.isArray(dashData.grafik_bulanan) &&
						dashData.grafik_bulanan.length > 0
					) {
						setLineData(
							dashData.grafik_bulanan.map((g) => ({
								name: g.bulan,
								berat: g.total_berat / 1000,
							})),
						);
						setBarData(
							dashData.grafik_bulanan.map((g) => ({
								name: g.bulan,
								nilai: g.total_nilai,
							})),
						);
					}

					if (
						dashData.breakdown_kategori &&
						Array.isArray(dashData.breakdown_kategori) &&
						dashData.breakdown_kategori.length > 0
					) {
						setPieKategori(
							dashData.breakdown_kategori.map((k) => ({
								name: k.kategori,
								value: k.total_berat / 1000,
							})),
						);

						// Update Stats Kategori Terbanyak
						const topKategori = [...dashData.breakdown_kategori].sort(
							(a, b) => b.total_berat - a.total_berat,
						)[0];
						if (topKategori) {
							newStats[5].value = topKategori.kategori;
							newStats[5].badge = `${topKategori.total_berat / 1000} kg`;
						}
					} else {
						newStats[5].value = "-";
						newStats[5].badge = "0 kg";
					}
				}

				if (wilData.status === "sukses" && Array.isArray(wilData.data)) {
					newStats[2].value = wilData.data.length.toString();
					newStats[2].badge = "Wilayah Status Aktif";
				}

				if (
					lbData.status === "sukses" &&
					Array.isArray(lbData.data) &&
					lbData.data.length > 0
				) {
					newStats[4].value = lbData.data[0].poin_kpi.toString();
					newStats[4].badge = lbData.data[0].nama_wilayah;

					setPieWilayah(
						lbData.data.map((w) => ({
							name: w.nama_wilayah,
							value: w.total_berat_gram / 1000, // dalam satuan kg
						})),
					);
				} else {
					newStats[4].value = "0";
					newStats[4].badge = "Belum ada data";
				}

				setStats(newStats);
			} catch (error) {
				console.error("Gagal mengambil data dashboard DUI:", error);
			}
		};
		fetchDuiDashboard();
	}, []);

	const COLORS_KATEGORI = ["#125B2A", "#F4A300", "#8FA57A", "#EAE5DA"];
	const COLORS_WILAYAH = [
		"#125B2A",
		"#F4A300",
		"#8FA57A",
		"#517D3B",
		"#D1D5DB",
	];

	return (
		<DuiLayout>
			{/* BANNER GRADIENT KREM KE HIJAU DENGAN GAMBAR */}
			<div className="bg-gradient-to-r from-[#F5EFE6] via-[#F5EFE6] to-[#8FA57A]/30 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-sm relative overflow-hidden mt-2 mb-8 border border-white/60">
				<div className="z-10 max-w-xl mb-6 md:mb-0">
					<h2 className="text-4xl font-extrabold text-[#0B4D1E] mb-4">
						Selamat Datang, DUI SIM-TH{" "}
						<span className="text-green-600">🌱</span>
					</h2>
					<p className="text-gray-700 font-medium text-lg mb-8">
						Pantau perkembangan pengelolaan sampah dan kontribusi wilayah secara
						terpusat.
					</p>
					<button
						onClick={() => navigate("/dui/monitoring")}
						className="bg-[#F4A300] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
					>
						Lihat Monitoring{" "}
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
					</button>
				</div>
				<div className="w-full md:w-80 lg:w-96 flex-shrink-0 z-10 flex justify-center md:justify-end">
					<img
						src={bannerImg}
						alt="Ilustrasi Banner"
						className="w-full max-w-[280px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
					/>
				</div>
			</div>

			{/* STATS CARDS KONSISTEN BEM & ADMIN */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				{stats.map((s, idx) => (
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
										d={s.icon}
									/>
								</svg>
							</div>
							<span className="bg-[#E8F5E9] text-[#2E7D32] text-xs font-extrabold px-3 py-1.5 rounded-full">
								{s.badge}
							</span>
						</div>
						<p className="text-gray-500 text-sm font-medium">{s.title}</p>
						<h3 className="text-3xl font-extrabold text-[#0B4D1E] mt-1">
							{s.value}
						</h3>
					</div>
				))}
			</div>

			{/* GRAFIK GRID (2x2) */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
				{/* Tren Sampah */}
				<div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
					<h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">
						Tren Sampah Bulanan
					</h3>
					<div className="h-64">
						{lineData.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={lineData}>
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
										width={40}
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
									Belum ada data tren sampah bulanan.
								</p>
							</div>
						)}
					</div>
				</div>
				{/* Pertumbuhan Nilai Ekonomi */}
				<div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
					<h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">
						Pertumbuhan Nilai Ekonomi
					</h3>
					<div className="h-64">
						{barData.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={barData}>
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
										width={60}
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
										fill="#125B2A"
										radius={[6, 6, 0, 0]}
										barSize={40}
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
				</div>{" "}
				{/* Kategori Sampah Terbanyak */}
				<div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
					<h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">
						Kategori Sampah Terbanyak
					</h3>
					<div className="h-64 relative">
						{pieKategori.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Tooltip
										contentStyle={{
											borderRadius: "1rem",
											border: "none",
											boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
										}}
										formatter={(value) => `${value} kg`}
									/>
									<Pie
										data={pieKategori}
										innerRadius={60}
										outerRadius={100}
										paddingAngle={2}
										dataKey="value"
										label={({ name }) => `${name}`}
										labelLine={false}
										style={{ fontSize: "11px", fontWeight: "bold" }}
									>
										{pieKategori.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS_KATEGORI[index % COLORS_KATEGORI.length]}
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
				{/* Kontribusi Wilayah */}
				<div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
					<h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">
						Kontribusi Wilayah (kg)
					</h3>
					<div className="h-64 relative">
						{pieWilayah.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Tooltip
										contentStyle={{
											borderRadius: "1rem",
											border: "none",
											boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
										}}
										formatter={(value) => `${value} kg`}
									/>
									<Pie
										data={pieWilayah}
										innerRadius={0}
										outerRadius={100}
										paddingAngle={1}
										dataKey="value"
										label={({ name }) => name}
										labelLine={false}
										style={{ fontSize: "11px", fontWeight: "bold" }}
									>
										{pieWilayah.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS_WILAYAH[index % COLORS_WILAYAH.length]}
											/>
										))}
									</Pie>
								</PieChart>
							</ResponsiveContainer>
						) : (
							<div className="w-full h-full bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 flex items-center justify-center">
								<p className="text-gray-400 font-medium">
									Belum ada data kontribusi wilayah.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</DuiLayout>
	);
}

export default DuiDashboardPage;
