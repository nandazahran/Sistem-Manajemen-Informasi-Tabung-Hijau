import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";

// Helper: Mapping kode role backend → label tampilan
const ROLE_DISPLAY = {
	admin: "Admin",
	bem_km: "BEM KM",
	dui: "DUI",
};

function getRoleLabel(role) {
	if (ROLE_DISPLAY[role]) return ROLE_DISPLAY[role];
	if (role?.startsWith("bem_")) return "BEM Wilayah";
	if (role?.startsWith("ormawa_")) return "Ormawa";
	return role || "-";
}

// Helper: Mapping role → warna badge
function getRoleBadge(role) {
	const label = getRoleLabel(role);
	if (label === "Admin") return { bg: "bg-amber-100", text: "text-amber-700" };
	if (label === "DUI") return { bg: "bg-purple-100", text: "text-purple-700" };
	if (label === "BEM KM") return { bg: "bg-blue-100", text: "text-blue-700" };
	return { bg: "bg-green-100", text: "text-green-700" };
}

// Daftar role yang bisa dipilih Admin saat Tambah/Edit User
const ROLE_OPTIONS = [
	{ value: "admin", label: "Admin" },
	{ value: "dui", label: "DUI" },
	{ value: "bem_km", label: "BEM KM" },
	{ value: "bem_wilayah", label: "BEM Wilayah (Pilih wilayah di bawah)" },
	{ value: "ormawa_ppku", label: "Ormawa Eksekutif PPKU" },
];

// Mapping nama wilayah → kode role backend
function buildRoleCode(roleType, wilayahNama) {
	if (roleType !== "bem_wilayah") return roleType;
	// Contoh: wilayahNama = "BEM FATETA" → role = "bem_fateta"
	if (!wilayahNama) return "bem_wilayah";
	const kode = wilayahNama.toLowerCase().replace(/\s+/g, "_");
	return kode;
}

