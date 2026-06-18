import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

function LeaderboardPage() {
	const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);

	const periodeList = [
		{ label: "Jan - Feb 2026", start: "2026-01-01", end: "2026-02-28" },
		{ label: "Mar - Apr 2026", start: "2026-03-01", end: "2026-04-30" },
		{ label: "Mei - Jun 2026", start: "2026-05-01", end: "2026-06-30" },
		{ label: "Jul - Ags 2026", start: "2026-07-01", end: "2026-08-31" },
		{ label: "Sep - Okt 2026", start: "2026-09-01", end: "2026-10-31" },
		{ label: "Nov - Des 2026", start: "2026-11-01", end: "2026-12-31" },
		{ label: "Semua Periode", start: "all", end: "all" },
	];

	const [filterPeriode, setFilterPeriode] = useState(periodeList[2]); // Default Mei-Jun
	const [leaderboardData, setLeaderboardData] = useState([]);
	const [loading, setLoading] = useState(true);

	// FETCH DARI BACKEND DENGAN FILTER TANGGAL
	useEffect(() => {
		const fetchLeaderboard = async () => {
			try {
				setLoading(true);
				const baseUrl = import.meta.env.VITE_API_URL;
				if (!baseUrl) throw new Error("API URL tidak ditemukan");

				const token =
					localStorage.getItem("token") || sessionStorage.getItem("token");
				if (!token) return;

				let url = `${baseUrl}/dashboard/leaderboard`;
				if (filterPeriode.start !== "all") {
					url += `?tanggal_mulai=${filterPeriode.start}&tanggal_akhir=${filterPeriode.end}`;
				}

				const response = await fetch(url, {
					headers: { Authorization: `Bearer ${token}` },
				});

				if (!response.ok) throw new Error("Gagal mengambil data server");
				const resData = await response.json();

				if (resData.status === "sukses" && Array.isArray(resData.data)) {
					const mappedData = resData.data.map((item, index) => ({
						rank: item.peringkat || index + 1,
						wilayah: item.nama_wilayah,
						kpi: item.poin_kpi,
						input: `${((item.total_berat_gram || 0) / 1000).toFixed(0)} kg`,
						nilai: `Rp ${(item.total_rupiah || 0).toLocaleString("id-ID")}`,
						trend: "flat",
					}));
					setLeaderboardData(mappedData);
				} else {
					setLeaderboardData([]);
				}
			} catch (error) {
				console.error("Gagal mengambil data leaderboard:", error);
				setLeaderboardData([]);
			} finally {
				setLoading(false);
			}
		};
		fetchLeaderboard();
	}, [filterPeriode]);

	const visibleData = isExpanded
		? leaderboardData
		: leaderboardData.slice(0, 5);

	return (
		<DashboardLayout>
			<div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm mt-2 mb-8">
				<div className="flex items-center gap-5 text-white mb-6 md:mb-0">
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
								d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
							/>
						</svg>
					</div>
					<div>
						<h2 className="text-3xl font-extrabold mb-1">
							Leaderboard KPI Wilayah
						</h2>
						<p className="text-green-100/80 font-medium">
							Peringkat kinerja wilayah berdasarkan KPI
						</p>
					</div>
				</div>

				{/* REVISI DROPDOWN FILTER KONSISTEN & RAPI */}
				<div className="relative">
					<button
						onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
						className="bg-[#F4A300] text-white px-6 py-4 rounded-2xl flex items-center gap-3 font-bold shadow-md hover:bg-[#d68e00] transition-all"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 text-white"
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
						{filterPeriode.label}
					</button>

					{isMonthPickerOpen && (
						<div className="absolute top-full mt-3 right-0 w-80 bg-white p-4 rounded-[2rem] shadow-2xl border border-gray-100 z-50 flex flex-col gap-2">
							{/* Grid 6 Bulan (Simetris 2 Kolom) */}
							<div className="grid grid-cols-2 gap-2">
								{periodeList
									.filter((p) => p.label !== "Semua Periode")
									.map((prd) => (
										<button
											key={prd.label}
											onClick={() => {
												setFilterPeriode(prd);
												setIsMonthPickerOpen(false);
											}}
											className={`py-3 px-2 rounded-xl text-xs font-bold transition-all text-center ${filterPeriode.label === prd.label ? "bg-[#0B4D1E] text-white shadow-md" : "bg-[#F5EFE6] text-[#0B4D1E] hover:bg-[#EAE5DA]"}`}
										>
											{prd.label}
										</button>
									))}
							</div>

							{/* Tombol Semua Periode dipisah di bawah */}
							<button
								onClick={() => {
									const semuaOpt = periodeList.find(
										(p) => p.label === "Semua Periode",
									);
									setFilterPeriode(semuaOpt);
									setIsMonthPickerOpen(false);
								}}
								className={`mt-1 py-3 w-full rounded-xl text-sm font-bold transition-all text-center ${filterPeriode.label === "Semua Periode" ? "bg-[#0B4D1E] text-white shadow-md" : "bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]"}`}
							>
								Semua Periode
							</button>
						</div>
					)}
				</div>
			</div>

			{loading ? (
				<div className="text-center py-20 text-gray-400 font-bold text-lg">
					Memuat data leaderboard...
				</div>
			) : leaderboardData.length === 0 ? (
				<div className="text-center py-20 text-gray-400 font-bold text-lg">
					Belum ada data untuk periode ini.
				</div>
			) : (
				<>
					<div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
						<h3 className="font-extrabold text-xl text-[#0B4D1E] mb-8">
							Top 3 Wilayah
						</h3>
						<div className="flex flex-col md:flex-row justify-center items-end gap-4 h-72 px-4 mb-10">
							<div className="w-full md:w-1/3 bg-[#E2E8F0] rounded-t-3xl h-[75%] flex flex-col items-center justify-center text-[#0B4D1E] relative shadow-lg hover:-translate-y-2 transition-transform cursor-pointer">
								<div className="absolute -top-6 bg-white p-2 rounded-full shadow-sm">
									<span className="text-xl">🥈</span>
								</div>
								<h2 className="text-4xl font-extrabold mb-1">#2</h2>
								<p className="font-bold text-lg text-center px-2">
									{leaderboardData[1]?.wilayah || "Belum Ada Data"}
								</p>
								<p className="text-sm font-medium opacity-90 mt-1">
									KPI: {leaderboardData[1]?.kpi ?? "-"}
								</p>
							</div>

							<div className="w-full md:w-1/3 bg-[#F4A300] rounded-t-3xl h-full flex flex-col items-center justify-center text-white relative shadow-2xl z-10 hover:-translate-y-3 transition-transform cursor-pointer">
								<div className="absolute -top-8 bg-white p-3 rounded-full shadow-md">
									<span className="text-3xl">🏆</span>
								</div>
								<h2 className="text-5xl font-extrabold mb-1">#1</h2>
								<p className="font-bold text-xl text-center px-2">
									{leaderboardData[0]?.wilayah || "Belum Ada Data"}
								</p>
								<p className="text-sm font-medium opacity-90 mt-1">
									KPI: {leaderboardData[0]?.kpi ?? "-"}
								</p>
							</div>

							<div className="w-full md:w-1/3 bg-[#CD7F32] rounded-t-3xl h-[60%] flex flex-col items-center justify-center text-white relative shadow-lg hover:-translate-y-2 transition-transform cursor-pointer">
								<div className="absolute -top-6 bg-white p-2 rounded-full shadow-sm">
									<span className="text-xl">🥉</span>
								</div>
								<h2 className="text-4xl font-extrabold mb-1">#3</h2>
								<p className="font-bold text-lg text-center px-2">
									{leaderboardData[2]?.wilayah || "Belum Ada Data"}
								</p>
								<p className="text-sm font-medium opacity-90 mt-1">
									KPI: {leaderboardData[2]?.kpi ?? "-"}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8 flex flex-col">
						<div className="p-6 pb-2">
							<h3 className="font-extrabold text-xl text-[#0B4D1E]">
								Ranking Lengkap
							</h3>
						</div>
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead className="bg-transparent text-[#0B4D1E]">
									<tr>
										<th className="px-8 py-5 font-bold">Rank</th>
										<th className="px-8 py-5 font-bold">Wilayah</th>
										<th className="px-8 py-5 font-bold">KPI</th>
										<th className="px-8 py-5 font-bold">Total Input</th>
										<th className="px-8 py-5 font-bold">Nilai Ekonomi</th>
										<th className="px-8 py-5 font-bold text-center">Trend</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-100">
									{visibleData.map((w, index) => (
										<tr
											key={w.rank || index}
											className="hover:bg-gray-50 transition-colors"
										>
											<td className="px-8 py-5">
												<div className="w-8 h-8 bg-[#F5EFE6] rounded-full flex items-center justify-center font-extrabold text-[#0B4D1E]">
													{w.rank}
												</div>
											</td>
											<td className="px-8 py-5 font-extrabold text-[#0B4D1E]">
												{w.wilayah || "-"}
											</td>
											<td className="px-8 py-5 font-extrabold text-[#F4A300]">
												{w.kpi ?? "-"}
											</td>
											<td className="px-8 py-5 font-bold text-[#0B4D1E]">
												{w.input || "0 kg"}
											</td>
											<td className="px-8 py-5 font-extrabold text-green-600">
												{w.nilai || "Rp 0"}
											</td>
											<td className="px-8 py-5 flex justify-center">
												{w.trend === "up" && (
													<div className="p-1.5 bg-green-100 text-green-600 rounded-full">
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
																d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
															/>
														</svg>
													</div>
												)}
												{w.trend === "down" && (
													<div className="p-1.5 bg-red-100 text-red-600 rounded-full">
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
																d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
															/>
														</svg>
													</div>
												)}
												{w.trend === "flat" && (
													<div className="p-1.5 bg-gray-100 text-gray-500 rounded-full">
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
																d="M20 12H4"
															/>
														</svg>
													</div>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{leaderboardData.length > 5 && (
							<div
								className="p-4 bg-gray-50 border-t border-gray-100 transition-colors hover:bg-gray-100 cursor-pointer"
								onClick={() => setIsExpanded(!isExpanded)}
							>
								<button className="text-[#0B4D1E] font-bold text-sm flex items-center justify-center gap-2 w-full outline-none">
									{isExpanded ? "Tutup Peringkat" : "Tampilkan Lebih Banyak"}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
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
						)}
					</div>
				</>
			)}

			<div className="bg-[#EAE5DA] p-8 rounded-[2rem] border border-[#0B4D1E]/10 mb-8 shadow-sm">
				<h3 className="font-extrabold text-xl text-[#0B4D1E] flex items-center gap-3 mb-6">
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
					Cara Menghitung Poin KPI
				</h3>
				<ul className="text-[15px] text-[#0B4D1E]/90 space-y-3 font-bold">
					<li>• Total input berat sampah secara relatif (Maksimal 40 Poin)</li>
					<li>
						• Total nilai ekonomi/pendapatan secara relatif (Maksimal 30 Poin)
					</li>
					<li>
						• Kualitas pemilahan sampah: Bersih/Terpilah (Maksimal 30 Poin)
					</li>
				</ul>
			</div>
		</DashboardLayout>
	);
}

export default LeaderboardPage;
