import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";

function AdminLeaderboardPage() {
	const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [leaderboardData, setLeaderboardData] = useState([]);
	const [loading, setLoading] = useState(true);

	const periodeList = [
		{ label: "Jan - Feb 2026", start: "2026-01-01", end: "2026-02-28" },
		{ label: "Mar - Apr 2026", start: "2026-03-01", end: "2026-04-30" },
		{ label: "Mei - Jun 2026", start: "2026-05-01", end: "2026-06-30" },
		{ label: "Jul - Ags 2026", start: "2026-07-01", end: "2026-08-31" },
		{ label: "Sep - Okt 2026", start: "2026-09-01", end: "2026-10-31" },
		{ label: "Nov - Des 2026", start: "2026-11-01", end: "2026-12-31" },
	];

	const [filterPeriode, setFilterPeriode] = useState(periodeList[2]);

	// FETCH DARI BACKEND
	useEffect(() => {
		const fetchLeaderboard = async () => {
			try {
				setLoading(true);
				const token =
					localStorage.getItem("token") || sessionStorage.getItem("token");
				const baseUrl = import.meta.env.VITE_API_URL;
				if (!baseUrl || !token) return;

				const response = await fetch(
					`${baseUrl}/dashboard/leaderboard?tanggal_mulai=${filterPeriode.start}&tanggal_akhir=${filterPeriode.end}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					},
				);
				const result = await response.json();

				if (result.status === "sukses" && result.data) {
					const mapped = result.data.map((item, idx) => ({
						rank: item.peringkat || idx + 1,
						wilayah: item.nama_wilayah,
						kpi: item.poin_kpi,
						input: `${(item.total_berat_gram / 1000).toFixed(0)} kg`,
						nilai: `Rp ${item.total_rupiah.toLocaleString("id-ID")}`,
						trend: "flat",
					}));
					setLeaderboardData(mapped);
				}
			} catch (error) {
				console.error("Gagal fetch leaderboard:", error);
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
		<AdminLayout>
			{/* BANNER & FILTER 2 BULANAN */}
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

				{/* CUSTOM DROPDOWN FILTER 2 BULANAN */}
				<div className="relative">
					<button
						onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
						className="bg-[#F4A300] text-white px-6 py-4 rounded-2xl flex items-center gap-3 font-bold shadow-md hover:bg-[#d68e00] transition-all"
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
						{filterPeriode.label}
					</button>

					{isMonthPickerOpen && (
						<div className="absolute top-full mt-3 right-0 w-80 bg-white p-4 rounded-[2rem] shadow-2xl border border-gray-100 z-50 grid grid-cols-2 gap-2">
							{periodeList.map((prd) => (
								<button
									key={prd.label}
									onClick={() => {
										setFilterPeriode(prd);
										setIsMonthPickerOpen(false);
									}}
									className={`py-3 rounded-xl text-xs font-bold transition-all text-center ${filterPeriode.label === prd.label ? "bg-[#0B4D1E] text-white" : "bg-[#F5EFE6] text-[#0B4D1E] hover:bg-[#F4A300] hover:text-white"}`}
								>
									{prd.label}
								</button>
							))}
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
					{/* TOP 3 PODIUM - WARNA EMAS PERAK PERUNGGU */}
					<div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
						<h3 className="font-extrabold text-xl text-[#0B4D1E] mb-8">
							Top 3 Wilayah
						</h3>
						<div className="flex flex-col md:flex-row justify-center items-end gap-4 h-72 px-4 mb-10">
							{/* #2 Rank (Silver) */}
							{leaderboardData[1] && (
								<div className="w-full md:w-1/3 bg-[#E2E8F0] rounded-t-3xl h-[75%] flex flex-col items-center justify-center text-[#0B4D1E] relative shadow-lg hover:-translate-y-2 transition-transform cursor-pointer">
									<div className="absolute -top-6 bg-white p-2 rounded-full shadow-sm">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6 text-gray-500"
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
									<h2 className="text-4xl font-extrabold mb-1">#2</h2>
									<p className="font-bold text-lg">
										{leaderboardData[1].wilayah}
									</p>
									<p className="text-sm font-medium opacity-90 mt-1">
										KPI: {leaderboardData[1].kpi}
									</p>
								</div>
							)}
							{/* #1 Rank (Emas) */}
							{leaderboardData[0] && (
								<div className="w-full md:w-1/3 bg-[#F4A300] rounded-t-3xl h-full flex flex-col items-center justify-center text-white relative shadow-2xl z-10 hover:-translate-y-3 transition-transform cursor-pointer">
									<div className="absolute -top-8 bg-white p-3 rounded-full shadow-md">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-8 w-8 text-[#F4A300]"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<h2 className="text-5xl font-extrabold mb-1">#1</h2>
									<p className="font-bold text-xl">
										{leaderboardData[0].wilayah}
									</p>
									<p className="text-sm font-medium opacity-90 mt-1">
										KPI: {leaderboardData[0].kpi}
									</p>
								</div>
							)}
							{/* #3 Rank (Bronze) */}
							{leaderboardData[2] && (
								<div className="w-full md:w-1/3 bg-[#CD7F32] rounded-t-3xl h-[60%] flex flex-col items-center justify-center text-white relative shadow-lg hover:-translate-y-2 transition-transform cursor-pointer">
									<div className="absolute -top-6 bg-white p-2 rounded-full shadow-sm">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6 text-[#CD7F32]"
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
									<h2 className="text-4xl font-extrabold mb-1">#3</h2>
									<p className="font-bold text-lg">
										{leaderboardData[2].wilayah}
									</p>
									<p className="text-sm font-medium opacity-90 mt-1">
										KPI: {leaderboardData[2].kpi}
									</p>
								</div>
							)}
						</div>
					</div>

					{/* RANKING LENGKAP TABLE */}
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
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-100">
									{visibleData.map((w) => (
										<tr
											key={w.rank}
											className="hover:bg-gray-50 transition-colors"
										>
											<td className="px-8 py-5">
												<div className="w-8 h-8 bg-[#F5EFE6] rounded-full flex items-center justify-center font-extrabold text-[#0B4D1E]">
													{w.rank}
												</div>
											</td>
											<td className="px-8 py-5 font-extrabold text-[#0B4D1E]">
												{w.wilayah}
											</td>
											<td className="px-8 py-5 font-extrabold text-[#F4A300]">
												{w.kpi}
											</td>
											<td className="px-8 py-5 font-bold text-[#0B4D1E]">
												{w.input}
											</td>
											<td className="px-8 py-5 font-extrabold text-green-600">
												{w.nilai}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* TOMBOL EXPAND */}
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

			{/* CARDS INFORMATION KPI BREAKDOWN */}
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
		</AdminLayout>
	);
}

export default AdminLeaderboardPage;
