import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";

function KelolaTransaksiPage() {
	const [toastMessage, setToastMessage] = useState("");

	// States Modal
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedTx, setSelectedTx] = useState(null);

	// Form State
	const [editForm, setEditForm] = useState({
		tanggal: "",
		wilayah: "",
		kategori_id: "",
		berat: "",
		nilai: "",
		status: "",
		catatan: "",
		penilaian: { kebersihan: "", pemilahan: "", kondisi: "" },
	});
	const [penilaian, setPenilaian] = useState({
		kebersihan: "",
		pemilahan: "",
		kondisi: "",
	});

	// States Filter & Search
	const [searchTerm, setSearchTerm] = useState("");
	const [filterWilayah, setFilterWilayah] = useState("");
	const [filterKategori, setFilterKategori] = useState("");
	const [filterBulan, setFilterBulan] = useState("");
	const [filterStatus, setFilterStatus] = useState("");

	const [_isWilayahOpen, _setIsWilayahOpen] = useState(false);
	const [_isKategoriOpen, _setIsKategoriOpen] = useState(false);
	const [_isBulanOpen, _setIsBulanOpen] = useState(false);
	const [_isStatusOpen, _setIsStatusOpen] = useState(false);

	// Data from Backend
	const [transactions, setTransactions] = useState([]);
	const [wilayahs, setWilayahs] = useState([]);
	const [categories, setCategories] = useState([]);
	const [_loading, setLoading] = useState(true);

	const opsiPenilaian = [
		"Sangat Baik",
		"Baik",
		"Cukup",
		"Kurang",
		"Sangat Kurang",
	];
	const nilaiMap = {
		"Sangat Baik": 10,
		Baik: 8,
		Cukup: 6,
		Kurang: 4,
		"Sangat Kurang": 2,
	};

	const formatRp = (angka) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(angka);
	const getToken = () =>
		localStorage.getItem("token") || sessionStorage.getItem("token");
	const baseUrl = import.meta.env.VITE_API_URL;

	const fetchData = async () => {
		try {
			setLoading(true);
			const token = getToken();
			if (!token || !baseUrl) return;
			const headers = { Authorization: `Bearer ${token}` };

			const [txRes, catRes, wilRes] = await Promise.all([
				fetch(`${baseUrl}/transaksi`, { headers }),
				fetch(`${baseUrl}/kategori`, { headers }),
				fetch(`${baseUrl}/wilayah`, { headers }),
			]);

			const txResult = await txRes.json();
			const catResult = await catRes.json();
			const wilResult = await wilRes.json();

			if (catResult.status === "sukses" && catResult.data)
				setCategories(catResult.data);
			if (wilResult.status === "sukses" && wilResult.data)
				setWilayahs(wilResult.data);

			if (txResult.status === "sukses" && txResult.data) {
				const getEvalStrings = (poin) => {
					if (poin === 0) return { kebersihan: "", pemilahan: "", kondisi: "" };
					if (poin >= 25)
						return {
							kebersihan: "Sangat Baik",
							pemilahan: "Baik",
							kondisi: "Sangat Baik",
						};
					if (poin >= 15)
						return {
							kebersihan: "Cukup",
							pemilahan: "Cukup",
							kondisi: "Cukup",
						};
					return {
						kebersihan: "Kurang",
						pemilahan: "Kurang",
						kondisi: "Kurang",
					};
				};

				const mapped = txResult.data.map((item) => ({
					id: item.id,
					id_trx: `#${String(item.id).padStart(4, "0")}`,
					tanggal: new Date(item.tanggal).toLocaleDateString("id-ID", {
						day: "numeric",
						month: "long",
						year: "numeric",
					}),
					tanggal_raw: item.tanggal,
					wilayah: item.nama_wilayah || "-",
					kategori: item.nama_kategori || "-",
					kategori_id: item.kategori_id,
					berat: `${(item.berat / 1000).toFixed(1)}`,
					berat_raw: item.berat,
					nilai: item.total_nilai,
					status: item.status || "Selesai",
					petugas: item.nama_petugas || "-",
					catatan: item.catatan || "-",
					poin_kualitas: item.poin_kualitas || 0,
					penilaian: getEvalStrings(item.poin_kualitas || 0),
				}));
				setTransactions(mapped);
			}
		} catch (error) {
			console.error("Gagal fetch data:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Derived unique months from transactions for filter
	const uniqueMonths = [
		...new Set(
			transactions.map((tx) => tx.tanggal.split(" ").slice(1).join(" ")),
		),
	];

	// Logic Filter
	const filteredTransactions = transactions.filter((tx) => {
		const matchSearch =
			tx.wilayah.toLowerCase().includes(searchTerm.toLowerCase()) ||
			tx.tanggal.toLowerCase().includes(searchTerm.toLowerCase()) ||
			tx.catatan.toLowerCase().includes(searchTerm.toLowerCase());
		const matchWilayah =
			!filterWilayah ||
			tx.wilayah.toLowerCase().includes(filterWilayah.toLowerCase());
		const matchKategori =
			!filterKategori ||
			tx.kategori.toLowerCase().includes(filterKategori.toLowerCase());
		const matchBulan = !filterBulan || tx.tanggal.includes(filterBulan);
		const matchStatus = !filterStatus || tx.status === filterStatus;
		return (
			matchSearch && matchWilayah && matchKategori && matchBulan && matchStatus
		);
	});

	const showToast = (msg, type = "success") => {
		setToastMessage({ msg, type });
		setTimeout(() => setToastMessage(""), 3000);
	};
	const _closeAllDropdowns = () => {}; // No longer needed with datalist

	const handleView = (tx) => {
		setSelectedTx(tx);
		setPenilaian({ kebersihan: "", pemilahan: "", kondisi: "" });
		setIsDetailOpen(true);
	};

	const handleEdit = (tx) => {
		setSelectedTx(tx);
		const d = new Date(tx.tanggal_raw);
		const tgl = Number.isNaN(d) ? "" : d.toISOString().split("T")[0];
		setEditForm({
			tanggal: tgl,
			wilayah: tx.wilayah,
			kategori_id: tx.kategori_id,
			berat: tx.berat,
			nilai: tx.nilai,
			status: tx.status,
			catatan: tx.catatan === "-" ? "" : tx.catatan,
			penilaian: tx.penilaian,
		});
		setIsEditOpen(true);
	};

	const handleDeleteClick = (tx) => {
		setSelectedTx(tx);
		setIsDeleteOpen(true);
	};

	const confirmDelete = async () => {
		try {
			const token = getToken();
			const res = await fetch(`${baseUrl}/transaksi/${selectedTx.id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			const result = await res.json();
			if (result.status === "sukses") {
				showToast(`Transaksi ${selectedTx.id_trx} berhasil dihapus!`, "error");
				fetchData();
			} else {
				showToast(result.pesan || "Gagal menghapus transaksi", "error");
			}
		} catch (error) {
			console.error(error);
			showToast("Terjadi kesalahan", "error");
		}
		setIsDeleteOpen(false);
	};

	const saveEdit = async () => {
		try {
			const token = getToken();
			const totalPoin =
				(nilaiMap[editForm.penilaian.kebersihan] || 0) +
				(nilaiMap[editForm.penilaian.pemilahan] || 0) +
				(nilaiMap[editForm.penilaian.kondisi] || 0);
			const payload = {
				kategori_id: parseInt(editForm.kategori_id, 10),
				berat_gram: Math.round(parseFloat(editForm.berat) * 1000),
				poin_kualitas: totalPoin || selectedTx.poin_kualitas, // default to previous if untouched
				catatan: editForm.catatan,
				tanggal: new Date(editForm.tanggal).toISOString(),
			};

			const res = await fetch(`${baseUrl}/transaksi/${selectedTx.id}`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
			const result = await res.json();
			if (result.status === "sukses") {
				showToast("Data transaksi berhasil diperbarui!");
				fetchData();
			} else {
				showToast(result.pesan || "Gagal mengedit transaksi", "error");
			}
		} catch (error) {
			console.error(error);
			showToast("Terjadi kesalahan", "error");
		}
		setIsEditOpen(false);
	};

	const savePenilaian = async () => {
		if (!penilaian.kebersihan || !penilaian.pemilahan || !penilaian.kondisi) {
			alert("Harap isi semua kriteria penilaian KPI!");
			return;
		}

		try {
			const token = getToken();
			const totalPoin =
				nilaiMap[penilaian.kebersihan] +
				nilaiMap[penilaian.pemilahan] +
				nilaiMap[penilaian.kondisi];

			const payload = {
				kategori_id: selectedTx.kategori_id,
				berat_gram: selectedTx.berat_raw,
				poin_kualitas: totalPoin,
				catatan: selectedTx.catatan,
				tanggal: selectedTx.tanggal_raw,
			};

			const res = await fetch(`${baseUrl}/transaksi/${selectedTx.id}`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const result = await res.json();
			if (result.status === "sukses") {
				showToast("Penilaian KPI berhasil disimpan!");
				fetchData();
			} else {
				showToast(result.pesan || "Gagal menyimpan penilaian", "error");
			}
		} catch (error) {
			console.error(error);
			showToast("Terjadi kesalahan", "error");
		}
		setIsDetailOpen(false);
	};

	return (
		<AdminLayout>
			<style>{`@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        /* Hilangkan dropdown panah default datalist di beberapa browser */
        input::-webkit-calendar-picker-indicator { opacity: 0; }
      `}</style>

			{/* BANNER UTAMA */}
			<div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm mt-2 mb-8">
				<div className="flex items-center gap-5 text-white">
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
						<h2 className="text-3xl font-extrabold mb-1">Kelola Transaksi</h2>
						<p className="text-green-100/80 font-medium">
							Penilaian & Manajemen transaksi sampah seluruh wilayah
						</p>
					</div>
				</div>
			</div>

			{/* FILTER & SEARCHBAR (Searchable Combobox / Datalist) */}
			<div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col gap-4">
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
						placeholder="Cari global wilayah, tanggal, catatan..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-all"
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					{/* Dropdown Wilayah */}
					<div className="relative">
						<select
							value={filterWilayah}
							onChange={(e) => setFilterWilayah(e.target.value)}
							className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer"
						>
							<option value="">Semua Wilayah</option>
							{wilayahs.map((w) => (
								<option key={w.id} value={w.nama}>
									{w.nama}
								</option>
							))}
						</select>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4D1E] pointer-events-none"
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

					{/* Dropdown Kategori */}
					<div className="relative">
						<select
							value={filterKategori}
							onChange={(e) => setFilterKategori(e.target.value)}
							className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer"
						>
							<option value="">Semua Kategori</option>
							{categories.map((c) => (
								<option key={c.id} value={c.nama_kategori}>
									{c.nama_kategori}
								</option>
							))}
						</select>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4D1E] pointer-events-none"
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

					{/* Dropdown Bulan */}
					<div className="relative">
						<select
							value={filterBulan}
							onChange={(e) => setFilterBulan(e.target.value)}
							className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer"
						>
							<option value="">Semua Bulan</option>
							{uniqueMonths.map((m) => (
								<option key={m} value={m}>
									{m}
								</option>
							))}
						</select>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4D1E] pointer-events-none"
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

					{/* Dropdown Status */}
					<div className="relative">
						<select
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer"
						>
							<option value="">Semua Status</option>
							<option value="Sudah Dinilai">Sudah Dinilai</option>
							<option value="Belum Dinilai">Belum Dinilai</option>
						</select>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4D1E] pointer-events-none"
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
				</div>
			</div>

			{/* TABEL DATA TRANSAKSI */}
			<div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead className="bg-[#F5EFE6] text-[#0B4D1E]">
							<tr>
								<th className="px-8 py-5 font-bold">Tanggal</th>
								<th className="px-8 py-5 font-bold">Wilayah</th>
								<th className="px-8 py-5 font-bold">Kategori</th>
								<th className="px-8 py-5 font-bold">Berat (kg)</th>
								<th className="px-8 py-5 font-bold">Nilai</th>
								<th className="px-8 py-5 font-bold">Status</th>
								<th className="px-8 py-5 font-bold text-center">Aksi</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{filteredTransactions.map((tx) => (
								<tr key={tx.id} className="hover:bg-gray-50 transition-colors">
									<td className="px-8 py-5 text-gray-500 font-medium">
										{tx.tanggal}
									</td>
									<td className="px-8 py-5 font-extrabold text-[#0B4D1E]">
										{tx.wilayah}
									</td>
									<td className="px-8 py-5">
										<span className="bg-[#EAE5DA] text-[#0B4D1E] text-xs px-3 py-1 rounded-full font-bold">
											{tx.kategori}
										</span>
									</td>
									<td className="px-8 py-5 font-bold text-[#0B4D1E]">
										{tx.berat}
									</td>
									<td className="px-8 py-5 font-extrabold text-green-600">
										{formatRp(tx.nilai)}
									</td>
									<td className="px-8 py-5">
										<span
											className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap ${tx.status === "Sudah Dinilai" ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#FFF8E1] text-[#F4A300]"}`}
										>
											{tx.status}
										</span>
									</td>
									<td className="px-8 py-5 flex items-center justify-center gap-2">
										<button
											onClick={() => handleView(tx)}
											className="p-2 text-gray-400 hover:text-[#0B4D1E] hover:bg-[#EAE5DA] rounded-lg transition-all"
											title="Detail & Nilai"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
												<path
													fillRule="evenodd"
													d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
										<button
											onClick={() => handleEdit(tx)}
											className="p-2 text-gray-400 hover:text-[#F4A300] hover:bg-[#FDF6EA] rounded-lg transition-all"
											title="Edit Transaksi"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
											</svg>
										</button>
										<button
											onClick={() => handleDeleteClick(tx)}
											className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
											title="Hapus"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* MODAL 1: DETAIL TRANSAKSI & PENILAIAN */}
			{isDetailOpen && selectedTx && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
					<div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative animate-fade-in-up border border-gray-100 my-8">
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
								onClick={() => setIsDetailOpen(false)}
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

						<div className="flex flex-col mb-8">
							<div className="flex justify-between items-center py-3 border-b border-gray-100">
								<span className="text-gray-400 font-medium text-sm">
									ID Transaksi
								</span>
								<span className="font-extrabold text-[#0B4D1E] text-sm">
									{selectedTx.id_trx}
								</span>
							</div>
							<div className="flex justify-between items-center py-3 border-b border-gray-100">
								<span className="text-gray-400 font-medium text-sm">
									Tanggal
								</span>
								<span className="font-extrabold text-[#0B4D1E] text-sm">
									{selectedTx.tanggal}
								</span>
							</div>
							<div className="flex justify-between items-center py-3 border-b border-gray-100">
								<span className="text-gray-400 font-medium text-sm">
									Wilayah
								</span>
								<span className="font-extrabold text-[#0B4D1E] text-sm">
									{selectedTx.wilayah}
								</span>
							</div>
							<div className="flex justify-between items-center py-3 border-b border-gray-100">
								<span className="text-gray-400 font-medium text-sm">User</span>
								<span className="font-extrabold text-[#0B4D1E] text-sm">
									{selectedTx.petugas}
								</span>
							</div>
							<div className="flex justify-between items-center py-3 border-b border-gray-100">
								<span className="text-gray-400 font-medium text-sm">
									Kategori
								</span>
								<span className="bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 rounded-full text-xs font-bold">
									{selectedTx.kategori}
								</span>
							</div>
							<div className="flex justify-between items-center py-3 border-b border-gray-100">
								<span className="text-gray-400 font-medium text-sm">Berat</span>
								<span className="font-extrabold text-[#0B4D1E] text-sm">
									{selectedTx.berat} kg
								</span>
							</div>
							<div className="flex justify-between items-center py-3 border-b border-gray-100">
								<span className="text-gray-400 font-medium text-sm">Nilai</span>
								<span className="font-extrabold text-green-600 text-sm">
									{formatRp(selectedTx.nilai)}
								</span>
							</div>
							<div className="flex justify-between items-center py-3 border-b border-gray-100">
								<span className="text-gray-400 font-medium text-sm">
									Status
								</span>
								<span
									className={`px-3 py-1 rounded-full text-[10px] font-bold ${selectedTx.status === "Sudah Dinilai" ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#FFF8E1] text-[#F4A300]"}`}
								>
									{selectedTx.status}
								</span>
							</div>
							<div className="py-3 border-b border-gray-100">
								<span className="text-gray-400 font-medium text-sm block mb-1">
									Catatan Setoran
								</span>
								<span className="font-bold text-[#0B4D1E] text-sm">
									{selectedTx.catatan}
								</span>
							</div>
						</div>

						{/* FORM PENILAIAN KPI DI DETAIL (UNTUK TRANSAKSI BARU / BELUM DINILAI) */}
						{selectedTx.status === "Belum Dinilai" ? (
							<div className="bg-[#F5EFE6] p-5 rounded-2xl mb-6 border border-[#0B4D1E]/10">
								<h4 className="font-extrabold text-[#0B4D1E] mb-4 flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-[#F4A300]"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
									Beri Penilaian Kualitas (KPI)
								</h4>

								{["kebersihan", "pemilahan", "kondisi"].map(
									(kriteria, index) => (
										<div key={kriteria} className="mb-4">
											<label className="block text-xs font-bold text-gray-500 mb-2 capitalize">
												{index + 1}.{" "}
												{kriteria === "kondisi"
													? "Kondisi (Basah/Kering)"
													: kriteria}
											</label>
											<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
												{opsiPenilaian.map((opsi) => (
													<label
														key={`${kriteria}-${opsi}`}
														className={`text-center py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${penilaian[kriteria] === opsi ? "bg-[#0B4D1E] text-white" : "bg-white text-gray-500 border border-gray-200"}`}
													>
														<input
															type="radio"
															className="hidden"
															name={`detail-${kriteria}`}
															value={opsi}
															onChange={(e) =>
																setPenilaian({
																	...penilaian,
																	[kriteria]: e.target.value,
																})
															}
														/>{" "}
														{opsi}
													</label>
												))}
											</div>
										</div>
									),
								)}
							</div>
						) : (
							/* TAMPILAN HASIL PENILAIAN JIKA SUDAH DINILAI */
							<div className="bg-[#E8F5E9] p-5 rounded-2xl mb-6 border border-[#A5D6A7]">
								<p className="font-bold text-[#2E7D32] text-sm mb-3 border-b border-[#A5D6A7] pb-2">
									✅ Hasil Penilaian Kualitas (KPI)
								</p>
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-xs text-[#2E7D32] font-medium">
											Kebersihan
										</span>
										<span className="text-xs font-extrabold text-[#0B4D1E]">
											{selectedTx.penilaian?.kebersihan || "-"}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-xs text-[#2E7D32] font-medium">
											Pemilahan
										</span>
										<span className="text-xs font-extrabold text-[#0B4D1E]">
											{selectedTx.penilaian?.pemilahan || "-"}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-xs text-[#2E7D32] font-medium">
											Kondisi
										</span>
										<span className="text-xs font-extrabold text-[#0B4D1E]">
											{selectedTx.penilaian?.kondisi || "-"}
										</span>
									</div>
								</div>
							</div>
						)}

						{/* REVISI: TAMBAH TOMBOL BATAL DI SEBELAH SIMPAN PENILAIAN */}
						{selectedTx.status === "Belum Dinilai" ? (
							<div className="flex gap-4">
								<button
									onClick={() => setIsDetailOpen(false)}
									className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-full font-bold hover:bg-[#EAE5DA] transition-all"
								>
									Batal
								</button>
								<button
									onClick={savePenilaian}
									className="flex-1 bg-[#125B2A] text-white py-4 rounded-full font-bold hover:bg-[#0B4D1E] transition-all shadow-md"
								>
									Simpan Penilaian
								</button>
							</div>
						) : (
							<button
								onClick={() => setIsDetailOpen(false)}
								className="w-full bg-[#125B2A] text-white py-4 rounded-full font-bold hover:bg-[#0B4D1E] transition-all"
							>
								Tutup
							</button>
						)}
					</div>
				</div>
			)}

			{/* MODAL 2: EDIT TRANSAKSI (SESUAI GAMBAR 2) */}
			{isEditOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
					<div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-fade-in-up border border-gray-100 my-8">
						<div className="flex justify-between items-center mb-6">
							<div className="flex items-center gap-4">
								<div className="bg-[#FFF8E1] p-3 rounded-full text-[#F4A300]">
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
											d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-extrabold text-[#0B4D1E]">
									Edit Transaksi
								</h3>
							</div>
							<button
								onClick={() => setIsEditOpen(false)}
								className="text-[#0B4D1E] hover:text-red-500 transition-colors"
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

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Tanggal
								</label>
								<input
									type="date"
									value={editForm.tanggal}
									onChange={(e) =>
										setEditForm({ ...editForm, tanggal: e.target.value })
									}
									className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] cursor-pointer"
								/>
							</div>
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Wilayah
								</label>
								<div className="relative">
									<input
										type="text"
										value={editForm.wilayah}
										disabled
										className="w-full bg-[#EAE5DA] px-5 py-4 rounded-2xl font-bold text-gray-500 cursor-not-allowed border border-gray-200"
										title="Wilayah tidak dapat diubah"
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Kategori
								</label>
								<div className="relative">
									<select
										value={editForm.kategori_id}
										onChange={(e) =>
											setEditForm({ ...editForm, kategori_id: e.target.value })
										}
										className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer"
									>
										{categories.map((c) => (
											<option key={c.id} value={c.id}>
												{c.nama_kategori}
											</option>
										))}
									</select>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4D1E] pointer-events-none"
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
							</div>
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Berat (kg)
								</label>
								<div className="flex items-center bg-[#F5EFE6] rounded-2xl px-2">
									<input
										type="number"
										step="0.01"
										value={editForm.berat}
										onChange={(e) =>
											setEditForm({ ...editForm, berat: e.target.value })
										}
										className="w-full bg-transparent px-3 py-4 font-medium text-[#0B4D1E] outline-none"
									/>
									<div className="flex flex-col border-l border-gray-300 pl-2">
										<button
											onClick={() =>
												setEditForm({
													...editForm,
													berat: (
														parseFloat(editForm.berat || 0) + 1
													).toString(),
												})
											}
											className="text-gray-500 hover:text-[#0B4D1E]"
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
												setEditForm({
													...editForm,
													berat: Math.max(
														0,
														parseFloat(editForm.berat || 0) - 1,
													).toString(),
												})
											}
											className="text-gray-500 hover:text-[#0B4D1E]"
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
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Nilai Ekonomi (Rp)
								</label>
								<input
									type="number"
									value={editForm.nilai}
									onChange={(e) =>
										setEditForm({ ...editForm, nilai: e.target.value })
									}
									className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]"
								/>
							</div>
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Status
								</label>
								<div className="relative">
									<select
										value={editForm.status}
										onChange={(e) =>
											setEditForm({ ...editForm, status: e.target.value })
										}
										className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer"
									>
										<option value="Sudah Dinilai">Sudah Dinilai</option>
										<option value="Belum Dinilai">Belum Dinilai</option>
									</select>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4D1E] pointer-events-none"
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
							</div>
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Catatan Setoran
								</label>
								<input
									type="text"
									value={editForm.catatan}
									onChange={(e) =>
										setEditForm({ ...editForm, catatan: e.target.value })
									}
									className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]"
								/>
							</div>

							{/* FASE 4: EDIT NILAI KPI DI DALAM MODAL EDIT */}
							<div className="bg-[#FFF8E1] p-5 rounded-2xl mt-4 border border-[#F4A300]/20">
								<h4 className="font-extrabold text-[#0B4D1E] mb-4 flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-[#F4A300]"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
									</svg>
									Koreksi Nilai KPI
								</h4>
								{["kebersihan", "pemilahan", "kondisi"].map(
									(kriteria, index) => (
										<div key={`edit-${kriteria}`} className="mb-4 last:mb-0">
											<label className="block text-xs font-bold text-gray-500 mb-2 capitalize">
												{index + 1}.{" "}
												{kriteria === "kondisi"
													? "Kondisi (Basah/Kering)"
													: kriteria}
											</label>
											<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
												{opsiPenilaian.map((opsi) => (
													<label
														key={`edit-${kriteria}-${opsi}`}
														className={`text-center py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${editForm.penilaian[kriteria] === opsi ? "bg-[#0B4D1E] text-white" : "bg-white text-gray-500 border border-gray-200"}`}
													>
														<input
															type="radio"
															className="hidden"
															name={`edit-${kriteria}`}
															value={opsi}
															onChange={(e) =>
																setEditForm({
																	...editForm,
																	penilaian: {
																		...editForm.penilaian,
																		[kriteria]: e.target.value,
																	},
																})
															}
														/>{" "}
														{opsi}
													</label>
												))}
											</div>
										</div>
									),
								)}
							</div>
						</div>

						<div className="flex gap-4 mt-8">
							<button
								onClick={() => setIsEditOpen(false)}
								className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all"
							>
								Batal
							</button>
							<button
								onClick={saveEdit}
								className="flex-1 bg-[#125B2A] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#0B4D1E] shadow-md transition-all"
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
										d="M5 13l4 4L19 7"
									/>
								</svg>{" "}
								Simpan Perubahan
							</button>
						</div>
					</div>
				</div>
			)}

			{/* MODAL HAPUS TRANSAKSI */}
			{isDeleteOpen && selectedTx && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
					<div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center animate-fade-in-up border border-gray-100">
						<div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
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
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-extrabold text-[#0B4D1E] mb-2">
							Hapus Transaksi?
						</h3>
						<p className="text-sm text-gray-500 font-medium mb-8">
							Apakah Anda yakin ingin menghapus transaksi{" "}
							<b>{selectedTx.id_trx}</b>? Data yang dihapus tidak dapat
							dikembalikan.
						</p>
						<div className="flex gap-4">
							<button
								onClick={() => setIsDeleteOpen(false)}
								className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-3.5 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all"
							>
								Batal
							</button>
							<button
								onClick={confirmDelete}
								className="flex-1 bg-red-500 text-white py-3.5 rounded-2xl font-bold hover:bg-red-600 shadow-md transition-all"
							>
								Ya, Hapus
							</button>
						</div>
					</div>
				</div>
			)}

			{/* TOAST NOTIFICATION GLOBAL */}
			{toastMessage && (
				<div
					style={{ animation: "fadeInDown 0.3s ease-out" }}
					className={`fixed top-10 right-10 z-[99999] border px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${toastMessage.type === "error" ? "bg-[#FFF5F5] text-red-600 border-red-200" : "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]"}`}
				>
					<div
						className={`${toastMessage.type === "error" ? "bg-red-500" : "bg-[#2E7D32]"} text-white rounded-full p-1`}
					>
						{toastMessage.type === "error" ? (
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
									d="M6 18L18 6M6 6l12 12"
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
									strokeWidth={3}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						)}
					</div>
					<span className="font-extrabold text-sm">{toastMessage.msg}</span>
				</div>
			)}
		</AdminLayout>
	);
}

export default KelolaTransaksiPage;