function KelolaUserPage() {
	const [toastMessage, setToastMessage] = useState("");
	const [toastType, setToastType] = useState("success"); // 'success' | 'error'

	// States Modal
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	// States Filter & Search
	const [searchTerm, setSearchTerm] = useState("");
	const [filterRole, setFilterRole] = useState("Semua Role");
	const [filterStatus, setFilterStatus] = useState("Semua Status");

	// States Custom Dropdown (Untuk buka-tutup)
	const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
	const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

	// Data State (dari Backend)
	const [users, setUsers] = useState([]);
	const [wilayahList, setWilayahList] = useState([]);

	// Form State
	const [formData, setFormData] = useState({
		username: "",
		nama: "",
		email: "",
		roleType: "bem_wilayah",
		wilayahNama: "",
		password: "",
	});

	const API_URL = import.meta.env.VITE_API_URL;
	const getToken = () =>
		localStorage.getItem("token") || sessionStorage.getItem("token");

	// ========== FETCH DATA ==========
	const fetchUsers = async () => {
		try {
			const res = await fetch(`${API_URL}/users`, {
				headers: { Authorization: `Bearer ${getToken()}` },
			});
			const data = await res.json();
			if (data.status === "sukses") {
				setUsers(data.data);
			}
		} catch (err) {
			console.error("Gagal memuat daftar user:", err);
		} finally {
			setLoading(false);
		}
	};

	const fetchWilayah = async () => {
		try {
			const res = await fetch(`${API_URL}/wilayah/aktif`, {
				headers: { Authorization: `Bearer ${getToken()}` },
			});
			const data = await res.json();
			if (data.status === "sukses") {
				setWilayahList(data.data);
			}
		} catch (err) {
			console.error("Gagal memuat daftar wilayah:", err);
		}
	};

	useEffect(() => {
		fetchUsers();
		fetchWilayah();
		// biome-ignore lint/correctness/useExhaustiveDependencies: prevent infinite loops from unstable function references
	}, [fetchWilayah, fetchUsers]);

	// ========== FILTER LOGIC ==========
	const filteredUsers = users.filter((u) => {
		const matchSearch =
			(u.nama || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
			(u.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
			(u.username || "").toLowerCase().includes(searchTerm.toLowerCase());
		const matchRole =
			filterRole === "Semua Role" || getRoleLabel(u.role) === filterRole;
		const matchStatus =
			filterStatus === "Semua Status" || u.status === filterStatus;
		return matchSearch && matchRole && matchStatus;
	});

	// ========== SUMMARY CARDS (Dinamis) ==========
	const totalUser = users.length;
	const totalAdmin = users.filter(
		(u) => u.role === "admin" || u.role === "bem_km",
	).length;
	const totalBEM = users.filter(
		(u) => u.role?.startsWith("bem_") && u.role !== "bem_km",
	).length;
	const totalAktif = users.filter((u) => u.status === "Aktif").length;

	// ========== TOAST ==========
	const showToast = (msg, type = "success") => {
		setToastMessage(msg);
		setToastType(type);
		setTimeout(() => setToastMessage(""), 4000);
	};

	// ========== CEK SUPERADMIN ==========
	const getUsernameFromToken = () => {
		const token = getToken();
		if (!token) return null;
		try {
			const payload = JSON.parse(atob(token.split(".")[1]));
			return payload.sub;
		} catch (_e) {
			return null;
		}
	};
	const isSuperAdmin = getUsernameFromToken() === "superadmin";

	// ========== CRUD HANDLERS ==========
	const handleSubmitAdd = async () => {
		if (
			!formData.username ||
			!formData.nama ||
			!formData.email ||
			!formData.password
		) {
			showToast("Semua field wajib diisi!", "error");
			return;
		}
		if (formData.password.length < 8) {
			showToast("Password minimal 8 karakter!", "error");
			return;
		}

		setSubmitting(true);
		try {
			const roleCode = buildRoleCode(formData.roleType, formData.wilayahNama);
			const res = await fetch(`${API_URL}/users`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${getToken()}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: formData.username,
					password: formData.password,
					email: formData.email,
					nama: formData.nama,
					role: roleCode,
				}),
			});
			const data = await res.json();
			if (data.status === "sukses") {
				showToast(data.pesan);
				closeModals();
				fetchUsers();
			} else {
				showToast(data.pesan || "Gagal menambahkan user.", "error");
			}
		} catch (_err) {
			showToast("Gagal koneksi ke server.", "error");
		} finally {
			setSubmitting(false);
		}
	};

	const handleSubmitEdit = async () => {
		if (!selectedUser) return;
		setSubmitting(true);
		try {
			const roleCode = buildRoleCode(formData.roleType, formData.wilayahNama);
			const res = await fetch(`${API_URL}/users/${selectedUser.id}`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${getToken()}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					nama: formData.nama,
					status: formData.status || "Aktif",
					telepon: formData.telepon || null,
					email: formData.email,
					role: roleCode,
				}),
			});
			const data = await res.json();
			if (data.status === "sukses") {
				showToast(data.pesan);
				closeModals();
				fetchUsers();
			} else {
				showToast(data.pesan || "Gagal mengupdate user.", "error");
			}
		} catch (_err) {
			showToast("Gagal koneksi ke server.", "error");
		} finally {
			setSubmitting(false);
		}
	};

	const handleDeleteUser = async () => {
		if (!selectedUser) return;
		setSubmitting(true);
		try {
			const res = await fetch(`${API_URL}/users/${selectedUser.id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${getToken()}` },
			});
			const data = await res.json();
			if (data.status === "sukses") {
				showToast(data.pesan);
				fetchUsers();
			} else {
				showToast(data.pesan || "Gagal menghapus user.", "error");
			}
		} catch (_err) {
			showToast("Gagal koneksi ke server.", "error");
		} finally {
			setSubmitting(false);
			setIsDeleteConfirmOpen(false);
			setSelectedUser(null);
		}
	};

	const handleGenerateSeed = async () => {
		if (
			!window.confirm(
				"Apakah kamu yakin ingin men-generate data dummy selama 4 bulan terakhir? (Perlu beberapa saat)",
			)
		)
			return;
		setSubmitting(true);
		showToast("Sedang memproses... Harap tunggu.", "success");
		try {
			const res = await fetch(`${API_URL}/dev/seed`, {
				method: "POST",
				headers: { Authorization: `Bearer ${getToken()}` },
			});
			const data = await res.json();
			if (res.ok && data.status === "sukses") {
				showToast(data.pesan);
				fetchUsers();
				fetchWilayah();
			} else {
				showToast(data.pesan || "Gagal men-generate data.", "error");
			}
		} catch (_err) {
			showToast("Gagal koneksi ke server.", "error");
		} finally {
			setSubmitting(false);
		}
	};

	// ========== MODAL HELPERS ==========
	const detectRoleType = (roleCode) => {
		if (["admin", "dui", "bem_km", "ormawa_ppku"].includes(roleCode))
			return roleCode;
		if (roleCode?.startsWith("bem_")) return "bem_wilayah";
		if (roleCode?.startsWith("ormawa_")) return "ormawa_ppku";
		return "bem_wilayah";
	};

	const openEditModal = (user) => {
		setSelectedUser(user);
		setFormData({
			username: user.username || "",
			nama: user.nama,
			email: user.email,
			roleType: detectRoleType(user.role),
			wilayahNama: user.nama_wilayah || "",
			password: "",
			status: user.status,
			telepon: user.telepon || "",
		});
		setIsEditOpen(true);
	};

	const openDeleteConfirm = (user) => {
		setSelectedUser(user);
		setIsDeleteConfirmOpen(true);
	};

	const closeModals = () => {
		setIsAddOpen(false);
		setIsEditOpen(false);
		setIsDeleteConfirmOpen(false);
		setSelectedUser(null);
		setFormData({
			username: "",
			nama: "",
			email: "",
			roleType: "bem_wilayah",
			wilayahNama: "",
			password: "",
		});
	};

	// Apakah role yang dipilih memerlukan dropdown wilayah
	const needsWilayah = formData.roleType === "bem_wilayah";

	return (
		<AdminLayout>
			<style>{`@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }`}</style>

			{/* BANNER UTAMA */}
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
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
							/>
						</svg>
					</div>
					<div>
						<h2 className="text-3xl font-extrabold mb-1">Kelola User</h2>
						<p className="text-green-100/80 font-medium">
							Manajemen akun pengguna sistem SIM-TH
						</p>
					</div>
				</div>
				<div className="flex flex-col md:flex-row gap-4">
					{isSuperAdmin && (
						<button
							type="button"
							onClick={handleGenerateSeed}
							disabled={submitting}
							className="bg-white text-[#0B4D1E] px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-md disabled:opacity-50"
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
									d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
								/>
							</svg>
							{submitting ? "Proses..." : "🛠️ Data Dummy"}
						</button>
					)}
					<button
						type="button"
						onClick={() => setIsAddOpen(true)}
						className="bg-[#F4A300] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#d68e00] transition-all shadow-md"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
								clipRule="evenodd"
							/>
						</svg>
						Tambah User
					</button>
				</div>
			</div>

			{/* FILTER & SEARCHBAR */}
			<div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
				{/* Search */}
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
						placeholder="Cari nama, email, atau username..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow"
					/>
				</div>

				{/* Custom Dropdown Filter */}
				<div className="flex gap-4 w-full md:w-auto">
					{/* Filter Role */}
					<div className="relative w-full md:w-48">
						<div
							onClick={() => {
								setIsRoleDropdownOpen(!isRoleDropdownOpen);
								setIsStatusDropdownOpen(false);
							}}
							className="bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl cursor-pointer flex justify-between items-center hover:bg-[#EAE5DA] transition-colors"
						>
							<span className="truncate">{filterRole}</span>
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
						{isRoleDropdownOpen && (
							<div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden py-1">
								{[
									"Semua Role",
									"Admin",
									"BEM Wilayah",
									"DUI",
									"BEM KM",
									"Ormawa",
								].map((r) => (
									<div
										key={r}
										onClick={() => {
											setFilterRole(r);
											setIsRoleDropdownOpen(false);
										}}
										className={`px-5 py-2.5 cursor-pointer text-sm font-medium transition-colors ${filterRole === r ? "bg-[#0B4D1E] text-white" : "text-[#0B4D1E] hover:bg-gray-100"}`}
									>
										{r}
									</div>
								))}
							</div>
						)}
					</div>

					{/* Filter Status */}
					<div className="relative w-full md:w-48">
						<div
							onClick={() => {
								setIsStatusDropdownOpen(!isStatusDropdownOpen);
								setIsRoleDropdownOpen(false);
							}}
							className="bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl cursor-pointer flex justify-between items-center hover:bg-[#EAE5DA] transition-colors"
						>
							<span className="truncate">{filterStatus}</span>
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
						{isStatusDropdownOpen && (
							<div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden py-1">
								{["Semua Status", "Aktif", "Nonaktif"].map((s) => (
									<div
										key={s}
										onClick={() => {
											setFilterStatus(s);
											setIsStatusDropdownOpen(false);
										}}
										className={`px-5 py-2.5 cursor-pointer text-sm font-medium transition-colors ${filterStatus === s ? "bg-[#0B4D1E] text-white" : "text-[#0B4D1E] hover:bg-gray-100"}`}
									>
										{s}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* TABEL DATA */}
			<div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead className="bg-[#F5EFE6] text-[#0B4D1E]">
							<tr>
								<th className="px-8 py-5 font-bold">User</th>
								<th className="px-8 py-5 font-bold">Role & Wilayah</th>
								<th className="px-8 py-5 font-bold">Status</th>
								<th className="px-8 py-5 font-bold text-center">Aksi</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{loading ? (
								<tr>
									<td
										colSpan="4"
										className="text-center py-10 text-gray-400 font-medium"
									>
										<div className="flex items-center justify-center gap-3">
											<svg
												className="animate-spin h-5 w-5 text-[#0B4D1E]"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
												></path>
											</svg>
											Memuat data user...
										</div>
									</td>
								</tr>
							) : filteredUsers.length === 0 ? (
								<tr>
									<td
										colSpan="4"
										className="text-center py-10 text-gray-400 font-medium"
									>
										Tidak ada user yang ditemukan.
									</td>
								</tr>
							) : (
								filteredUsers.map((u) => {
									const badge = getRoleBadge(u.role);
									return (
										<tr
											key={u.id}
											className="hover:bg-gray-50 transition-colors"
										>
											<td className="px-8 py-5">
												<p className="font-extrabold text-[#0B4D1E]">
													{u.nama}
												</p>
												<p className="text-gray-400 text-xs font-medium">
													{u.email}
												</p>
												<p className="text-gray-300 text-[10px] font-mono mt-0.5">
													@{u.username}
												</p>
											</td>
											<td className="px-8 py-5">
												<span
													className={`${badge.bg} ${badge.text} text-[10px] px-3 py-1 rounded-full font-bold`}
												>
													{getRoleLabel(u.role)}
												</span>
												<p className="text-gray-400 text-xs font-medium mt-1">
													{u.nama_wilayah || "-"}
												</p>
											</td>
											<td className="px-8 py-5">
												<span
													className={`px-4 py-1.5 rounded-full text-xs font-bold ${u.status === "Aktif" ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-red-50 text-red-600"}`}
												>
													{u.status}
												</span>
											</td>
											<td className="px-8 py-5 flex items-center justify-center gap-3">
												{/* BUTTON EDIT */}
												<button
													type="button"
													onClick={() => openEditModal(u)}
													className="p-2 text-gray-400 hover:text-[#F4A300] hover:bg-[#FDF6EA] rounded-lg transition-all"
													title="Edit Data"
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
												{/* BUTTON HAPUS */}
												<button
													type="button"
													onClick={() => openDeleteConfirm(u)}
													title="Hapus User"
													className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
															d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
														/>
													</svg>
												</button>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* SUMMARY CARDS BAWAH (DINAMIS) */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
				<div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
					<p className="text-gray-400 text-sm font-medium mb-1">Total User</p>
					<h3 className="text-3xl font-extrabold text-[#0B4D1E]">
						{totalUser}
					</h3>
				</div>
				<div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
					<p className="text-gray-400 text-sm font-medium mb-1">Admin</p>
					<h3 className="text-3xl font-extrabold text-[#F4A300]">
						{totalAdmin}
					</h3>
				</div>
				<div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
					<p className="text-gray-400 text-sm font-medium mb-1">BEM Wilayah</p>
					<h3 className="text-3xl font-extrabold text-[#0B4D1E]">{totalBEM}</h3>
				</div>
				<div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
					<p className="text-gray-400 text-sm font-medium mb-1">User Aktif</p>
					<h3 className="text-3xl font-extrabold text-[#2E7D32]">
						{totalAktif}
					</h3>
				</div>
			</div>

			{/* ==================== MODAL TAMBAH USER ==================== */}
			{isAddOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
					<div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-fade-in-up border border-gray-100 max-h-[90vh] overflow-y-auto">
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
											d="M12 4v16m8-8H4"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-extrabold text-[#0B4D1E]">
									Tambah User Baru
								</h3>
							</div>
							<button
								type="button"
								onClick={closeModals}
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
									Username
								</label>
								<input
									type="text"
									placeholder="Contoh: ahmad_fateta"
									value={formData.username}
									onChange={(e) =>
										setFormData({ ...formData, username: e.target.value })
									}
									className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow placeholder-gray-400"
								/>
							</div>
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Nama Lengkap
								</label>
								<input
									type="text"
									placeholder="Masukkan nama lengkap"
									value={formData.nama}
									onChange={(e) =>
										setFormData({ ...formData, nama: e.target.value })
									}
									className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow placeholder-gray-400"
								/>
							</div>
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Email
								</label>
								<input
									type="email"
									placeholder="user@bem.ipb.ac.id"
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow placeholder-gray-400"
								/>
							</div>
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Role
								</label>
								<div className="relative">
									<select
										value={formData.roleType}
										onChange={(e) =>
											setFormData({
												...formData,
												roleType: e.target.value,
												wilayahNama: "",
											})
										}
										className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer"
									>
										{ROLE_OPTIONS.map((opt) => (
											<option key={opt.value} value={opt.value}>
												{opt.label}
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
							{needsWilayah && (
								<div>
									<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
										Wilayah
									</label>
									<div className="relative">
										<select
											value={formData.wilayahNama}
											onChange={(e) =>
												setFormData({
													...formData,
													wilayahNama: e.target.value,
												})
											}
											className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer"
										>
											<option value="">-- Pilih Wilayah --</option>
											{wilayahList.map((w) => (
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
								</div>
							)}
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Password
								</label>
								<input
									type="password"
									placeholder="Minimal 8 karakter"
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
									className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow placeholder-gray-400"
								/>
							</div>
						</div>

						<div className="flex gap-4 mt-8">
							<button
								type="button"
								onClick={closeModals}
								className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all"
							>
								Batal
							</button>
							<button
								type="button"
								onClick={handleSubmitAdd}
								disabled={submitting}
								className="flex-1 bg-[#125B2A] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#0B4D1E] shadow-md transition-all disabled:opacity-50"
							>
								{submitting ? (
									<svg
										className="animate-spin h-5 w-5"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
										></path>
									</svg>
								) : (
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
									</svg>
								)}
								{submitting ? "Memproses..." : "Tambah User"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* ==================== MODAL EDIT USER ==================== */}
			{isEditOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
					<div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-fade-in-up border border-gray-100 max-h-[90vh] overflow-y-auto">
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
											d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-extrabold text-[#0B4D1E]">
									Edit Data User
								</h3>
							</div>
							<button
								type="button"
								onClick={closeModals}
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
									Nama Lengkap
								</label>
								<input
									type="text"
									value={formData.nama}
									onChange={(e) =>
										setFormData({ ...formData, nama: e.target.value })
									}
									className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow"
								/>
							</div>
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Email
								</label>
								<input
									type="email"
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow"
								/>
							</div>
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Status
								</label>
								<div className="relative">
									<select
										value={formData.status || "Aktif"}
										onChange={(e) =>
											setFormData({ ...formData, status: e.target.value })
										}
										className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer"
									>
										<option value="Aktif">Aktif</option>
										<option value="Nonaktif">Nonaktif</option>
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
									Role
								</label>
								<div className="relative">
									<select
										value={formData.roleType}
										onChange={(e) =>
											setFormData({
												...formData,
												roleType: e.target.value,
												wilayahNama: "",
											})
										}
										className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer"
									>
										{ROLE_OPTIONS.map((opt) => (
											<option key={opt.value} value={opt.value}>
												{opt.label}
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
							{needsWilayah && (
								<div>
									<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
										Wilayah
									</label>
									<div className="relative">
										<select
											value={formData.wilayahNama}
											onChange={(e) =>
												setFormData({
													...formData,
													wilayahNama: e.target.value,
												})
											}
											className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer"
										>
											<option value="">-- Pilih Wilayah --</option>
											{wilayahList.map((w) => (
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
								</div>
							)}
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Telepon
								</label>
								<input
									type="text"
									placeholder="08xxxxxxxxxx"
									value={formData.telepon || ""}
									onChange={(e) =>
										setFormData({ ...formData, telepon: e.target.value })
									}
									className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow placeholder-gray-400"
								/>
							</div>
						</div>

						<div className="flex gap-4 mt-8">
							<button
								type="button"
								onClick={closeModals}
								className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all"
							>
								Batal
							</button>
							<button
								type="button"
								onClick={handleSubmitEdit}
								disabled={submitting}
								className="flex-1 bg-[#125B2A] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#0B4D1E] shadow-md transition-all disabled:opacity-50"
							>
								{submitting ? (
									<svg
										className="animate-spin h-5 w-5"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
										></path>
									</svg>
								) : (
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
									</svg>
								)}
								{submitting ? "Menyimpan..." : "Simpan"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* ==================== MODAL KONFIRMASI HAPUS ==================== */}
			{isDeleteConfirmOpen && selectedUser && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
					<div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative animate-fade-in-up border border-gray-100">
						<div className="flex flex-col items-center text-center mb-6">
							<div className="bg-red-50 p-4 rounded-full text-red-500 mb-4">
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
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-extrabold text-[#0B4D1E] mb-2">
								Hapus User?
							</h3>
							<p className="text-gray-500 text-sm">
								Apakah kamu yakin ingin menghapus akun{" "}
								<span className="font-bold text-[#0B4D1E]">
									{selectedUser.nama}
								</span>
								? Tindakan ini tidak bisa dibatalkan.
							</p>
						</div>
						<div className="flex gap-4">
							<button
								type="button"
								onClick={closeModals}
								className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all"
							>
								Batal
							</button>
							<button
								type="button"
								onClick={handleDeleteUser}
								disabled={submitting}
								className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 shadow-md transition-all disabled:opacity-50"
							>
								{submitting ? (
									<svg
										className="animate-spin h-5 w-5"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
										></path>
									</svg>
								) : (
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
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
								)}
								{submitting ? "Menghapus..." : "Hapus"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* TOAST NOTIFICATION */}
			{toastMessage && (
				<div
					style={{ animation: "fadeInDown 0.3s ease-out" }}
					className={`fixed top-10 right-10 z-[99999] ${toastType === "error" ? "bg-red-50 text-red-700 border-red-200" : "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]"} border px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3`}
				>
					<div
						className={`${toastType === "error" ? "bg-red-500" : "bg-[#2E7D32]"} text-white rounded-full p-1`}
					>
						{toastType === "error" ? (
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
					<span className="font-extrabold text-sm">{toastMessage}</span>
				</div>
			)}
		</AdminLayout>
	);
}

export default KelolaUserPage;
