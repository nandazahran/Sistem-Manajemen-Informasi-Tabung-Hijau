import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

function AktivitasPage() {
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filterWaktu, setFilterWaktu] = useState("Semua Waktu");
	const [search, setSearch] = useState(""); // STATE BARU UNTUK SEARCH
	const [aktivitasData, setAktivitasData] = useState([]);

	const filterOptions = [
		"Semua Waktu",
		"Hari Ini",
		"Kemarin",
		"7 Hari Terakhir",
		"Bulan Ini",
	];

	// FETCH DATA MURNI DARI BACKEND
	useEffect(() => {
		const fetchAktivitas = async () => {
			try {
				const baseUrl = import.meta.env.VITE_API_URL;
				if (!baseUrl) throw new Error("API URL tidak ditemukan");

				const token =
					localStorage.getItem("token") || sessionStorage.getItem("token");
				const response = await fetch(`${baseUrl}/transaksi`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				if (!response.ok) throw new Error("Gagal mengambil data dari server");
				const resData = await response.json();

				if (resData.status === "sukses" && Array.isArray(resData.data)) {
					setAktivitasData(resData.data.sort((a, b) => b.id - a.id));
				} else {
					setAktivitasData([]);
				}
			} catch (error) {
				console.error("Gagal mengambil data aktivitas:", error);
				setAktivitasData([]);
			}
		};

		fetchAktivitas();
	}, []);

	const formatTanggalWaktu = (isoString) => {
		if (!isoString) return "-";
		const date = new Date(isoString);
		return date.toLocaleDateString("id-ID", {
			day: "numeric",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// LOGIKA GABUNGAN: SEARCH + FILTER WAKTU
	const filteredAktivitas = aktivitasData.filter((akt) => {
		// 1. Logic Search (Berdasarkan nama kategori, petugas, atau wilayah)
		const searchLower = search.toLowerCase();
		const matchSearch =
			search === "" ||
			akt.nama_kategori?.toLowerCase().includes(searchLower) ||
			akt.nama_petugas?.toLowerCase().includes(searchLower) ||
			akt.nama_wilayah?.toLowerCase().includes(searchLower);

		// 2. Logic Filter Waktu
		let matchWaktu = true;
		if (filterWaktu !== "Semua Waktu") {
			const d = new Date(akt.tanggal);
			const now = new Date();

			if (filterWaktu === "Hari Ini") {
				matchWaktu =
					d.getDate() === now.getDate() &&
					d.getMonth() === now.getMonth() &&
					d.getFullYear() === now.getFullYear();
			} else if (filterWaktu === "Kemarin") {
				const yesterday = new Date(now);
				yesterday.setDate(now.getDate() - 1);
				matchWaktu =
					d.getDate() === yesterday.getDate() &&
					d.getMonth() === yesterday.getMonth() &&
					d.getFullYear() === yesterday.getFullYear();
			} else if (filterWaktu === "7 Hari Terakhir") {
				const sevenDaysAgo = new Date(now);
				sevenDaysAgo.setDate(now.getDate() - 7);
				// Set ke jam 00:00:00 agar hitungan harinya presisi
				sevenDaysAgo.setHours(0, 0, 0, 0);
				matchWaktu = d >= sevenDaysAgo && d <= now;
			} else if (filterWaktu === "Bulan Ini") {
				matchWaktu =
					d.getMonth() === now.getMonth() &&
					d.getFullYear() === now.getFullYear();
			}
		}

		return matchSearch && matchWaktu;
	});

	return (
		<DashboardLayout>
			<div className="bg-[#0B4D1E] rounded-3xl p-10 flex items-center gap-4 text-white shadow-sm mt-2 mb-8">
				<div className="bg-[#F4A300] p-3 rounded-2xl">
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
							d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
						/>
					</svg>
				</div>
				<div>
					<h2 className="text-3xl font-extrabold mb-1">Aktivitas Terbaru</h2>
					<p className="text-green-100/80 font-medium">
						Timeline aktivitas dan riwayat sistem wilayah Anda
					</p>
				</div>
			</div>

			{/* FILTER CARD WRAPPER */}
			<div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
				{/* Searchbar AKTIF */}
				<div className="relative flex-1 w-full">
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
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Cari petugas, wilayah, atau kategori sampah..."
						className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow"
					/>
				</div>

				{/* DROPDOWN FILTER WAKTU (KONSISTEN) */}
				<div className="relative w-full md:w-64">
					<div
						onClick={() => setIsFilterOpen(!isFilterOpen)}
						className="bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl cursor-pointer flex justify-between items-center hover:bg-[#EAE5DA] transition-colors h-[56px]"
					>
						<span className="truncate">{filterWaktu}</span>
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
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</div>

					{isFilterOpen && (
						<div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden py-1">
							{filterOptions.map((opt) => (
								<div
									key={opt}
									onClick={() => {
										setFilterWaktu(opt);
										setIsFilterOpen(false);
									}}
									className={`px-5 py-2.5 cursor-pointer text-sm font-bold transition-colors ${filterWaktu === opt ? "bg-[#0B4D1E] text-white" : "text-[#0B4D1E] hover:bg-[#EAE5DA]"}`}
								>
									{opt}
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			<div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-6">
				<h3 className="font-extrabold text-xl text-[#0B4D1E] mb-8">
					Semua Aktivitas
				</h3>
				<div className="relative border-l-2 border-gray-100 ml-6 space-y-10">
					{filteredAktivitas.map((akt, idx) => (
						<div key={akt.id} className="relative pl-8 group">
							<div
								className={`absolute -left-[19px] top-0 w-9 h-9 rounded-full border-4 border-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${idx % 2 === 0 ? "bg-green-100 text-green-600" : "bg-yellow-100 text-[#F4A300]"}`}
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
										strokeWidth={2}
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
							</div>
							<div className="flex justify-between items-start">
								<div>
									<p className="font-bold text-[#0B4D1E] text-base group-hover:text-[#F4A300] transition-colors">
										Transaksi {akt.nama_kategori} berhasil dicatat
									</p>
									<p className="text-sm text-gray-500 font-medium mt-1">
										+{(akt.berat || akt.berat_gram || 0) / 1000} kg ditambahkan
										oleh {akt.nama_petugas}
									</p>
									<p className="text-xs text-gray-400 mt-2">
										{formatTanggalWaktu(akt.tanggal)} • Wilayah{" "}
										{akt.nama_wilayah}
									</p>
								</div>
								<div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
							</div>
						</div>
					))}
					{filteredAktivitas.length === 0 && (
						<p className="text-gray-500 font-bold italic py-4">
							Belum ada aktivitas untuk filter yang dipilih.
						</p>
					)}
				</div>
			</div>
		</DashboardLayout>
	);
}

export default AktivitasPage;
