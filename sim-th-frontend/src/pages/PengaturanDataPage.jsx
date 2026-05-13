import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

function PengaturanDataPage() {
  const [namaWilayah, setNamaWilayah] = useState('');
  const [namaKategori, setNamaKategori] = useState('');
  const [hargaKategori, setHargaKategori] = useState('');

  const handleAddWilayah = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/wilayah`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: namaWilayah, status: 'Aktif' })
      });
      const data = await res.json();
      alert(data.pesan);
      if(data.status === 'sukses') setNamaWilayah('');
    } catch (err) { alert('Gagal memproses koneksi ke backend.'); }
  };

  const handleAddKategori = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/kategori`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_kategori: namaKategori, harga_per_kg: parseInt(hargaKategori) })
      });
      const data = await res.json();
      alert(data.pesan);
      if(data.status === 'sukses') { setNamaKategori(''); setHargaKategori(''); }
    } catch (err) { alert('Gagal memproses koneksi ke backend.'); }
  };

  return (
    <DashboardLayout>
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex items-center gap-5 text-white shadow-sm mt-2 mb-8">
        <div className="bg-[#F4A300] p-4 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold mb-1">Pengaturan Data</h2>
          <p className="text-green-100/80 font-medium">Konfigurasi Entitas Sistem</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="font-extrabold text-2xl text-[#0B4D1E] mb-6">Tambah Wilayah Baru</h3>
          <form onSubmit={handleAddWilayah} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama Wilayah</label>
              <input type="text" value={namaWilayah} onChange={(e) => setNamaWilayah(e.target.value)} required className="w-full bg-[#F5EFE6] border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-[#0B4D1E] font-bold text-[#0B4D1E] outline-none" placeholder="Contoh: BEM FATETA" />
            </div>
            <button type="submit" className="w-full bg-[#0B4D1E] text-white py-4 rounded-2xl font-bold mt-2 hover:bg-[#083a16] transition-all shadow-md">Simpan Wilayah</button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="font-extrabold text-2xl text-[#0B4D1E] mb-6">Tambah Kategori Sampah</h3>
          <form onSubmit={handleAddKategori} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama Kategori</label>
              <input type="text" value={namaKategori} onChange={(e) => setNamaKategori(e.target.value)} required className="w-full bg-[#F5EFE6] border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-[#0B4D1E] font-bold text-[#0B4D1E] outline-none" placeholder="Contoh: Logam Murni" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Harga per Kg (Rp)</label>
              <input type="number" value={hargaKategori} onChange={(e) => setHargaKategori(e.target.value)} required className="w-full bg-[#F5EFE6] border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-[#0B4D1E] font-bold text-[#0B4D1E] outline-none" placeholder="Contoh: 4500" />
            </div>
            <button type="submit" className="w-full bg-[#0B4D1E] text-white py-4 rounded-2xl font-bold mt-2 hover:bg-[#083a16] transition-all shadow-md">Simpan Kategori</button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PengaturanDataPage;