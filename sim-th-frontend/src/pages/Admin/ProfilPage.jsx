import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";

function ProfilPage() {
	const navigate = useNavigate();
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isPassOpen, setIsPassOpen] = useState(false);
	const [toastMessage, setToastMessage] = useState("");

	// Password Visibility States
	const [showOldPass, setShowOldPass] = useState(false);
	const [showNewPass, setShowNewPass] = useState(false);
	const [showConfPass, setShowConfPass] = useState(false);

	const showToast = (msg) => {
		setToastMessage(msg);
		setTimeout(() => setToastMessage(""), 3000);
	};

	const handleLogout = () => {
		navigate("/login");
	};

	const handleSaveProfile = (e) => {
		e.preventDefault();
		setIsEditOpen(false);
		showToast("Profil berhasil diperbarui!");
	};
	const handleSavePassword = (e) => {
		e.preventDefault();
		setIsPassOpen(false);
		showToast("Password berhasil diubah!");
	};

	return (
		<AdminLayout>
			<style>{`
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

			{/* BANNER PROFIL */}
			<div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex items-center gap-6 text-white mt-2 mb-8 shadow-sm">
				<div className="relative group cursor-pointer">
					<div className="w-24 h-24 bg-[#F4A300] rounded-3xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-12 w-12"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
					<div className="absolute -bottom-2 -right-2 bg-white text-[#0B4D1E] p-2 rounded-full shadow-md border-2 border-white group-hover:bg-gray-100 transition-colors">
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
								d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					</div>
				</div>
				<div>
					<h2 className="text-3xl font-extrabold mb-2">Admin SIM-TH</h2>
					<div className="flex gap-2">
						<span className="bg-green-600/50 text-white text-xs px-3 py-1 rounded-full font-bold border border-green-500/50">
							admin@simth.ipb.ac.id
						</span>
						<span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full font-bold border border-white/20">
							Admin
						</span>
						<span className="bg-[#F4A300]/20 text-[#F4A300] text-xs px-3 py-1 rounded-full font-bold border border-[#F4A300]/30">
							BEM KM IPB
						</span>
					</div>
				</div>
			</div>

			{/* INFORMASI PROFIL */}
			<div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8 relative">
				<div className="flex justify-between items-center mb-8">
					<h3 className="font-extrabold text-xl text-[#0B4D1E]">
						Informasi Profil
					</h3>
					<button
						onClick={() => setIsEditOpen(true)}
						className="bg-[#125B2A] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#0B4D1E] transition-all shadow-sm text-sm"
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
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>{" "}
						Edit Profil
					</button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{[
						{
							label: "Nama Lengkap",
							value: "Admin SIM-TH",
							icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
						},
						{
							label: "Email",
							value: "admin@simth.ipb.ac.id",
							icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
						},
						{
							label: "Role",
							value: "Admin",
							icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
						},
						{
							label: "Nomor Telepon",
							value: "081234567890",
							icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
						},
						{
							label: "Institusi",
							value: "BEM KM IPB",
							icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
						},
						{
							label: "Bergabung Sejak",
							value: "15 Januari 2024",
							icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
						},
					].map((item, i) => (
						<div
							key={i}
							className="bg-[#F5EFE6] p-5 rounded-2xl flex items-center gap-5"
						>
							<div className="bg-[#EAE5DA] p-3 rounded-full text-[#0B4D1E]">
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
										d={item.icon}
									/>
								</svg>
							</div>
							<div>
								<p className="text-gray-400 text-xs font-bold mb-1">
									{item.label}
								</p>
								<p className="font-extrabold text-[#0B4D1E]">{item.value}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* KEAMANAN AKUN (SUDAH DIPERBAIKI WARNA BACKGROUNDNYA) */}
			<h3 className="font-extrabold text-xl text-[#0B4D1E] mb-4 px-2">
				Keamanan Akun
			</h3>
			<div
				onClick={() => setIsPassOpen(true)}
				className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all mb-8 group"
			>
				<div className="flex items-center gap-5">
					<div className="bg-[#F5EFE6] p-4 rounded-2xl text-[#0B4D1E] group-hover:scale-110 transition-transform">
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
								d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
							/>
						</svg>
					</div>
					<div>
						<h4 className="font-extrabold text-[#0B4D1E] text-lg">
							Ubah Password
						</h4>
						<p className="text-gray-500 text-sm font-medium">
							Update password akun Anda
						</p>
					</div>
				</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6 text-gray-400 group-hover:text-[#0B4D1E]"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
					/>
				</svg>
			</div>

			{/* KELUAR DARI SISTEM (SUDAH DIPERBAIKI WARNA BACKGROUNDNYA) */}
			<h3 className="font-extrabold text-xl text-[#0B4D1E] mb-4 px-2">
				Keluar dari Sistem
			</h3>
			<div
				onClick={handleLogout}
				className="bg-[#FFF5F5] p-6 rounded-[2rem] shadow-sm border border-red-100 flex items-center justify-between cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all mb-10 group"
			>
				<div className="flex items-center gap-5">
					<div className="bg-red-100 p-4 rounded-2xl text-red-600 group-hover:scale-110 transition-transform">
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
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							/>
						</svg>
					</div>
					<div>
						<h4 className="font-extrabold text-red-600 text-lg">Logout</h4>
						<p className="text-red-500/80 text-sm font-medium">
							Keluar dari sistem SIM-TH
						</p>
					</div>
				</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6 text-red-300 group-hover:text-red-600"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
					/>
				</svg>
			</div>

			{/* MODAL 1: EDIT PROFIL */}
			{isEditOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
					<div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative animate-fade-in-up border border-gray-100">
						<div className="flex justify-between items-center mb-8">
							<h3 className="text-2xl font-extrabold text-[#0B4D1E]">
								Edit Profil
							</h3>
							<button
								onClick={() => setIsEditOpen(false)}
								className="text-gray-400 hover:text-gray-600"
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
						<form onSubmit={handleSaveProfile} className="space-y-5">
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Nama Lengkap
								</label>
								<input
									type="text"
									defaultValue="Admin SIM-TH"
									className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]"
								/>
							</div>
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Email
								</label>
								<input
									type="email"
									defaultValue="admin@simth.ipb.ac.id"
									className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]"
								/>
							</div>
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Nomor Telepon
								</label>
								<input
									type="text"
									defaultValue="081234567890"
									className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]"
								/>
							</div>
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Institusi
								</label>
								<input
									type="text"
									defaultValue="BEM KM IPB"
									className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]"
								/>
							</div>

							<div className="flex gap-4 mt-8 pt-4">
								<button
									type="button"
									onClick={() => setIsEditOpen(false)}
									className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all"
								>
									Batal
								</button>
								<button
									type="submit"
									className="flex-1 bg-[#125B2A] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#0B4D1E] transition-all shadow-md"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>{" "}
									Simpan
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* MODAL 2: UBAH PASSWORD */}
			{isPassOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
					<div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative animate-fade-in-up border border-gray-100">
						<div className="flex justify-between items-center mb-8">
							<h3 className="text-2xl font-extrabold text-[#0B4D1E]">
								Ubah Password
							</h3>
							<button
								onClick={() => setIsPassOpen(false)}
								className="text-gray-400 hover:text-gray-600"
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
						<form onSubmit={handleSavePassword} className="space-y-5">
							{/* Old Pass */}
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Password Lama
								</label>
								<div className="relative">
									<input
										type={showOldPass ? "text" : "password"}
										className="w-full bg-[#F5EFE6] px-5 py-4 pr-12 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]"
									/>
									<button
										type="button"
										onClick={() => setShowOldPass(!showOldPass)}
										className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#0B4D1E]"
									>
										{showOldPass ? (
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
													d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.143-1.64c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29"
												/>
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
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</svg>
										)}
									</button>
								</div>
							</div>

							{/* New Pass */}
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Password Baru
								</label>
								<div className="relative">
									<input
										type={showNewPass ? "text" : "password"}
										className="w-full bg-[#F5EFE6] px-5 py-4 pr-12 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]"
									/>
									<button
										type="button"
										onClick={() => setShowNewPass(!showNewPass)}
										className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#0B4D1E]"
									>
										{showNewPass ? (
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
													d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.143-1.64c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29"
												/>
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
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</svg>
										)}
									</button>
								</div>
							</div>

							{/* Confirm Pass */}
							<div>
								<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
									Konfirmasi Password Baru
								</label>
								<div className="relative">
									<input
										type={showConfPass ? "text" : "password"}
										className="w-full bg-[#F5EFE6] px-5 py-4 pr-12 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]"
									/>
									<button
										type="button"
										onClick={() => setShowConfPass(!showConfPass)}
										className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#0B4D1E]"
									>
										{showConfPass ? (
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
													d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.143-1.64c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29"
												/>
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
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</svg>
										)}
									</button>
								</div>
							</div>

							<div className="flex gap-4 mt-8 pt-4">
								<button
									type="button"
									onClick={() => setIsPassOpen(false)}
									className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all"
								>
									Batal
								</button>
								<button
									type="submit"
									className="flex-1 bg-[#125B2A] text-white py-4 flex items-center justify-center gap-2 rounded-2xl font-bold hover:bg-[#0B4D1E] shadow-md transition-all"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>{" "}
									Ubah Password
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* TOAST NOTIFIKASI */}
			{toastMessage && (
				<div className="fixed top-[110px] right-10 z-[9999] bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in">
					<div className="bg-[#2E7D32] text-white rounded-full p-1">
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
					</div>
					<span className="font-extrabold text-sm">{toastMessage}</span>
				</div>
			)}
		</AdminLayout>
	);
}

export default ProfilPage;
