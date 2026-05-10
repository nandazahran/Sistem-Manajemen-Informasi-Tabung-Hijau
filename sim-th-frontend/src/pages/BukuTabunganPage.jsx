import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

function BukuTabunganPage() {
  const riwayatPemasukan = [
    { jenis: 'Setoran Plastik', tanggal: '9 Mei 2026', nilai: '+ Rp 50.000' },
    { jenis: 'Setoran Kertas', tanggal: '8 Mei 2026', nilai: '+ Rp 25.000' },
    { jenis: 'Setoran Logam', tanggal: '7 Mei 2026', nilai: '+ Rp 75.000' },
    { jenis: 'Setoran Plastik', tanggal: '6 Mei 2026', nilai: '+ Rp 30.000' },
  ];

  return (
    <DashboardLayout>
      <div className="bg-[#0B4D1E] rounded-3xl p-10 flex items-center justify-between shadow-sm mt-2 mb-6 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-[#F4A300] p-3 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mb-1">Buku Tabungan</h2>
            <p className="text-green-100/80 font-medium">Rekap pendapatan dari sampah wilayah</p>
          </div>
        </div>
        <button className="bg-[#F4A300] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#d68e00] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export Laporan
        </button>
      </div>

      <div className="bg-linear-to-r from-[#0B4D1E] to-[#146b2d] p-10 rounded-3xl text-white shadow-sm mb-6 flex justify-between items-center relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="z-10">
          <p className="text-green-100 font-medium mb-1">Total Saldo Tabungan</p>
          <h3 className="text-5xl font-extrabold mb-2">Rp 270.000</h3>
          <p className="text-sm text-green-200">Wilayah: BEM FATETA • Terakhir diperbarui: 9 Mei 2026</p>
        </div>
        <div className="bg-white/20 px-4 py-2 rounded-full font-bold backdrop-blur-sm border border-white/30 flex items-center gap-2 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          +28% bulan ini
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-6">
        <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">Perkembangan Saldo</h3>
        <div className="w-full h-64 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center">
          <p className="text-gray-400 font-medium">Grafik Line Chart Saldo</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-extrabold text-xl text-[#0B4D1E]">Riwayat Pemasukan</h3>
          <button className="text-sm font-bold text-[#0B4D1E] hover:text-[#F4A300]">Lihat Semua →</button>
        </div>
        <div className="space-y-4">
          {riwayatPemasukan.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center bg-[#F5EFE6] p-4 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" /></svg>
                </div>
                <div><p className="font-bold text-[#0B4D1E]">{item.jenis}</p><p className="text-xs text-gray-500">{item.tanggal}</p></div>
              </div>
              <div className="font-extrabold text-[#0B4D1E]">{item.nilai}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium text-sm mb-1">Pemasukan Bulan Ini</p>
          <h3 className="text-3xl font-extrabold text-[#0B4D1E]">Rp 60.000</h3>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium text-sm mb-1">Rata-rata per Transaksi</p>
          <h3 className="text-3xl font-extrabold text-[#0B4D1E]">Rp 44.000</h3>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium text-sm mb-1">Pertumbuhan</p>
          <h3 className="text-3xl font-extrabold text-[#0B4D1E]">+28%</h3>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default BukuTabunganPage;