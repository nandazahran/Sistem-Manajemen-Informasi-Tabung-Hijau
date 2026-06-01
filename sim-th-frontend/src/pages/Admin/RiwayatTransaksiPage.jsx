import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

function RiwayatTransaksiPage() {
  const [selectedTrx, setSelectedTrx] = useState(null);

  // Dummy Data disesuaikan biar pas dengan struktur desain Figma
  const [historyData] = useState([
    { id: 1, id_trx: '#0001', tanggal: '9 Mei 2026', wilayah: 'BEM FATETA', user: 'Ahmad Fauzi', kategori: 'Plastik', berat: '25 kg', nilai: 'Rp 50.000', status: 'Selesai', catatan: 'Botol plastik bersih' },
    { id: 2, id_trx: '#0002', tanggal: '8 Mei 2026', wilayah: 'BEM FAPET', user: 'Budi Santoso', kategori: 'Kertas', berat: '15 kg', nilai: 'Rp 37.500', status: 'Selesai', catatan: 'Kardus bekas' },
    { id: 3, id_trx: '#0003', tanggal: '7 Mei 2026', wilayah: 'BEM FEM', user: 'Siti Aminah', kategori: 'Logam', berat: '10 kg', nilai: 'Rp 75.000', status: 'Menunggu', catatan: 'Kaleng aluminium' },
    { id: 4, id_trx: '#0004', tanggal: '28 Apr 2026', wilayah: 'BEM FAHUTAN', user: 'Rizky Pratama', kategori: 'Kaca', berat: '20 kg', nilai: 'Rp 40.000', status: 'Selesai', catatan: 'Pecahan botol' },
  ]);

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

      {/* FILTER & SEARCH */}
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
          <h3 className="text-4xl font-extrabold text-[#0B4D1E]">{historyData.length}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm font-medium mb-1">Total Berat</p>
          <h3 className="text-4xl font-extrabold text-[#0B4D1E]">70 kg</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm font-medium mb-1">Total Nilai</p>
          <h3 className="text-4xl font-extrabold text-green-600">Rp 202.500</h3>
        </div>
      </div>

      {/* DAFTAR TRANSAKSI (CLICKABLE) */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
        <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">Daftar Transaksi</h3>
        
        <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {historyData.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedTrx(item)} 
              className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#F5EFE6] p-5 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-200 cursor-pointer group"
            >
              <div className="flex items-center gap-5 w-full md:w-auto mb-4 md:mb-0">
                <div className="bg-white p-4 rounded-xl text-green-600 shadow-sm group-hover:text-[#F4A300] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-extrabold text-[#0B4D1E] text-base group-hover:text-[#F4A300] transition-colors">{item.kategori} - {item.berat}</h4>
                    <span className="bg-[#EAE5DA] text-[#0B4D1E] text-[10px] px-2 py-0.5 rounded-full font-bold">{item.wilayah}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-1">{item.tanggal} • {item.user}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${item.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.status}
                </span>
                <div className="font-extrabold text-[#0B4D1E] text-lg">{item.nilai}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING MODAL DETAIL (PERSIS GAMBAR FIGMA) */}
      {selectedTrx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative animate-fade-in-up">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#E8F5E9] p-3 rounded-full text-[#125B2A]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                <h3 className="text-xl font-extrabold text-[#0B4D1E]">Detail Transaksi</h3>
              </div>
              <button onClick={() => setSelectedTrx(null)} className="text-gray-500 hover:text-gray-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* List Body Modal */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium text-sm">ID Transaksi</span>
                <span className="font-extrabold text-[#0B4D1E] text-sm">{selectedTrx.id_trx}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium text-sm">Tanggal</span>
                <span className="font-extrabold text-[#0B4D1E] text-sm">{selectedTrx.tanggal}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium text-sm">Wilayah</span>
                <span className="font-extrabold text-[#0B4D1E] text-sm">{selectedTrx.wilayah}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium text-sm">User</span>
                <span className="font-extrabold text-[#0B4D1E] text-sm">{selectedTrx.user}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium text-sm">Kategori</span>
                <span className="bg-[#F5EFE6] text-[#0B4D1E] px-3 py-1 rounded-full text-xs font-bold">{selectedTrx.kategori}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium text-sm">Berat</span>
                <span className="font-extrabold text-[#0B4D1E] text-sm">{selectedTrx.berat}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium text-sm">Nilai</span>
                <span className="font-extrabold text-green-600 text-sm">{selectedTrx.nilai}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium text-sm">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedTrx.status === 'Selesai' ? 'bg-[#E8F5E9] text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {selectedTrx.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium text-sm">Catatan</span>
                <span className="font-extrabold text-[#0B4D1E] text-sm">{selectedTrx.catatan}</span>
              </div>
            </div>

            {/* Button Tutup (Full Round) */}
            <button onClick={() => setSelectedTrx(null)} className="w-full bg-[#125B2A] text-white py-4 rounded-full font-bold mt-8 hover:bg-[#0B4D1E] transition-all">
              Tutup
            </button>
            
          </div>
        </div>
      )}

    </AdminLayout>
  );
}

export default RiwayatTransaksiPage;