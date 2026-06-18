import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

// Daftar Lengkap BEM yang tersinkron dengan handlers.rs
const ROLES_DATA = [
	{ id: "bem_km", label: "BEM KM IPB" },
	{ id: "bem_faperta", label: "BEM FAPERTA" },
	{ id: "bem_skhb", label: "BEM SKHB" },
	{ id: "bem_fpik", label: "BEM FPIK" },
	{ id: "bem_fapet", label: "BEM FAPET" },
	{ id: "bem_fahutan", label: "BEM FAHUTAN" },
	{ id: "bem_fateta", label: "BEM FATETA" },
	{ id: "bem_fmipa", label: "BEM FMIPA" },
	{ id: "bem_fem", label: "BEM FEM" },
	{ id: "bem_fema", label: "BEM FEMA" },
	{ id: "bem_vokasi", label: "BEM VOKASI" },
	{ id: "bem_sb", label: "BEM SB" },
	{ id: "bem_fk", label: "BEM FK" },
	{ id: "bem_ssmi", label: "BEM SSMI" },
	{ id: "ormawa_ppku", label: "Ormawa Eksekutif PPKU" },
	{ id: "dui", label: "DUI" },
];

function RegisterPage() {
	const [nama, setNama] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [konfirmPassword, setKonfirmPassword] = useState("");

	// State buat Fitur Mata
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	// State buat Custom Searchable Dropdown
	const [roleID, setRoleID] = useState("");
	const [searchRole, setSearchRole] = useState("");
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const navigate = useNavigate();

	// Filter daftar role berdasarkan ketikan user
	const filteredRoles = ROLES_DATA.filter((r) =>
		r.label.toLowerCase().includes(searchRole.toLowerCase()),
	);

	const handleRegister = async (e) => {
		e.preventDefault();
		if (password !== konfirmPassword)
			return setErrorMsg("Password dan Konfirmasi Password tidak cocok!");
		if (!roleID)
			return setErrorMsg("Pilih wilayah/organisasi terlebih dahulu!");

		setIsLoading(true);
		setErrorMsg("");

		try {
			const baseUrl = import.meta.env.VITE_API_URL;
			if (!baseUrl) throw new Error("API URL tidak ditemukan");

			const response = await fetch(`${baseUrl}/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nama: nama,
					email: email,
					username: email.split("@")[0],
					password: password,
					role: roleID,
				}),
			});

			const data = await response.json();

			if (response.ok && data.status === "sukses") {
				alert("Pendaftaran berhasil! Silakan login.");
				navigate("/login");
			} else {
				setErrorMsg(
					data.pesan || "Pendaftaran gagal. Periksa kembali data Anda.",
				);
			}
		} catch (_error) {
			setErrorMsg("Koneksi gagal. Pastikan backend server sudah berjalan.");
		} finally {
			setIsLoading(false);
		}
	};

	// Komponen Ikon Mata
	const EyeIcon = ({ isOpen, toggle }) => (
		<button
			type="button"
			onClick={toggle}
			className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#0B4D1E]"
		>
			{isOpen ? (
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
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
						clipRule="evenodd"
					/>
					<path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
				</svg>
			)}
		</button>
	);

	return (
		<AuthLayout title="Daftar Akun" subtitle="Buat akun baru untuk memulai">
			<form onSubmit={handleRegister} className="flex flex-col gap-4">
				{errorMsg && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
						{errorMsg}
					</div>
				)}

				<div>
					<label className="block text-sm font-bold text-gray-700 mb-1">
						Nama Lengkap
					</label>
					<input
						type="text"
						value={nama}
						onChange={(e) => setNama(e.target.value)}
						required
						className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4D1E] text-sm"
						placeholder="Nama lengkap"
					/>
				</div>

				<div>
					<label className="block text-sm font-bold text-gray-700 mb-1">
						Email IPB
					</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4D1E] text-sm"
						placeholder="nama@apps.ipb.ac.id"
					/>
				</div>

				<div>
					<label className="block text-sm font-bold text-gray-700 mb-1">
						Password
					</label>
					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full bg-[#F5F5F5] px-4 py-3 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4D1E] text-sm"
							placeholder="Masukkan password"
						/>
						<EyeIcon
							isOpen={showPassword}
							toggle={() => setShowPassword(!showPassword)}
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-bold text-gray-700 mb-1">
						Konfirmasi Password
					</label>
					<div className="relative">
						<input
							type={showConfirm ? "text" : "password"}
							value={konfirmPassword}
							onChange={(e) => setKonfirmPassword(e.target.value)}
							required
							className="w-full bg-[#F5F5F5] px-4 py-3 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4D1E] text-sm"
							placeholder="Konfirmasi password"
						/>
						<EyeIcon
							isOpen={showConfirm}
							toggle={() => setShowConfirm(!showConfirm)}
						/>
					</div>
				</div>

				{/* CUSTOM SEARCHABLE DROPDOWN */}
				<div className="relative">
					<label className="block text-sm font-bold text-gray-700 mb-1">
						Role / Organisasi
					</label>
					<input
						type="text"
						value={searchRole}
						onChange={(e) => {
							setSearchRole(e.target.value);
							setRoleID(""); // Reset ID kalau user ngetik ulang
							setIsDropdownOpen(true);
						}}
						onFocus={() => setIsDropdownOpen(true)}
						onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
						required={!roleID}
						className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4D1E] text-sm"
						placeholder="Ketik untuk mencari wilayah/organisasi..."
					/>

					{isDropdownOpen && (
						<ul className="absolute z-50 w-full bg-white mt-1 rounded-xl shadow-xl max-h-40 overflow-y-auto border border-gray-100">
							{filteredRoles.length > 0 ? (
								filteredRoles.map((role) => (
									<li
										key={role.id}
										// FIX: Pake onMouseDown biar tereksekusi duluan sebelum input onBlur
										onMouseDown={() => {
											setRoleID(role.id);
											setSearchRole(role.label);
											setIsDropdownOpen(false);
										}}
										className="px-4 py-3 text-sm cursor-pointer hover:bg-[#F2EDE4] hover:text-[#0B4D1E] transition-colors"
									>
										{role.label}
									</li>
								))
							) : (
								<li className="px-4 py-3 text-sm text-gray-400">
									Tidak ditemukan
								</li>
							)}
						</ul>
					)}
				</div>

				<button
					type="submit"
					disabled={isLoading}
					className={`w-full text-white py-3.5 rounded-xl font-bold transition-all shadow-md mt-4 ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0B4D1E] hover:bg-[#072a15]"}`}
				>
					{isLoading ? "Memproses..." : "Daftar Sekarang"}
				</button>
			</form>

			<p className="mt-8 text-center text-sm text-gray-600">
				Sudah punya akun?{" "}
				<Link
					to="/login"
					className="text-[#0B4D1E] font-extrabold hover:underline"
				>
					Masuk di sini
				</Link>
			</p>
		</AuthLayout>
	);
}

export default RegisterPage;
