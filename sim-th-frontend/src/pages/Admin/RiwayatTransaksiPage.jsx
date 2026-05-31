import React from 'react';
import AdminLayout from '../../components/AdminLayout';

function RiwayatTransaksiPage() {
  
  // Dummy Data Riwayat
  const historyData = [
    { id: 1, title: 'Plastik - 25 kg', badge: 'FATETA', desc: '9 Mei 2026 • Admin SIM-TH', nilai: 'Rp 112.500' },
    { id: 2, title: 'Kertas - 15 kg', badge: 'FAPET', desc: '8 Mei 2026 • Admin SIM-TH', nilai: 'Rp 37.500' },
    { id: 3, title: 'Logam - 10 kg', badge: 'FEM', desc: '7 Mei 2026 • Admin SIM-TH', nilai: 'Rp 75.000' },
    { id: 4, title: 'Kaca - 20 kg', badge: 'FAHUTAN', desc: '28 Apr 2026 • Admin SIM-TH', nilai: 'Rp 40.000' },
    { id: 5, title: 'Plastik - 30.5 kg', badge: 'FATETA', desc: '6 Mei 2026 • Admin SIM-TH', nilai: 'Rp 137.250' },
    { id: 6, title: 'Organik - 10 kg', badge: 'FMIPA', desc: '5 Mei 2026 • Admin SIM-TH', nilai: 'Rp 15.000' },
  ];

  return (
    <AdminLayout>
      {/* BANNER */}
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex items-center gap-5 text-white mt-2 mb-8 shadow-sm">
        <div className="bg-[#F4A300] p-4 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold mb-1">Riwayat Transaksi</h2>
          <p className="text-green-100/80 font-medium">Semua transaksi sampah dari seluruh wilayah</p>
        </div>
      </div>

      {/* FILTER & SEARCH (GABUNG DALAM 1 CARD) */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
        <div className="relative mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Cari wilayah, kategori, user, tanggal, catatan..." className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-all" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ['Semua Wilayah', 'FATETA', 'FAPET'],
            ['Semua Kategori', 'Plastik', 'Kertas'],
            ['Semua Bulan', 'Mei', 'April'],
            ['2026', '2025']
          ].map((opts, i) => (
            <div key={i} className="relative">
              <select className="w-full bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-3.5 rounded-xl outline-none border border-transparent focus:border-[#F4A300] cursor-pointer appearance-none">
                {opts.map(opt => <option key={opt}>{opt}</option>)}
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0B4D1E] pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm font-medium mb-1">Total Transaksi</p>
          <h3 className="text-4xl font-extrabold text-[#0B4D1E]">10</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm font-medium mb-1">Total Berat</p>
          <h3 className="text-4xl font-extrabold text-[#0B4D1E]">186 kg</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm font-medium mb-1">Total Nilai</p>
          <h3 className="text-4xl font-extrabold text-green-600">Rp 464.000</h3>
        </div>
      </div>

      {/* DAFTAR TRANSAKSI (SCROLLABLE) */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
        <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">Daftar Transaksi</h3>
        
        {/* Kontainer yang bisa di-scroll kalau datanya panjang */}
        <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {historyData.map((item) => (
            <div key={item.id} className="flex justify-between items-center bg-[#F5EFE6] p-5 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 cursor-pointer">
              <div className="flex items-center gap-5">
                <div className="bg-white p-4 rounded-xl text-green-600 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-extrabold text-[#0B4D1E] text-base">{item.title}</h4>
                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">{item.badge}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-1">{item.desc}</p>
                </div>
              </div>
              <div className="font-extrabold text-[#0B4D1E] text-lg">{item.nilai}</div>
            </div>
          ))}
        </div>
      </div>

    </AdminLayout>
  );
}

export default RiwayatTransaksiPage;