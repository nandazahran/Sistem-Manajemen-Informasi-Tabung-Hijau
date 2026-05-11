import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

function RiwayatTransaksiPage() {
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterBulan, setFilterBulan] = useState('');
  const [filterTahun, setFilterTahun] = useState('');

  const riwayatData = [
    { tanggal: '9 Mei 2026', kategori: 'Plastik', berat: '25 kg', nilai: 'Rp 50.000', status: 'Selesai' },
    { tanggal: '8 Mei 2026', kategori: 'Kertas', berat: '15 kg', nilai: 'Rp 25.000', status: 'Selesai' },
    { tanggal: '7 Mei 2026', kategori: 'Logam', berat: '10 kg', nilai: 'Rp 75.000', status: 'Selesai' },
    { tanggal: '6 Mei 2026', kategori: 'Plastik', berat: '30 kg', nilai: 'Rp 60.000', status: 'Selesai' },
  ];

  return (
    <DashboardLayout>
      <div className="bg-[#0B4D1E] rounded-3xl p-10 flex items-center gap-4 text-white shadow-sm mt-2 mb-8">
        <div className="bg-[#F4A300] p-3 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold mb-1">Riwayat Transaksi</h2>
          <p className="text-green-100/80 font-medium">Semua transaksi sampah wilayah Anda</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <label className="block text-sm font-bold text-[#0B4D1E] mb-3">Pencarian</label>
        <div className="relative mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Cari kategori, tanggal, catatan... (contoh: plastik, 7 Mei, botol)" className="w-full bg-[#F5EFE6] border-none px-14 py-4 rounded-xl focus:ring-2 focus:ring-[#0B4D1E] font-medium" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Kategori</label>
            <select value={filterKategori} onChange={(e)=>setFilterKategori(e.target.value)} className="w-full bg-[#F5EFE6] border-none px-5 py-3.5 rounded-xl font-medium text-gray-600 appearance-none">
              <option value="">Semua Kategori</option>
              <option value="Plastik">Plastik</option>
              <option value="Kertas">Kertas</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Bulan</label>
            <input type="month" value={filterBulan} onChange={(e)=>setFilterBulan(e.target.value)} className="w-full bg-[#F5EFE6] border-none px-5 py-3.5 rounded-xl font-medium text-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Tahun</label>
            <input type="number" placeholder="2026" value={filterTahun} onChange={(e)=>setFilterTahun(e.target.value)} className="w-full bg-[#F5EFE6] border-none px-5 py-3.5 rounded-xl font-medium text-gray-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <table className="w-full text-left">
          <thead className="bg-[#F5EFE6] text-[#0B4D1E]">
            <tr>
              <th className="px-8 py-5 font-bold">Tanggal</th>
              <th className="px-8 py-5 font-bold">Kategori</th>
              <th className="px-8 py-5 font-bold">Berat (kg)</th>
              <th className="px-8 py-5 font-bold">Nilai (Rp)</th>
              <th className="px-8 py-5 font-bold">Status</th>
              <th className="px-8 py-5 font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {riwayatData.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-5 text-gray-600 font-medium">{item.tanggal}</td>
                <td className="px-8 py-5"><span className="bg-[#F5EFE6] text-[#0B4D1E] px-3 py-1 rounded-full font-bold text-sm">{item.kategori}</span></td>
                <td className="px-8 py-5 font-extrabold text-[#0B4D1E]">{item.berat}</td>
                <td className="px-8 py-5 font-extrabold text-green-600">{item.nilai}</td>
                <td className="px-8 py-5"><span className="text-green-600 bg-green-100 px-3 py-1 rounded-full font-bold text-xs border border-green-200">{item.status}</span></td>
                <td className="px-8 py-5">
                  <button className="text-[#0B4D1E] font-bold hover:text-[#F4A300] transition-colors text-sm underline">Lihat Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-gray-400 font-medium text-sm mb-1">Total Transaksi</p>
          <h3 className="text-4xl font-extrabold text-[#0B4D1E]">8</h3>
          <p className="text-xs text-gray-400 mt-2">Semua data</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-gray-400 font-medium text-sm mb-1">Total Berat</p>
          <h3 className="text-4xl font-extrabold text-[#0B4D1E]">138 kg</h3>
          <p className="text-xs text-gray-400 mt-2">Semua data</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-gray-400 font-medium text-sm mb-1">Total Nilai</p>
          <h3 className="text-4xl font-extrabold text-green-600">Rp 366.000</h3>
          <p className="text-xs text-gray-400 mt-2">Semua data</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default RiwayatTransaksiPage;