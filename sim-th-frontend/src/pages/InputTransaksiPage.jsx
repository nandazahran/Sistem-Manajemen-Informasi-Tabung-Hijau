import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

function InputTransaksiPage() {
  const [kategori, setKategori] = useState('');
  const [berat, setBerat] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [catatan, setCatatan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulasi loading animasi
    setTimeout(() => {
      alert(`Transaksi ${kategori} seberat ${berat}kg berhasil disimpan!`);
      setIsLoading(false);
      setKategori(''); setBerat(''); setTanggal(''); setCatatan('');
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="bg-[#0B4D1E] rounded-3xl p-10 flex items-center gap-4 text-white shadow-sm mt-2">
        <div className="bg-[#F4A300] p-3 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold mb-1">Input Transaksi</h2>
          <p className="text-green-100/80 font-medium">Catat setoran sampah dari wilayah Anda</p>
        </div>
      </div>

      <div className="flex gap-6 mt-8 items-start">
        <div className="bg-white flex-1 p-10 rounded-3xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div>
              <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Kategori Sampah <span className="text-red-500">*</span></label>
              <select value={kategori} onChange={(e) => setKategori(e.target.value)} required className="w-full bg-[#F5EFE6] border-none px-5 py-4 rounded-xl focus:ring-2 focus:ring-[#0B4D1E] appearance-none font-medium cursor-pointer">
                <option value="" disabled>Pilih kategori...</option>
                <option value="Plastik">Plastik</option>
                <option value="Kertas">Kertas</option>
                <option value="Logam">Logam</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Berat Sampah (kg) <span className="text-red-500">*</span></label>
              {/* Input combo box dengan panah atas bawah dan support desimal */}
              <input type="number" step="0.01" min="0" value={berat} onChange={(e) => setBerat(e.target.value)} required placeholder="Contoh: 25.5" className="w-full bg-[#F5EFE6] border-none px-5 py-4 rounded-xl focus:ring-2 focus:ring-[#0B4D1E] font-medium" />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Wilayah</label>
              <input type="text" value="BEM FATETA" readOnly className="w-full bg-gray-100 text-gray-500 border-none px-5 py-4 rounded-xl font-bold cursor-not-allowed" />
              <p className="text-[11px] text-gray-400 mt-2">Wilayah Anda terdeteksi otomatis</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Tanggal Transaksi <span className="text-red-500">*</span></label>
              {/* Native Date Picker */}
              <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} required className="w-full bg-[#F5EFE6] border-none px-5 py-4 rounded-xl focus:ring-2 focus:ring-[#0B4D1E] font-medium text-gray-700" />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Catatan <span className="text-gray-400 font-normal">(opsional)</span></label>
              <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} rows="3" placeholder="Tambahkan catatan jika diperlukan..." className="w-full bg-[#F5EFE6] border-none px-5 py-4 rounded-xl focus:ring-2 focus:ring-[#0B4D1E] resize-none font-medium"></textarea>
            </div>

            <button type="submit" disabled={isLoading} className={`w-full text-white py-4 rounded-xl font-bold transition-all mt-4 flex items-center justify-center gap-2 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#F4A300] hover:bg-[#d68e00] hover:-translate-y-1 hover:shadow-lg'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {isLoading ? 'Menyimpan...' : 'Simpan Transaksi'}
            </button>
          </form>
        </div>

        <div className="w-80 bg-[#E8E1D5]/50 border border-[#0B4D1E]/20 p-6 rounded-3xl sticky top-32">
          <h3 className="font-extrabold text-[#0B4D1E] flex items-center gap-2 mb-4">
            <span className="w-4 h-4 bg-[#0B4D1E] rounded-sm"></span> Tips Pencatatan
          </h3>
          <ul className="text-sm text-[#0B4D1E]/80 space-y-3 font-medium">
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