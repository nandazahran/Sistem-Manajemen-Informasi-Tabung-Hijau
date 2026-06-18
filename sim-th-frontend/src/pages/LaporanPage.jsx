import React, { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import * as XLSX from "xlsx";
import DashboardLayout from "../components/DashboardLayout";

function LaporanPage() {
	const [isExportModalOpen, setIsExportModalOpen] = useState(false);
	const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
	const [selectedMonth, setSelectedMonth] = useState("Semua Periode");
	const [selectedYear, setSelectedYear] = useState("2026");

	// State untuk Modal Export
	const [exportPeriode, setExportPeriode] = useState("Semua Periode");
	const [exportYear, setExportYear] = useState("2026");
	const [isExportPeriodeOpen, setIsExportPeriodeOpen] = useState(false);

	const [exportData, setExportData] = useState({
		ringkasan: true,
		grafikIncome: true,
		grafikBreakdown: true,
		rincian: true,
	});

	// State untuk Data Riil
	const [dataTrx, setDataTrx] = useState([]);
	const [saldoTotal, setSaldoTotal] = useState(0);

	const uniqueCategories = Array.from(
		new Set(dataTrx.map((t) => t.nama_kategori).filter(Boolean)),
	);
	const COLORS = [
		"#125B2A",
		"#F4A300",
		"#8FA57A",
		"#517D3B",
		"#D1D5DB",
		"#3B82F6",
		"#EF4444",
		"#10B981",
	];

	// Opsi Filter 2 Bulanan
	const periodeOptions = [
		"Jan - Feb",
		"Mar - Apr",
		"Mei - Jun",
		"Jul - Ags",
		"Sep - Okt",
		"Nov - Des",
	];

	const getBulanPeriode = (isoString) => {
		if (!isoString) return "-";
		const m = new Date(isoString).getMonth();
		if (m <= 1) return `Jan - Feb`;
		if (m <= 3) return `Mar - Apr`;
		if (m <= 5) return `Mei - Jun`;
		if (m <= 7) return `Jul - Ags`;
		if (m <= 9) return `Sep - Okt`;
		return `Nov - Des`;
	};

	const getTahun = (isoString) => {
		if (!isoString) return "-";
		return new Date(isoString).getFullYear().toString();
	};

	// Ambil Data dari Backend (Sekali Aja Pas Load)
	useEffect(() => {
		const fetchData = async () => {
			try {
				const baseUrl = import.meta.env.VITE_API_URL;
				if (!baseUrl) throw new Error("API URL tidak ditemukan");

				const token =
					localStorage.getItem("token") || sessionStorage.getItem("token");
				const headers = { Authorization: `Bearer ${token}` };

				const [resTrx, resTab] = await Promise.all([
					fetch(`${baseUrl}/transaksi`, { headers }),
					fetch(`${baseUrl}/tabungan`, { headers }),
				]);

				const trx = await resTrx.json();
				const tab = await resTab.json();

				if (trx.status === "sukses" && Array.isArray(trx.data)) {
					const rawData = trx.data.sort((a, b) => b.id - a.id);
					setDataTrx(rawData);
				} else {
					setDataTrx([]);
				}

				if (tab.status === "sukses" && Array.isArray(tab.data)) {
					setSaldoTotal(
						tab.data.reduce((sum, item) => sum + (item.saldo || 0), 0),
					);
				} else {
					setSaldoTotal(0);
				}
			} catch (error) {
				console.error("Gagal mengambil data laporan:", error);
				setDataTrx([]);
				setSaldoTotal(0);
			}
		};
		fetchData();
	}, []);

	// Filter data sesuai periode 2 bulan yang dipilih
	const filteredData = dataTrx.filter((t) => {
		const matchBulan =
			selectedMonth === "Semua Periode" ||
			getBulanPeriode(t.tanggal) === selectedMonth;
		const matchTahun = getTahun(t.tanggal) === selectedYear;
		return matchBulan && matchTahun;
	});

	const totalBerat =
		filteredData.reduce((sum, t) => sum + (t.berat || t.berat_gram || 0), 0) /
		1000;
	const totalNilai = filteredData.reduce(
		(sum, t) => sum + (t.total_nilai || 0),
		0,
	);
	const totalTransaksi = filteredData.length;

	// GENERATOR GRAFIK DINAMIS BERDASARKAN FILTER
	const generateChartData = () => {
		if (filteredData.length === 0) return [];

		const monthNames = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"Mei",
			"Jun",
			"Jul",
			"Ags",
			"Sep",
			"Okt",
			"Nov",
			"Des",
		];
		const tempChart = {};

		let startMonth = 0;
		let endMonth = 11;

		if (selectedMonth !== "Semua Periode") {
			if (selectedMonth.startsWith("Jan")) {
				startMonth = 0;
				endMonth = 1;
			} else if (selectedMonth.startsWith("Mar")) {
				startMonth = 2;
				endMonth = 3;
			} else if (selectedMonth.startsWith("Mei")) {
				startMonth = 4;
				endMonth = 5;
			} else if (selectedMonth.startsWith("Jul")) {
				startMonth = 6;
				endMonth = 7;
			} else if (selectedMonth.startsWith("Sep")) {
				startMonth = 8;
				endMonth = 9;
			} else if (selectedMonth.startsWith("Nov")) {
				startMonth = 10;
				endMonth = 11;
			}
		} else {
			endMonth = new Date().getMonth();
			startMonth = endMonth - 5;
			if (startMonth < 0) startMonth = 0;
		}

		for (let i = startMonth; i <= endMonth; i++) {
			const monthKey = monthNames[i];
			const initObj = { bulan: monthKey, Pemasukan: 0, SaldoTabungan: 0 };
			uniqueCategories.forEach((kat) => {
				initObj[kat] = 0;
			});
			tempChart[monthKey] = initObj;
		}

		const ascData = [...filteredData].sort(
			(a, b) => new Date(a.tanggal) - new Date(b.tanggal),
		);

		ascData.forEach((item) => {
			const date = new Date(item.tanggal);
			const monthKey = monthNames[date.getMonth()];

			if (tempChart[monthKey]) {
				tempChart[monthKey].Pemasukan += item.total_nilai || 0;

				const kat = item.nama_kategori;
				const beratKg = (item.berat || item.berat_gram || 0) / 1000;

				if (kat && Object.hasOwn(tempChart[monthKey], kat)) {
					tempChart[monthKey][kat] += beratKg;
				}
			}
		});

		let runningSaldo = 0;
		return Object.keys(tempChart).map((key) => {
			runningSaldo += tempChart[key].Pemasukan;
			return { ...tempChart[key], SaldoTabungan: runningSaldo };
		});
	};

	const chartDataBulanan = generateChartData();

	const getPieDataKategori = () => {
		const pieMap = {};
		filteredData.forEach((t) => {
			const kat = t.nama_kategori || "Unknown";
			if (!pieMap[kat]) pieMap[kat] = 0;
			pieMap[kat] += (t.berat || t.berat_gram || 0) / 1000;
		});
		return Object.keys(pieMap)
			.map((k) => ({ name: k, value: pieMap[k] }))
			.filter((item) => item.value > 0);
	};
	const pieDataKategori = getPieDataKategori();

	const handleExport = () => {
		let dataToExport = dataTrx.filter(
			(t) => getTahun(t.tanggal) === exportYear,
		);

		if (exportPeriode !== "Semua Periode") {
			dataToExport = dataToExport.filter(
				(t) => getBulanPeriode(t.tanggal) === exportPeriode,
			);
		}

		if (dataToExport.length === 0) {
			alert("Tidak ada data untuk diexport pada periode ini.");
			return;
		}

		const worksheet = XLSX.utils.json_to_sheet(
			dataToExport.map((t) => ({
				"ID Transaksi": t.id,
				Tanggal: new Date(t.tanggal).toLocaleDateString("id-ID"),
				Wilayah: t.nama_wilayah,
				Kategori: t.nama_kategori,
				"Berat (kg)": (t.berat || t.berat_gram || 0) / 1000,
				"Total Nilai (Rp)": t.total_nilai,
				Petugas: t.nama_petugas,
				Status: t.status,
			})),
		);

		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Data Laporan");
		XLSX.writeFile(
			workbook,
			`Laporan_SIMTH_${exportPeriode.replace(/ /g, "")}_${exportYear}.xlsx`,
		);

		setIsExportModalOpen(false);
	};

	const formatRp = (angka) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(angka);

	return (
		<DashboardLayout>
			<div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex items-center justify-between shadow-sm mt-2 mb-8 text-white">
				<div className="flex items-center gap-5">
					<div className="bg-[#F4A300] p-4 rounded-2xl">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>
					<div>
						<h2 className="text-3xl font-extrabold mb-1">Laporan Lengkap</h2>
						<p className="text-green-100/80 font-medium">
							Statistik pengelolaan sampah komprehensif
						</p>
					</div>
				</div>

				<div className="flex items-center gap-4">
					{/* TAHUN FILTER */}
					<div className="bg-white text-gray-700 px-4 py-2.5 rounded-2xl flex items-center justify-between gap-3 font-bold shadow-sm border border-gray-100 h-[52px]">
						<span className="text-lg text-[#0B4D1E]">{selectedYear}</span>
						<div className="flex flex-col">
							<button
								onClick={() =>
									setSelectedYear((parseInt(selectedYear) + 1).toString())
								}
								className="text-gray-400 hover:text-[#0B4D1E] p-0.5"
							>
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
										strokeWidth={3}
										d="M5 15l7-7 7 7"
									/>
								</svg>
							</button>
							<button
								onClick={() =>
									setSelectedYear((parseInt(selectedYear) - 1).toString())
								}
								className="text-gray-400 hover:text-[#0B4D1E] p-0.5"
							>
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
										strokeWidth={3}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
						</div>
					</div>

					<div className="relative">
						<button
							onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
							className="bg-white text-gray-700 px-6 py-3.5 rounded-2xl flex items-center gap-3 font-bold shadow-sm hover:bg-gray-50 transition-all border border-gray-100 h-[52px]"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-black"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							{selectedMonth}
						</button>

						{/* FIX REVISI: UPDATE DROPDOWN LAYOUT AGAR SINKRON DENGAN LEADERBOARD */}
						{isMonthPickerOpen && (
							<div className="absolute top-full mt-3 right-0 w-80 bg-white p-4 rounded-[2rem] shadow-2xl border border-gray-100 z-50 flex flex-col gap-2">
								{/* Grid 6 Bulan Simetris 2 Kolom */}
								<div className="grid grid-cols-2 gap-2">
									{periodeOptions.map((opt) => (
										<button
											key={opt}
											onClick={() => {
												setSelectedMonth(opt);
												setIsMonthPickerOpen(false);
											}}
											className={`py-3 rounded-xl text-xs font-bold transition-all text-center ${selectedMonth === opt ? "bg-[#0B4D1E] text-white shadow-md" : "bg-[#F5EFE6] text-[#0B4D1E] hover:bg-[#EAE5DA]"}`}
										>
											{opt}
										</button>
									))}
								</div>
								{/* Tombol Semua Periode ditaruh paling bawah terpisah dari grid */}
								<button
									onClick={() => {
										setSelectedMonth("Semua Periode");
										setIsMonthPickerOpen(false);
									}}
									className={`mt-1 py-3 w-full rounded-xl text-sm font-bold transition-all text-center ${selectedMonth === "Semua Periode" ? "bg-[#0B4D1E] text-white shadow-md" : "bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]"}`}
								>
									Semua Periode
								</button>
							</div>
						)}
					</div>

					<button
						onClick={() => setIsExportModalOpen(true)}
						className="bg-[#F4A300] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#d68e00] transition-all shadow-md"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
							/>
						</svg>
						Export Laporan
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
				{[
					{
						title: "Total Sampah",
						val: `${totalBerat.toLocaleString("id-ID")} kg`,
						badge: "Berdasarkan Filter",
					},
					{
						title: "Nilai Ekonomi",
						val: `Rp ${totalNilai.toLocaleString("id-ID")}`,
						badge: "Berdasarkan Filter",
					},
					{
						title: "Total Transaksi",
						val: totalTransaksi,
						badge: "Berdasarkan Filter",
					},
					{
						title: "Saldo Tabungan Global",
						val: `Rp ${saldoTotal.toLocaleString("id-ID")}`,
						badge: "Total Keseluruhan",
					},
				].map((item, i) => (
					<div
						key={i}
						className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer"
					>
						<p className="text-gray-500 font-medium text-sm mb-1">
							{item.title}
						</p>
						<h3 className="text-3xl font-extrabold text-[#0B4D1E] mb-2">
							{item.val}
						</h3>
						<p className="text-xs font-bold text-green-600">{item.badge}</p>
					</div>
				))}
			</div>

			<div className="space-y-8">
				{/* GRAFIK 1: LINE CHART PEMASUKAN & SALDO TABUNGAN */}
				<div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
					<h3 className="font-extrabold text-2xl text-[#0B4D1E] mb-8">
						Nilai Ekonomi & Pemasukan Bulanan
					</h3>
					<div className="w-full h-80 pt-4">
						{chartDataBulanan.length > 0 &&
						chartDataBulanan.some((d) => d.Pemasukan > 0) ? (
							<ResponsiveContainer width="100%" height="100%">
								<LineChart
									data={chartDataBulanan}
									margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
								>
									<CartesianGrid strokeDasharray="3 3" vertical={false} />
									<XAxis
										dataKey="bulan"
										axisLine={false}
										tickLine={false}
										tick={{ fontSize: 12, fill: "#9CA3AF" }}
									/>
									<YAxis
										yAxisId="left"
										axisLine={false}
										tickLine={false}
										tick={{ fontSize: 12, fill: "#9CA3AF" }}
										tickFormatter={(v) => `Rp${v / 1000}k`}
									/>
									<Tooltip
										cursor={{ stroke: "#E5E7EB", strokeWidth: 2 }}
										contentStyle={{
											borderRadius: "1rem",
											border: "none",
											boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
										}}
										formatter={(val) => formatRp(val)}
									/>
									<Legend
										iconType="circle"
										wrapperStyle={{ paddingTop: "20px" }}
									/>
									<Line
										yAxisId="left"
										type="monotone"
										name="Pemasukan"
										dataKey="Pemasukan"
										stroke="#125B2A"
										strokeWidth={3}
										dot={{ r: 4, fill: "#125B2A" }}
										activeDot={{ r: 6 }}
										isAnimationActive={false}
									/>
									<Line
										yAxisId="left"
										type="monotone"
										name="Saldo Tabungan"
										dataKey="SaldoTabungan"
										stroke="#F4A300"
										strokeWidth={3}
										dot={{ r: 4, fill: "#F4A300" }}
										activeDot={{ r: 6 }}
										isAnimationActive={false}
									/>
								</LineChart>
							</ResponsiveContainer>
						) : (
							<div className="w-full h-full bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 flex items-center justify-center">
								<p className="text-gray-400 font-medium">
									Belum ada riwayat transaksi pada periode ini.
								</p>
							</div>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
					{/* GRAFIK 2: BAR CHART BREAKDOWN KATEGORI */}
					<div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between">
						<div>
							<h3 className="font-extrabold text-2xl text-[#0B4D1E] mb-2">
								Breakdown Kategori per Bulan
							</h3>
							<p className="text-gray-500 text-sm mb-6">
								Berat setoran per kategori per bulan (kg)
							</p>
						</div>
						<div className="w-full h-80 pt-4">
							{chartDataBulanan.length > 0 &&
							chartDataBulanan.some((d) =>
								uniqueCategories.some((kat) => d[kat] > 0),
							) ? (
								<ResponsiveContainer width="100%" height="100%">
									<BarChart
										data={chartDataBulanan}
										margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
									>
										<CartesianGrid strokeDasharray="3 3" vertical={false} />
										<XAxis
											dataKey="bulan"
											axisLine={false}
											tickLine={false}
											tick={{ fontSize: 12, fill: "#9CA3AF" }}
										/>
										<YAxis
											axisLine={false}
											tickLine={false}
											tick={{ fontSize: 12, fill: "#9CA3AF" }}
										/>
										<Tooltip
											cursor={{ fill: "#F3F4F6" }}
											contentStyle={{
												borderRadius: "1rem",
												border: "none",
												boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
											}}
											formatter={(val) => `${val.toFixed(1)} kg`}
										/>
										<Legend
											iconType="square"
											wrapperStyle={{ paddingTop: "20px" }}
										/>
										{uniqueCategories.map((kat, index) => (
											<Bar
												key={kat}
												name={`${kat} (kg)`}
												dataKey={kat}
												fill={COLORS[index % COLORS.length]}
												radius={[4, 4, 0, 0]}
												isAnimationActive={false}
											/>
										))}
									</BarChart>
								</ResponsiveContainer>
							) : (
								<div className="w-full h-full bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 flex items-center justify-center">
									<p className="text-gray-400 font-medium">
										Belum ada data berat sampah (kg) pada periode ini.
									</p>
								</div>
							)}
						</div>
					</div>

					{/* GRAFIK 3: PIE CHART KONTRIBUSI KATEGORI */}
					<div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between">
						<div>
							<h3 className="font-extrabold text-2xl text-[#0B4D1E] mb-2">
								Kontribusi Kategori
							</h3>
							<p className="text-gray-500 text-sm mb-6">
								Total pengumpulan sampah berdasarkan kategori (kg)
							</p>
						</div>
						<div className="w-full h-80 pt-4 relative flex items-center justify-center">
							{pieDataKategori.length > 0 ? (
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
										<Legend
											iconType="square"
											wrapperStyle={{ paddingTop: "20px" }}
										/>
										<Pie
											data={pieDataKategori}
											innerRadius={60}
											outerRadius={100}
											paddingAngle={2}
											dataKey="value"
											nameKey="name"
											label={({ name }) => name}
											labelLine={false}
											style={{ fontSize: "12px", fontWeight: "bold" }}
										>
											{pieDataKategori.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={COLORS[index % COLORS.length]}
												/>
											))}
										</Pie>
									</PieChart>
								</ResponsiveContainer>
							) : (
								<div className="w-full h-full bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 flex items-center justify-center">
									<p className="text-gray-400 font-medium">
										Belum ada data kontribusi kategori pada periode ini.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* FLOATING MODAL EXPORT LAPORAN */}
			{isExportModalOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
					<div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative animate-fade-in-up border border-gray-100">
						<div className="flex justify-between items-center mb-10">
							<div className="flex items-center gap-4">
								<div className="bg-[#FDF6EA] p-3 rounded-2xl text-[#F4A300] border border-[#F4A300]/20">
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
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
								</div>
								<h3 className="text-2xl font-extrabold text-[#0B4D1E]">
									Export Laporan
								</h3>
							</div>
							<button
								onClick={() => setIsExportModalOpen(false)}
								className="text-gray-400 hover:text-gray-600 transition-colors p-1"
							>
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
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<div className="space-y-8">
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-3">
									Tahun Laporan
								</label>
								<div className="w-full bg-[#F5EFE6] border-none px-5 py-2.5 rounded-2xl flex justify-between items-center h-[56px]">
									<span className="font-extrabold text-[#0B4D1E] text-lg">
										{exportYear}
									</span>
									<div className="flex flex-col">
										<button
											type="button"
											onClick={() =>
												setExportYear((parseInt(exportYear) + 1).toString())
											}
											className="text-gray-400 hover:text-[#0B4D1E] p-0.5"
										>
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
													strokeWidth={3}
													d="M5 15l7-7 7 7"
												/>
											</svg>
										</button>
										<button
											type="button"
											onClick={() =>
												setExportYear((parseInt(exportYear) - 1).toString())
											}
											className="text-gray-400 hover:text-[#0B4D1E] p-0.5"
										>
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
													strokeWidth={3}
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</button>
									</div>
								</div>
							</div>

							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-3">
									Pilih Periode
								</label>
								<div className="relative">
									<div
										onClick={() => setIsExportPeriodeOpen(!isExportPeriodeOpen)}
										className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-bold text-[#0B4D1E] flex justify-between items-center cursor-pointer transition-all hover:bg-[#EAE5DA]"
									>
										{exportPeriode}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className={`h-5 w-5 text-[#0B4D1E] transition-transform duration-300 ${isExportPeriodeOpen ? "rotate-180" : ""}`}
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={3}
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</div>

									{isExportPeriodeOpen && (
										<div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden z-50">
											{["Semua Periode", ...periodeOptions].map((opt) => (
												<div
													key={opt}
													onClick={() => {
														setExportPeriode(opt);
														setIsExportPeriodeOpen(false);
													}}
													className="px-5 py-4 hover:bg-[#F5EFE6] cursor-pointer text-sm font-bold text-[#0B4D1E] transition-colors"
												>
													{opt}
												</div>
											))}
										</div>
									)}
								</div>
							</div>

							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-3">
									Data yang Diexport
								</label>
								<div className="bg-[#F5EFE6] p-6 rounded-[2rem] space-y-5">
									{Object.keys(exportData).map((key) => (
										<label
											key={key}
											className="flex items-center gap-4 cursor-pointer group"
										>
											<input
												type="checkbox"
												checked={exportData[key]}
												onChange={() =>
													setExportData({
														...exportData,
														[key]: !exportData[key],
													})
												}
												className="w-5 h-5 text-[#125B2A] bg-white border-gray-300 rounded focus:ring-[#125B2A] cursor-pointer accent-[#125B2A]"
											/>
											<span className="text-sm font-bold text-[#0B4D1E] capitalize group-hover:text-[#F4A300] transition-colors">
												{key.replace(/([A-Z])/g, " $1").trim()}
											</span>
										</label>
									))}
								</div>
							</div>

							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-3">
									Format File
								</label>
								<div className="w-full bg-[#F4A300] text-white py-4 rounded-2xl font-bold flex justify-center shadow-sm cursor-default">
									Excel
								</div>
							</div>
						</div>

						<button
							onClick={handleExport}
							className="w-full bg-[#125B2A] text-white py-5 rounded-2xl font-bold mt-10 hover:bg-[#0B4D1E] hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								/>
							</svg>
							Export EXCEL
						</button>
					</div>
				</div>
			)}
		</DashboardLayout>
	);
}

export default LaporanPage;
