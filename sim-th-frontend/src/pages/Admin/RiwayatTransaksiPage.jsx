import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";

function RiwayatTransaksiPage() {
	const [selectedTrx, setSelectedTrx] = useState(null);
	const [historyData, setHistoryData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	// Summary computed from data
	const totalBerat = historyData.reduce(
		(acc, item) => acc + (item.berat_raw || 0),
		0,
	);
	const totalNilai = historyData.reduce(
		(acc, item) => acc + (item.nilai_raw || 0),
		0,
	);
	const formatRp = (angka) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(angka);

	useEffect(() => {
		const fetchRiwayat = async () => {
			try {
				setLoading(true);
				const token =
					localStorage.getItem("token") || sessionStorage.getItem("token");
				const baseUrl = import.meta.env.VITE_API_URL;
				if (!baseUrl || !token) return;

				const response = await fetch(`${baseUrl}/transaksi`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const result = await response.json();

				if (result.status === "sukses" && result.data) {
					const mapped = result.data.map((item, _idx) => ({
						id: item.id,
						id_trx: `#${String(item.id).padStart(4, "0")}`,
						tanggal: new Date(item.tanggal).toLocaleDateString("id-ID", {
							day: "numeric",
							month: "long",
							year: "numeric",
						}),
						wilayah: item.nama_wilayah || "-",
						user: item.nama_petugas || "-",
						kategori: item.nama_kategori || "-",
						berat: `${(item.berat / 1000).toFixed(1)} kg`,
						berat_raw: item.berat,
						nilai: formatRp(item.total_nilai),
						nilai_raw: item.total_nilai,
						status: item.status || "Selesai",
						catatan: item.catatan || "-",
					}));
					setHistoryData(mapped);
				}
			} catch (error) {
				console.error("Gagal fetch riwayat:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchRiwayat();
	}, [formatRp]);

	const filteredData = historyData.filter((item) => {
		const term = searchTerm.toLowerCase();
		return (
			item.wilayah.toLowerCase().includes(term) ||
			item.kategori.toLowerCase().includes(term) ||
			item.user.toLowerCase().includes(term) ||
			item.tanggal.toLowerCase().includes(term) ||
			item.catatan.toLowerCase().includes(term)
		);
	});

	return (
		<AdminLayout>
			{/* BANNER */}
			<div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex items-center gap-5 text-white mt-2 mb-8 shadow-sm">
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
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<div>
					<h2 className="text-3xl font-extrabold mb-1">Riwayat Transaksi</h2>
					<p className="text-green-100/80 font-medium">
						Semua transaksi sampah dari seluruh wilayah
					</p>
				</div>
			</div>

			{/* FILTER & SEARCH */}
			<div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
				<div className="relative">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<input
						type="text"
						placeholder="Cari wilayah, kategori, user, tanggal, catatan..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-all"
					/>
				</div>
			</div>

			{/* SUMMARY CARDS */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
					<p className="text-gray-400 text-sm font-medium mb-1">
						Total Transaksi
					</p>
					<h3 className="text-4xl font-extrabold text-[#0B4D1E]">
						{filteredData.length}
					</h3>
				</div>
				<div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
					<p className="text-gray-400 text-sm font-medium mb-1">Total Berat</p>
					<h3 className="text-4xl font-extrabold text-[#0B4D1E]">
						{(totalBerat / 1000).toFixed(0)} kg
					</h3>
				</div>
				<div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
					<p className="text-gray-400 text-sm font-medium mb-1">Total Nilai</p>
					<h3 className="text-4xl font-extrabold text-green-600">
						{formatRp(totalNilai)}
					</h3>
				</div>
			</div>

			{/* DAFTAR TRANSAKSI */}
			<div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
				<h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">
					Daftar Transaksi
				</h3>

				{loading ? (
					<div className="text-center py-10 text-gray-400 font-bold">
						Memuat data...
					</div>
				) : filteredData.length === 0 ? (
					<div className="text-center py-10 text-gray-400 font-bold">
						Belum ada data transaksi.
					</div>
				) : (
					<div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
						{filteredData.map((item) => (
							<div
								key={item.id}
								onClick={() => setSelectedTrx(item)}
								className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#F5EFE6] p-5 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-200 cursor-pointer group"
							>
								<div className="flex items-center gap-5 w-full md:w-auto mb-4 md:mb-0">
									<div className="bg-white p-4 rounded-xl text-green-600 shadow-sm group-hover:text-[#F4A300] transition-colors">
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
												d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
											/>
										</svg>
									</div>
									<div>
										<div className="flex items-center gap-3">
											<h4 className="font-extrabold text-[#0B4D1E] text-base group-hover:text-[#F4A300] transition-colors">
												{item.kategori} - {item.berat}
											</h4>
											<span className="bg-[#EAE5DA] text-[#0B4D1E] text-[10px] px-2 py-0.5 rounded-full font-bold">
												{item.wilayah}
											</span>
										</div>
										<p className="text-xs text-gray-500 font-medium mt-1">
											{item.tanggal} • {item.user}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
									<span
										className={`text-xs font-bold px-3 py-1.5 rounded-full ${item.status === "Selesai" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
									>
										{item.status}
									</span>
									<div className="font-extrabold text-[#0B4D1E] text-lg">
										{item.nilai}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* MODAL DETAIL */}
			{selectedTrx && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">
					<div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative animate-fade-in-up">
						<div className="flex justify-between items-center mb-6">
							<div className="flex items-center gap-4">
								<div className="bg-[#E8F5E9] p-3 rounded-full text-[#125B2A]">
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
											d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-extrabold text-[#0B4D1E]">
									Detail Transaksi
								</h3>
							</div>
							<button
								onClick={() => setSelectedTrx(null)}
								className="text-gray-500 hover:text-gray-800 transition-colors"
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
						<div className="flex flex-col">
							{[
								["ID Transaksi", selectedTrx.id_trx],
								["Tanggal", selectedTrx.tanggal],
								["Wilayah", selectedTrx.wilayah],
								["User", selectedTrx.user],
								["Kategori", selectedTrx.kategori],
								["Berat", selectedTrx.berat],
								["Nilai", selectedTrx.nilai],
								["Status", selectedTrx.status],
								["Catatan", selectedTrx.catatan],
							].map(([label, value], idx) => (
								<div
									key={idx}
									className="flex justify-between items-center py-4 border-b border-gray-100"
								>
									<span className="text-gray-400 font-medium text-sm">
										{label}
									</span>
									{label === "Kategori" ? (
										<span className="bg-[#F5EFE6] text-[#0B4D1E] px-3 py-1 rounded-full text-xs font-bold">
											{value}
										</span>
									) : label === "Status" ? (
										<span
											className={`px-3 py-1 rounded-full text-xs font-bold ${value === "Selesai" ? "bg-[#E8F5E9] text-green-700" : "bg-yellow-100 text-yellow-700"}`}
										>
											{value}
										</span>
									) : label === "Nilai" ? (
										<span className="font-extrabold text-green-600 text-sm">
											{value}
										</span>
									) : (
										<span className="font-extrabold text-[#0B4D1E] text-sm">
											{value}
										</span>
									)}
								</div>
							))}
						</div>
						<button
							onClick={() => setSelectedTrx(null)}
							className="w-full bg-[#125B2A] text-white py-4 rounded-full font-bold mt-8 hover:bg-[#0B4D1E] transition-all"
						>
							Tutup
						</button>
					</div>
				</div>
			)}
		</AdminLayout>
	);
}

export default RiwayatTransaksiPage;
