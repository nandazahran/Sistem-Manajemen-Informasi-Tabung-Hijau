import AOS from "aos";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "aos/dist/aos.css";

import imgAbout from "../assets/LP-About-Gambar-Samping.png";
import icon1 from "../assets/LP-HDIW-Icon-1.png";
import icon2 from "../assets/LP-HDIW-Icon-2.png";
import icon3 from "../assets/LP-HDIW-Icon-3.png";
import icon4 from "../assets/LP-HDIW-Icon-4.png";
import icon5 from "../assets/LP-HDIW-Icon-5.png";
// 1. IMPORT SEMUA GAMBAR DARI FOLDER ASSETS
import imgHome from "../assets/LP-Home.png";

function LandingPage() {
	const [activeSection, setActiveSection] = useState("home");
	const navigate = useNavigate();

	// Auto-redirect jika sudah login
	useEffect(() => {
		const token =
			localStorage.getItem("token") || sessionStorage.getItem("token");
		const userStr =
			localStorage.getItem("user") || sessionStorage.getItem("user");

		if (token && userStr) {
			try {
				const user = JSON.parse(userStr);
				if (["admin", "superadmin", "bem_km"].includes(user.role)) {
					navigate("/admin/dashboard");
				} else if (user.role === "dui") {
					navigate("/dui/dashboard");
				} else {
					navigate("/dashboard");
				}
			} catch (_err) {
				// Abaikan jika error parsing
			}
		}
	}, [navigate]);

	// State untuk form kontak
	const [nama, setNama] = useState("");
	const [email, setEmail] = useState("");
	const [pesan, setPesan] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [statusPesan, setStatusPesan] = useState({ tipe: "", teks: "" });

	// Fungsi untuk mengirim pesan ke backend
	const handleKirimPesan = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setStatusPesan({ tipe: "", teks: "" });

		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/kontak`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ nama, email, pesan }),
			});

			const data = await response.json();

			if (response.status === 201) {
				setStatusPesan({ tipe: "sukses", teks: data.pesan });
				setNama("");
				setEmail("");
				setPesan("");
			} else {
				setStatusPesan({
					tipe: "error",
					teks: data.pesan || "Gagal mengirim pesan.",
				});
			}
		} catch (_error) {
			setStatusPesan({
				tipe: "error",
				teks: "Koneksi gagal. Pastikan backend sudah menyala.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		AOS.init({ duration: 800, once: true, offset: 100 });
		const handleScroll = () => {
			const sections = ["home", "about", "how-it-works", "benefits", "contact"];
			let currentSection = "home";
			for (let i = 0; i < sections.length; i++) {
				const section = document.getElementById(sections[i]);
				if (section && window.scrollY >= section.offsetTop - 150) {
					currentSection = sections[i];
				}
			}
			setActiveSection(currentSection);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="min-h-screen bg-[#F5EFE6] font-sans scroll-smooth overflow-x-hidden">
			{/* NAVBAR */}
			<nav className="fixed top-0 left-0 w-full bg-[#0B4D1E] px-8 py-4 flex justify-between items-center z-[100] shadow-lg transition-all duration-300">
				<div
					className="flex items-center gap-2 text-white font-bold text-xl cursor-pointer"
					onClick={() => window.scrollTo(0, 0)}
				>
					<div className="bg-[#F4A300] p-1.5 rounded-md">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 text-white"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							/>
						</svg>
					</div>
					SIM-TH
				</div>

				<div className="hidden md:flex gap-8 text-sm font-medium text-gray-200">
					<a
						href="#home"
						className={`transition-colors ${activeSection === "home" ? "text-[#F4A300] font-bold" : "hover:text-[#F4A300]"}`}
					>
						Home
					</a>
					<a
						href="#about"
						className={`transition-colors ${activeSection === "about" ? "text-[#F4A300] font-bold" : "hover:text-[#F4A300]"}`}
					>
						About
					</a>
					<a
						href="#how-it-works"
						className={`transition-colors ${activeSection === "how-it-works" ? "text-[#F4A300] font-bold" : "hover:text-[#F4A300]"}`}
					>
						How it Works
					</a>
					<a
						href="#benefits"
						className={`transition-colors ${activeSection === "benefits" ? "text-[#F4A300] font-bold" : "hover:text-[#F4A300]"}`}
					>
						Benefits
					</a>
					<a
						href="#contact"
						className={`transition-colors ${activeSection === "contact" ? "text-[#F4A300] font-bold" : "hover:text-[#F4A300]"}`}
					>
						Contact
					</a>
				</div>
			</nav>

			{/* 1. HERO SECTION (REVISI: FIX CROPPING, BLEND & TEXT READABILITY) */}
			<section
				id="home"
				className="relative min-h-screen flex flex-col items-center justify-start pt-28 md:pt-36 px-8 z-0"
			>
				{/* Background Image Layer */}
				<div
					className="absolute inset-0 z-[-1] bg-cover bg-bottom bg-no-repeat w-full h-full"
					style={{ backgroundImage: `url(${imgHome})` }}
				></div>

				{/* Text Content */}
				<div className="z-10 flex flex-col items-center text-center mt-2">
					{/* Kasih drop-shadow putih dikit di judul biar pop-up kalau kena pohon */}
					<h1
						data-aos="zoom-in"
						className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-[0_4px_10px_rgba(255,255,255,0.8)]"
					>
						<span className="text-[#F4A300]">Clean</span>{" "}
						<span className="text-[#0B4D1E]">campus &</span> <br />
						<span className="text-[#F4A300]">green</span>{" "}
						<span className="text-[#0B4D1E]">future</span>
					</h1>

					{/* REVISI: Tambahin Glassmorphism (bg-white/80 + backdrop-blur) di sub-heading */}
					<p
						data-aos="fade-up"
						data-aos-delay="200"
						className="mt-6 text-[#0B4D1E] max-w-2xl text-xl font-bold bg-[#F5EFE6]/80 backdrop-blur-md px-8 py-4 rounded-2xl shadow-sm border border-white/60"
					>
						Sistem digital untuk pengelolaan sampah kampus yang terstruktur dan
						memberikan nilai ekonomi
					</p>

					<div data-aos="fade-up" data-aos-delay="400">
						<Link
							to="/login"
							className="inline-block mt-8 px-10 py-4 bg-[#F4A300] text-white font-extrabold rounded-full shadow-xl hover:bg-[#d68e00] transform hover:scale-105 transition-all"
						>
							Get Started
						</Link>
					</div>
				</div>
			</section>

			{/* 2. ABOUT SECTION DENGAN GAMBAR (KIRI TEKS, KANAN GAMBAR) */}
			<section
				id="about"
				className="min-h-screen bg-[#0B4D1E] text-white py-24 px-8 md:px-20 grid md:grid-cols-2 gap-12 items-center overflow-hidden"
			>
				<div data-aos="fade-right">
					<h2 className="text-5xl md:text-6xl font-extrabold mb-8 leading-tight">
						About <span className="text-[#F4A300]">the</span>
						<br />
						initiative.
					</h2>
					<p className="text-green-50 leading-relaxed mb-6 text-lg">
						SIM-TH adalah sistem informasi yang mendukung program{" "}
						<span className="text-[#F4A300] font-bold">Tabung Hijau</span> dalam
						pengelolaan sampah berbasis kampus secara digital, terstruktur, dan
						transparan.
					</p>
					<p className="text-green-50 leading-relaxed mb-10 text-lg">
						Dengan teknologi modern, kami membantu kampus mengelola sampah
						dengan lebih efisien sambil memberikan nilai ekonomi bagi mahasiswa.
					</p>
				</div>
				<div data-aos="fade-left" className="flex justify-center items-center">
					<img
						src={imgAbout}
						alt="Tentang Tabung Hijau"
						className="w-full max-w-md object-contain hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
					/>
				</div>
			</section>

			{/* 3. HOW IT WORKS DENGAN ICON GAMBAR */}
			<section
				id="how-it-works"
				className="min-h-screen bg-[#F4A300] py-24 px-8 md:px-20 flex flex-col justify-center overflow-hidden"
			>
				<div data-aos="fade-up" className="mb-16 text-white text-center">
					<h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-[#0B4D1E]">
						How does
						<br />
						it work?
					</h2>
					<p className="text-lg opacity-90 font-medium text-[#0B4D1E]">
						Proses pengelolaan sampah kampus yang sistematis dan terstruktur
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-5 gap-6">
					{[
						{
							step: "01",
							title: "Pengumpulan",
							desc: "Mahasiswa mengumpulkan sampah",
							icon: icon1,
						},
						{
							step: "02",
							title: "Pemilahan",
							desc: "Memilah berdasarkan jenis",
							icon: icon2,
						},
						{
							step: "03",
							title: "Penyetoran",
							desc: "Setor ke bank sampah",
							icon: icon3,
						},
						{
							step: "04",
							title: "Pencatatan",
							desc: "Input data digital",
							icon: icon4,
						},
						{
							step: "05",
							title: "Distribusi",
							desc: "Pembagian hasil",
							icon: icon5,
						},
					].map((item, index) => (
						<div
							key={index}
							data-aos="fade-up"
							data-aos-delay={index * 100}
							className="bg-white rounded-3xl p-8 shadow-xl flex flex-col hover:-translate-y-3 transition-transform duration-300"
						>
							<div className="flex justify-between items-start mb-6">
								<h3 className="text-5xl font-extrabold text-[#F5EFE6]">
									{item.step}
								</h3>
								<div className="w-16 h-16 bg-[#F5EFE6] rounded-2xl flex items-center justify-center p-3">
									<img
										src={item.icon}
										alt={item.title}
										className="w-full h-full object-contain"
									/>
								</div>
							</div>
							<h4 className="text-xl font-bold text-[#0B4D1E] mb-2">
								{item.title}
							</h4>
							<p className="text-sm text-gray-500 font-medium leading-relaxed">
								{item.desc}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* 4. BENEFITS SECTION */}
			<section
				id="benefits"
				className="min-h-screen bg-[#F5EFE6] py-24 px-8 md:px-20 flex flex-col justify-center items-center"
			>
				<div className="max-w-6xl w-full">
					<h2
						data-aos="fade-down"
						className="text-5xl md:text-6xl font-extrabold text-[#0B4D1E] mb-4"
					>
						Benefits<span className="text-[#F4A300]">.</span>
					</h2>
					<p
						data-aos="fade-up"
						className="text-gray-500 text-lg mb-16 max-w-2xl font-medium"
					>
						Keuntungan yang didapat dari program Tabung Hijau untuk kampus dan
						mahasiswa
					</p>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div
							data-aos="fade-up"
							data-aos-delay="100"
							className="bg-white rounded-[2rem] p-10 border-2 border-[#125B2A] shadow-xl hover:-translate-y-2 transition-transform duration-300"
						>
							<div className="w-16 h-16 bg-[#125B2A] rounded-2xl flex items-center justify-center mb-6">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-10 w-10 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
									/>
								</svg>
							</div>
							<h4 className="text-[#125B2A] font-extrabold text-[10px] tracking-widest uppercase mb-2">
								Environmental
							</h4>
							<h3 className="text-2xl font-extrabold text-[#0B4D1E] mb-4 leading-tight">
								Mengurangi sampah
							</h3>
							<p className="text-gray-500 font-medium text-sm leading-relaxed">
								Volume sampah kampus berkurang signifikan dengan sistem
								pemilahan yang terorganisir
							</p>
						</div>

						<div
							data-aos="fade-up"
							data-aos-delay="200"
							className="bg-white rounded-[2rem] p-10 border-2 border-[#F4A300] shadow-xl hover:-translate-y-2 transition-transform duration-300"
						>
							<div className="w-16 h-16 bg-[#F4A300] rounded-2xl flex items-center justify-center mb-6">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-10 w-10 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h4 className="text-[#F4A300] font-extrabold text-[10px] tracking-widest uppercase mb-2">
								Economic
							</h4>
							<h3 className="text-2xl font-extrabold text-[#0B4D1E] mb-4 leading-tight">
								Nilai ekonomi
							</h3>
							<p className="text-gray-500 font-medium text-sm leading-relaxed">
								Sampah anorganik memiliki nilai jual yang memberikan keuntungan
								finansial untuk mahasiswa
							</p>
						</div>

						<div
							data-aos="fade-up"
							data-aos-delay="300"
							className="bg-white rounded-[2rem] p-10 border-2 border-[#125B2A] shadow-xl hover:-translate-y-2 transition-transform duration-300"
						>
							<div className="w-16 h-16 bg-[#125B2A] rounded-2xl flex items-center justify-center mb-6">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-10 w-10 text-white"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M11.69 3.037a1 1 0 10-1.38-1.614l-7.5 6.429a1 1 0 00.315 1.713l3.655.845-1.954 6.643a1 1 0 101.92.564l7.5-6.429a1 1 0 00-.315-1.713l-3.655-.845 1.954-6.643z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<h4 className="text-[#125B2A] font-extrabold text-[10px] tracking-widest uppercase mb-2">
								Educational
							</h4>
							<h3 className="text-2xl font-extrabold text-[#0B4D1E] mb-4 leading-tight">
								Kesadaran lingkungan
							</h3>
							<p className="text-gray-500 font-medium text-sm leading-relaxed">
								Meningkatkan kepedulian dan edukasi mahasiswa terhadap
								pengelolaan sampah yang berkelanjutan
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* 5. CONTACT US SECTION */}
			<section
				id="contact"
				className="relative min-h-screen flex flex-col justify-center pt-24 pb-48 px-8 md:px-20 bg-gradient-to-b from-[#F5EFE6] to-[#d7e3df] overflow-hidden"
			>
				<div className="absolute bottom-0 left-0 w-full z-0 flex flex-col pointer-events-none">
					<svg
						className="w-full h-auto mb-[-2px]"
						viewBox="0 0 1440 320"
						preserveAspectRatio="none"
					>
						<path
							fill="#0B4D1E"
							fillOpacity="1"
							d="M0,224L80,192C160,160,320,96,480,106.7C640,117,800,203,960,213.3C1120,224,1280,160,1360,128L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
						></path>
					</svg>
					<div className="w-full h-[150px] bg-[#3A837A] relative">
						<div className="absolute top-4 left-[10%] w-[30%] h-[1px] bg-white/30 rounded-full"></div>
						<div className="absolute top-8 right-[5%] w-[40%] h-[2px] bg-white/20 rounded-full"></div>
						<div className="absolute top-14 left-[40%] w-[20%] h-[1.5px] bg-white/40 rounded-full"></div>
					</div>
				</div>

				<div className="relative z-10">
					<div data-aos="fade-down" className="text-center mb-12">
						<h2 className="text-5xl md:text-6xl font-extrabold text-[#0B4D1E] mb-4">
							Contact <span className="text-[#F4A300]">Us.</span>
						</h2>
						<p className="text-gray-600 text-lg font-medium">
							Hubungi kami untuk informasi lebih lanjut tentang SIM-TH
						</p>
					</div>

					<div
						data-aos="zoom-in-up"
						className="max-w-5xl mx-auto bg-[#FFFFFF] rounded-3xl p-10 md:p-14 shadow-2xl flex flex-col md:flex-row gap-16 border border-white/50"
					>
						<div className="md:w-1/2">
							<h3 className="text-2xl font-extrabold text-[#0B4D1E] mb-8">
								Contact Information
							</h3>
							<div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4 mb-10 border border-gray-100">
								<div className="w-12 h-12 bg-[#F4A300] flex items-center justify-center rounded-xl text-white shadow-md">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<div>
									<p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
										Email
									</p>
									<p className="text-[#0B4D1E] font-bold text-lg">
										simth@kampus.ac.id
									</p>
								</div>
							</div>
							<h3 className="text-lg font-extrabold text-[#0B4D1E] mb-4">
								Social Media
							</h3>
							<div className="flex gap-4">
								<button className="px-6 py-2.5 bg-[#0B4D1E] text-white font-bold rounded-full text-sm hover:bg-[#083a16] transition-colors">
									Instagram
								</button>
								<button className="px-6 py-2.5 bg-[#0B4D1E] text-white font-bold rounded-full text-sm hover:bg-[#083a16] transition-colors">
									Twitter
								</button>
							</div>
						</div>

						<form
							onSubmit={handleKirimPesan}
							className="md:w-1/2 flex flex-col gap-4"
						>
							{statusPesan.teks && (
								<div
									className={`px-4 py-3 rounded-xl text-sm font-bold border ${
										statusPesan.tipe === "sukses"
											? "bg-green-100 border-green-400 text-green-700"
											: "bg-red-100 border-red-400 text-red-700"
									}`}
								>
									{statusPesan.teks}
								</div>
							)}
							<input
								type="text"
								placeholder="Nama Lengkap"
								value={nama}
								onChange={(e) => setNama(e.target.value)}
								required
								className="w-full bg-white px-5 py-4 rounded-xl border border-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-all"
							/>
							<input
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="w-full bg-white px-5 py-4 rounded-xl border border-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-all"
							/>
							<textarea
								placeholder="Pesan Anda"
								rows="4"
								value={pesan}
								onChange={(e) => setPesan(e.target.value)}
								required
								className="w-full bg-white px-5 py-4 rounded-xl border border-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#0B4D1E] resize-none transition-all"
							></textarea>
							<button
								type="submit"
								disabled={isLoading}
								className={`w-full text-white py-4 rounded-xl font-bold transition-all mt-2 ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0B4D1E] hover:bg-[#083a16] hover:shadow-lg transform hover:-translate-y-1"}`}
							>
								{isLoading ? "Mengirim..." : "Send Message"}
							</button>
						</form>
					</div>
				</div>
			</section>

			<footer className="relative bg-[#3A837A] pt-4 pb-8 text-center text-white text-sm font-medium z-10 border-t border-white/20">
				© 2026 SIM-TH - Sistem Informasi Manajemen Tabung Hijau. All rights
				reserved.
			</footer>
		</div>
	);
}

export default LandingPage;
