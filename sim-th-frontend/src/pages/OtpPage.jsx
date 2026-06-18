import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

function OtpPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const authState = location.state || {}; // { username, preAuthToken, role, nama, rememberMe }

	// State diubah jadi 6 kotak kosong
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [isLoading, setIsLoading] = useState(false);
	const inputRefs = useRef([]);

	const handleChange = (index, value) => {
		// Cuma bolehin ngetik angka
		if (Number.isNaN(value)) return;

		const newOtp = [...otp];
		// Ambil karakter terakhir aja biar nggak numpuk kalau ngetik cepet
		newOtp[index] = value.substring(value.length - 1);
		setOtp(newOtp);

		// Otomatis pindah ke kotak kanan kalau udah diisi (batasnya index 5)
		if (value !== "" && index < 5) {
			inputRefs.current[index + 1].focus();
		}
	};

	const handleKeyDown = (index, e) => {
		// Otomatis mundur ke kotak kiri kalau user nekan tombol hapus (backspace)
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	const [errorMsg, setErrorMsg] = useState("");

	const handleVerify = async (e) => {
		e.preventDefault();
		const otpCode = otp.join("");

		// Validasi harus 6 digit
		if (otpCode.length < 6) {
			setErrorMsg("Masukkan 6 digit kode OTP terlebih dahulu!");
			return;
		}

		setIsLoading(true);
		setErrorMsg("");

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/verify-2fa`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						username: authState.username,
						pre_auth_token: authState.preAuthToken,
						kode_totp: otpCode,
					}),
				},
			);

			const data = await response.json();

			if (response.status === 200 && data.status === "sukses") {
				// Berhasil verifikasi 2FA!
				const userData = {
					role: data.role || authState.role,
					nama: data.nama || authState.nama,
				};
				if (authState.rememberMe) {
					localStorage.setItem("token", data.token);
					localStorage.setItem("user", JSON.stringify(userData));
				} else {
					sessionStorage.setItem("token", data.token);
					sessionStorage.setItem("user", JSON.stringify(userData));
				}

				alert("Verifikasi berhasil! Anda masuk ke sistem.");

				const role = data.role || authState.role;
				if (role === "admin" || role === "superadmin" || role === "bem_km") {
					navigate("/admin/dashboard");
				} else if (role === "dui") {
					navigate("/dui/dashboard");
				} else {
					navigate("/dashboard");
				}
			} else {
				setErrorMsg(data.pesan || "Kode OTP salah. Silakan coba lagi.");
			}
		} catch (_error) {
			setErrorMsg("Gagal terhubung ke server.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthLayout
			title="Verifikasi OTP"
			subtitle="Masukkan 6 digit kode OTP dari Authenticator Anda."
		>
			<form onSubmit={handleVerify} className="flex flex-col gap-6 mt-4">
				{errorMsg && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
						{errorMsg}
					</div>
				)}

				{/* KOTAK INPUT OTP (Disesuaikan ukurannya biar 6 kotak muat sejajar) */}
				<div className="flex justify-center gap-2 sm:gap-4">
					{otp.map((data, index) => (
						<input
							key={index}
							type="text"
							ref={(el) => (inputRefs.current[index] = el)}
							value={data}
							onChange={(e) => handleChange(index, e.target.value)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							className="w-10 h-12 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-extrabold bg-[#F5EFE6] text-[#0B4D1E] rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F4A300] transition-all border border-transparent focus:border-[#F4A300] shadow-inner"
							maxLength="1"
						/>
					))}
				</div>

				<div className="text-center mt-2">
					<p className="text-sm text-gray-500 font-medium">
						Belum menerima kode?{" "}
						<button
							type="button"
							className="text-[#F4A300] font-bold hover:underline"
						>
							Kirim Ulang
						</button>
					</p>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					className={`w-full text-white py-4 rounded-2xl font-bold transition-all shadow-md mt-4 flex items-center justify-center gap-2 ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0B4D1E] hover:bg-[#083a16] hover:-translate-y-1"}`}
				>
					{isLoading && (
						<svg
							className="animate-spin h-5 w-5 text-white"
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
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					)}
					{isLoading ? "Memverifikasi..." : "Verifikasi Kode"}
				</button>
			</form>

			<div className="mt-8 text-center">
				<Link
					to="/login"
					className="text-sm font-bold text-gray-500 hover:text-[#0B4D1E] transition-colors flex items-center justify-center gap-2"
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
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
					Kembali ke Login
				</Link>
			</div>
		</AuthLayout>
	);
}

export default OtpPage;
