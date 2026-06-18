import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

function InputTransaksiPage() {
	const [kategori, setKategori] = useState("");
	const [berat, setBerat] = useState("");
	const [catatan, setCatatan] = useState("");
	const [tanggal, setTanggal] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const [kategoriList, setKategoriList] = useState([]);
	const [wilayahList, setWilayahList] = useState([]);
	const [wilayahId, setWilayahId] = useState("");

	useEffect(() => {
		const fetchInitialData = async () => {
			try {
				const token =
					localStorage.getItem("token") || sessionStorage.getItem("token");
				const headers = { Authorization: `Bearer ${token}` };

				// Ambil Data Kategori dari Backend
				const resKat = await fetch(`${import.meta.env.VITE_API_URL}/kategori`, {
					headers,
				});
				const dataKat = await resKat.json();
				if (dataKat.status === "sukses") setKategoriList(dataKat.data);

				// Ambil SEMUA wilayah aktif ke dalam dropdown (Khusus BEM KM)
				const resWil = await fetch(
					`${import.meta.env.VITE_API_URL}/wilayah/aktif`,
					{ headers },
				);
				const dataWil = await resWil.json();
				if (dataWil.status === "sukses") {
					setWilayahList(dataWil.data);
				}
			} catch (err) {
				console.error("Gagal menarik data awal:", err);
			}
		};
		fetchInitialData();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const token =
				localStorage.getItem("token") || sessionStorage.getItem("token");
			const payload = {
				kategori_id: parseInt(kategori, 10),
				wilayah_id: parseInt(wilayahId, 10),
				berat_gram: parseFloat(berat) * 1000,
				poin_kualitas: 30, // Default maksimal: Sampah Bersih
				catatan: catatan || "Pencatatan standar",
				tanggal: tanggal || new Date().toISOString().split("T")[0], // Kirim Tgl Jika ada, jika tidak, hari ini
			};

			const res = await fetch(`${import.meta.env.VITE_API_URL}/transaksi`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
			const data = await res.json();

			if (data.status === "sukses") {
				alert(data.pesan);
				setKategori("");
				setBerat("");
				setCatatan("");
				setTanggal("");
				setWilayahId("");
			} else {
				alert(`Gagal: ${data.pesan}`);
			}
		} catch (_err) {
			alert("Koneksi gagal saat menyimpan transaksi.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<DashboardLayout>
			<div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex items-center gap-5 text-white shadow-sm mt-2">
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
							d="M12 4v16m8-8H4"
						/>
					</svg>
				</div>
				<div>
					<h2 className="text-3xl font-extrabold mb-1">Input Transaksi</h2>
					<p className="text-green-100/80 font-medium">
						Catat setoran sampah dari wilayah Anda
					</p>
				</div>
			</div>

			<div className="flex flex-col gap-6 mt-8">
				<div className="bg-white w-full p-10 rounded-[2rem] shadow-sm border border-gray-100">
					<form onSubmit={handleSubmit} className="flex flex-col gap-6">
						{/* DROPDOWN KATEGORI DENGAN PANAH CUSTOM */}
						<div>
							<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
								Kategori Sampah <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<select
									value={kategori}
									onChange={(e) => setKategori(e.target.value)}
									required
									className="w-full bg-[#F5EFE6] border-none px-5 py-4 pr-12 rounded-2xl focus:ring-2 focus:ring-[#0B4D1E] appearance-none font-bold text-[#0B4D1E] cursor-pointer outline-none transition-all"
								>
									<option
										value=""
										disabled
										className="text-gray-400 font-normal"
									>
										Pilih kategori...
									</option>
									{kategoriList.map((kat) => (
										<option key={kat.id} value={kat.id}>
											{kat.nama_kategori} (Rp {kat.harga_per_kg}/kg)
										</option>
									))}
								</select>
								{/* Ikon Panah */}
								<div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#0B4D1E]">
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
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</div>
							</div>
						</div>

						<div>
							<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
								Berat Sampah (kg) <span className="text-red-500">*</span>
							</label>
							<input
								type="number"
								step="0.01"
								min="0"
								value={berat}
								onChange={(e) => setBerat(e.target.value)}
								required
								placeholder="Contoh: 25.5"
								className="w-full bg-[#F5EFE6] border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-[#0B4D1E] font-bold text-[#0B4D1E] outline-none transition-all"
							/>
						</div>

						<div>
							<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
								Wilayah Asal Sampah <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<select
									value={wilayahId}
									onChange={(e) => setWilayahId(e.target.value)}
									required
									className="w-full bg-[#F5EFE6] border-none px-5 py-4 pr-12 rounded-2xl focus:ring-2 focus:ring-[#0B4D1E] appearance-none font-bold text-[#0B4D1E] cursor-pointer outline-none transition-all"
								>
									<option
										value=""
										disabled
										className="text-gray-400 font-normal"
									>
										Pilih wilayah tujuan...
									</option>
									{wilayahList.map((w) => (
										<option key={w.id} value={w.id}>
											{w.nama}
										</option>
									))}
								</select>
								<div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#0B4D1E]">
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
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</div>
							</div>
						</div>

						<div>
							<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
								Tanggal Transaksi <span className="text-red-500">*</span>
							</label>
							<input
								type="date"
								value={tanggal}
								onChange={(e) => setTanggal(e.target.value)}
								required
								className="w-full bg-[#F5EFE6] border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-[#0B4D1E] font-bold text-[#0B4D1E] outline-none transition-all cursor-pointer"
							/>
						</div>

						<div>
							<label className="block text-sm font-bold text-[#0B4D1E] mb-2">
								Catatan{" "}
								<span className="text-gray-400 font-normal">(opsional)</span>
							</label>
							<textarea
								value={catatan}
								onChange={(e) => setCatatan(e.target.value)}
								rows="3"
								placeholder="Tambahkan catatan jika diperlukan..."
								className="w-full bg-[#F5EFE6] border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-[#0B4D1E] resize-none font-medium text-[#0B4D1E] outline-none transition-all"
							></textarea>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className={`w-full text-white py-4 rounded-2xl font-bold transition-all mt-4 flex items-center justify-center gap-2 shadow-md ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#F4A300] hover:bg-[#d68e00] hover:-translate-y-1 hover:shadow-lg"}`}
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
									d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							{isLoading ? "Menyimpan..." : "Simpan Transaksi"}
						</button>
					</form>
				</div>

				<div className="w-full bg-[#EAE5DA]/60 border border-[#0B4D1E]/10 p-8 rounded-[2rem]">
					<h3 className="font-extrabold text-[#0B4D1E] flex items-center gap-2 mb-4 text-lg">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6 text-[#F4A300]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
							/>
						</svg>
						Tips Pencatatan
					</h3>
					<ul className="text-sm text-[#0B4D1E]/80 space-y-3 font-medium ml-2">
						<li>• Pastikan sampah sudah dipilah berdasarkan kategori</li>
						<li>• Gunakan timbangan yang akurat untuk mengukur berat</li>
						<li>• Catat transaksi segera setelah penerimaan sampah</li>
						<li>• Simpan bukti foto jika diperlukan untuk dokumentasi</li>
					</ul>
				</div>
			</div>
		</DashboardLayout>
	);
}

export default InputTransaksiPage;
