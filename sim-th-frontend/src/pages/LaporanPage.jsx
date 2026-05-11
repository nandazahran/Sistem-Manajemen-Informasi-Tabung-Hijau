import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

function LaporanPage() {
  const [bulanLaporan, setBulanLaporan] = useState('2026-05');

  return (
    <DashboardLayout>
      <div className="bg-[#0B4D1E] rounded-3xl p-10 flex items-center justify-between shadow-sm mt-2 mb-6 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-[#F4A300] p-3 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mb-1">Laporan Lengkap</h2>
            <p className="text-green-100/80 font-medium">Laporan dan statistik pengelolaan sampah komprehensif</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <input type="month" value={bulanLaporan} onChange={(e)=>setBulanLaporan(e.target.value)} className="border-none text-gray-700 font-bold outline-none cursor-pointer" />
          </div>
          <button className="bg-[#F4A300] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#d68e00] transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export Laporan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Sampah', val: '520 kg', badge: '+12% dari bulan lalu' },
          { title: 'Nilai Ekonomi', val: 'Rp 1.25jt', badge: '+8% dari bulan lalu' },
          { title: 'Total Transaksi', val: '128', badge: '+15% dari bulan lalu' },
          { title: 'Saldo Tabungan', val: 'Rp 270rb', badge: '+28% bulan ini' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-gray-500 font-medium text-sm mb-1">{item.title}</p>
            <h3 className="text-3xl font-extrabold text-[#0B4D1E] mb-2">{item.val}</h3>
            <p className="text-xs font-bold text-green-600">{item.badge}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <h3 className="font-extrabold text-2xl text-[#0B4D1E] mb-8">Nilai Ekonomi & Pemasukan Bulanan</h3>
        <div className="w-full h-80 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center">
          <p className="text-gray-400 font-medium">Grafik Line Chart (Pemasukan & Saldo Tabungan)</p>
        </div>
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <h3 className="font-extrabold text-2xl text-[#0B4D1E] mb-8">Breakdown Kategori per Bulan</h3>
        <div className="w-full h-80 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center">
          <p className="text-gray-400 font-medium">Grafik Bar Chart (Plastik, Kertas, Logam)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Plastik', pct: '52%', weight: '280 kg', rp: 'Rp 650.000' },
          { title: 'Kertas', pct: '31%', weight: '150 kg', rp: 'Rp 350.000', pctColor: 'text-[#F4A300] bg-yellow-100' },
          { title: 'Logam', pct: '17%', weight: '90 kg', rp: 'Rp 250.000', pctColor: 'text-gray-600 bg-gray-100' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative">
            <div className="flex justify-between items-start mb-6">
              <h4 className="font-extrabold text-xl text-[#0B4D1E]">{item.title}</h4>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.pctColor || 'text-green-700 bg-green-100'}`}>{item.pct}</span>
            </div>
            <h3 className="text-4xl font-extrabold text-[#0B4D1E] mb-1">{item.weight}</h3>
            <p className="text-gray-400 font-medium">{item.rp}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default LaporanPage;