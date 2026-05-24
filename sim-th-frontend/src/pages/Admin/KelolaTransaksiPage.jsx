import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

function KelolaTransaksiPage() {
  // --- STATE UNTUK MODAL & NOTIFIKASI ---
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false); // Modal Export
  const [showToast, setShowToast] = useState(false);
  
  const [selectedTx, setSelectedTx] = useState(null);

  // State Modal Export
  const [exportFormat, setExportFormat] = useState('XLSX');
  const [exportData, setExportData] = useState({
    transaksi: true, wilayah: true, kategori: true, nilai: true
  });

  const transactions = [
    { id: 1, tanggal: '9 Mei 2026', wilayah: 'BEM FATETA', kategori: 'Plastik', berat: '25.00', nilai: 'Rp 112.500', status: 'Selesai', petugas: 'Admin' },
    { id: 2, tanggal: '8 Mei 2026', wilayah: 'BEM FAPET', kategori: 'Kertas', berat: '15.50', nilai: 'Rp 37.500', status: 'Selesai', petugas: 'Admin' },
    { id: 3, tanggal: '7 Mei 2026', wilayah: 'BEM FEM', kategori: 'Logam', berat: '10.00', nilai: 'Rp 75.000', status: 'Selesai', petugas: 'Admin' },
    { id: 4, tanggal: '6 Mei 2026', wilayah: 'BEM FATETA', kategori: 'Plastik', berat: '30.25', nilai: 'Rp 135.000', status: 'Pending', petugas: 'Admin' },
    { id: 5, tanggal: '28 Apr 2026', wilayah: 'BEM FAHUTAN', kategori: 'Kaca', berat: '20.00', nilai: 'Rp 40.000', status: 'Selesai', petugas: 'Admin' },
  ];

  const handleView = (tx) => { setSelectedTx(tx); setIsDetailOpen(true); };
  const handleEdit = (tx) => { setSelectedTx(tx); setIsEditOpen(true); };
  const handleDeleteClick = (tx) => { setSelectedTx(tx); setIsDeleteOpen(true); };

  const confirmDelete = () => {
    setIsDeleteOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); 
  };

  const handleExport = (e) => {
    e.preventDefault();
    alert(`Mengekspor data dalam format ${exportFormat}...`);
    setIsExportOpen(false);
  };

  return (
    <AdminLayout>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* BANNER UTAMA */}
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm mt-2 mb-8">
        <div className="flex items-center gap-5 text-white mb-6 md:mb-0">
          <div className="bg-[#F4A300] p-4 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mb-1">Kelola Transaksi</h2>
            <p className="text-green-100/80 font-medium">Manajemen transaksi sampah seluruh wilayah</p>
          </div>
        </div>
        <button onClick={() => setIsExportOpen(true)} className="bg-[#F4A300] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#d68e00] transition-all shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export Data
        </button>
      </div>

      {/* FILTER & SEARCHBAR DENGAN IKON PANAH (CHEVRON) */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
        <div className="relative mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Cari wilayah, kategori, tanggal, status..." className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-all" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ['Semua Wilayah', 'BEM FATETA', 'BEM FAPET'],
            ['Semua Kategori', 'Plastik', 'Kertas'],
            ['Semua Bulan', 'Mei 2026', 'April 2026'],
            ['Semua Status', 'Selesai', 'Pending']
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

      {/* TABEL DATA */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F5EFE6] text-[#0B4D1E]">
              <tr>
                <th className="px-8 py-5 font-bold">Tanggal</th>
                <th className="px-8 py-5 font-bold">Wilayah</th>
                <th className="px-8 py-5 font-bold">Kategori</th>
                <th className="px-8 py-5 font-bold">Berat (kg)</th>
                <th className="px-8 py-5 font-bold">Nilai (Rp)</th>
                <th className="px-8 py-5 font-bold">Status</th>
                <th className="px-8 py-5 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 text-gray-500 font-medium">{tx.tanggal}</td>
                  <td className="px-8 py-5 font-extrabold text-[#0B4D1E]">{tx.wilayah}</td>
                  <td className="px-8 py-5"><span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-bold">{tx.kategori}</span></td>
                  <td className="px-8 py-5 font-bold text-[#0B4D1E]">{tx.berat}</td>
                  <td className="px-8 py-5 font-extrabold text-green-600">{tx.nilai}</td>
                  <td className="px-8 py-5"><span className={`px-4 py-1.5 rounded-full text-xs font-bold ${tx.status === 'Selesai' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFF3E0] text-[#E65100]'}`}>{tx.status}</span></td>
                  <td className="px-8 py-5 flex items-center justify-center gap-3">
                    <button onClick={() => handleView(tx)} className="p-2 text-gray-400 hover:text-[#0B4D1E] hover:bg-[#EAE5DA] rounded-lg transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg></button>
                    <button onClick={() => handleEdit(tx)} className="p-2 text-gray-400 hover:text-[#F4A300] hover:bg-[#FDF6EA] rounded-lg transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg></button>
                    <button onClick={() => handleDeleteClick(tx)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUMMARY CARDS BAWAH */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
          <p className="text-gray-400 text-sm font-medium mb-1">Total Transaksi</p>
          <h3 className="text-4xl font-extrabold text-[#0B4D1E]">5</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
          <p className="text-gray-400 text-sm font-medium mb-1">Total Berat</p>
          <h3 className="text-4xl font-extrabold text-[#0B4D1E]">100.75 kg</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
          <p className="text-gray-400 text-sm font-medium mb-1">Total Nilai</p>
          <h3 className="text-4xl font-extrabold text-green-600">Rp 400.000</h3>
        </div>
      </div>

      {/* MODAL 1: EXPORT DATA TRANSAKSI (SESUAI FOTO 2) */}
      {isExportOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative animate-fade-in-up border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-[#FDF6EA] p-3 rounded-2xl text-[#F4A300]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </div>
                <h3 className="text-2xl font-extrabold text-[#0B4D1E]">Export Data Transaksi</h3>
              </div>
              <button onClick={() => setIsExportOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleExport} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Pilih Periode</label>
                <div className="relative">
                  <select className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-bold text-[#0B4D1E] appearance-none outline-none focus:ring-2 focus:ring-[#F4A300] cursor-pointer">
                    <option>Bulan Ini (Mei 2026)</option>
                    <option>Bulan Lalu (April 2026)</option>
                    <option>Semua Periode</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0B4D1E] pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Pilih Format</label>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setExportFormat('XLSX')} className={`flex-1 py-4 flex items-center justify-center gap-2 rounded-2xl font-bold transition-all duration-300 ${exportFormat === 'XLSX' ? 'bg-[#E8F5E9] text-[#2E7D32] border-2 border-[#2E7D32]' : 'bg-white border-2 border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    XLSX
                  </button>
                  <button type="button" onClick={() => setExportFormat('PDF')} className={`flex-1 py-4 flex items-center justify-center gap-2 rounded-2xl font-bold transition-all duration-300 ${exportFormat === 'PDF' ? 'bg-[#FFEBEE] text-[#C62828] border-2 border-[#C62828]' : 'bg-white border-2 border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    PDF
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-3">Pilih Data yang Akan Diexport</label>
                <div className="bg-[#F5EFE6] p-5 rounded-2xl space-y-4">
                  {Object.keys(exportData).map((key) => (
                    <label key={key} className="flex items-center gap-4 cursor-pointer group">
                      <input type="checkbox" checked={exportData[key]} onChange={() => setExportData({...exportData, [key]: !exportData[key]})} className="w-5 h-5 text-[#0A8895] bg-white border-gray-300 rounded focus:ring-[#0A8895] cursor-pointer accent-[#0A8895]" />
                      <span className="text-sm font-bold text-[#0B4D1E] capitalize group-hover:text-[#F4A300] transition-colors">Data {key}</span>
                    </label>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 font-medium mt-3 text-center">Data yang di-export akan menyesuaikan dengan filter yang aktif saat ini.</p>
              </div>

              <div className="flex gap-4 mt-8 pt-2">
                <button type="button" onClick={() => setIsExportOpen(false)} className="flex-1 bg-white border border-gray-200 text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all">Batal</button>
                <button type="submit" className="flex-1 bg-[#0B4D1E] text-white py-4 flex items-center justify-center gap-2 rounded-2xl font-bold hover:bg-[#083a16] shadow-md hover:-translate-y-1 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Export Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DETAIL TRANSAKSI */}
      {isDetailOpen && selectedTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative animate-fade-in-up border border-gray-100">
             <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-[#EAE5DA] p-3 rounded-2xl text-[#0B4D1E]"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></div>
                <h3 className="text-2xl font-extrabold text-[#0B4D1E]">Detail Transaksi</h3>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="space-y-6 divide-y divide-gray-100">
              <div className="flex justify-between pt-4"><span className="text-gray-400 font-medium">Tanggal</span><span className="font-extrabold text-[#0B4D1E]">{selectedTx.tanggal}</span></div>
              <div className="flex justify-between pt-4"><span className="text-gray-400 font-medium">Wilayah</span><span className="font-extrabold text-[#0B4D1E]">{selectedTx.wilayah}</span></div>
              <div className="flex justify-between pt-4 items-center"><span className="text-gray-400 font-medium">Kategori</span><span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-bold">{selectedTx.kategori}</span></div>
              <div className="flex justify-between pt-4"><span className="text-gray-400 font-medium">Berat</span><span className="font-extrabold text-[#0B4D1E]">{selectedTx.berat} kg</span></div>
              <div className="flex justify-between pt-4"><span className="text-gray-400 font-medium">Nilai Ekonomi</span><span className="font-extrabold text-green-600">{selectedTx.nilai}</span></div>
              <div className="flex justify-between pt-4"><span className="text-gray-400 font-medium">Petugas</span><span className="font-extrabold text-[#0B4D1E]">{selectedTx.petugas}</span></div>
              <div className="flex justify-between pt-4 items-center"><span className="text-gray-400 font-medium">Status</span><span className={`px-4 py-1 rounded-full text-xs font-bold ${selectedTx.status === 'Selesai' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFF3E0] text-[#E65100]'}`}>{selectedTx.status}</span></div>
            </div>
            <button onClick={() => setIsDetailOpen(false)} className="w-full bg-[#0B4D1E] text-white py-4 rounded-2xl font-bold mt-10 hover:bg-[#083a16] transition-all">Tutup</button>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT TRANSAKSI (INPUT BERAT 2 ANGKA DESIMAL) */}
      {isEditOpen && selectedTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative animate-fade-in-up border border-gray-100 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-[#FDF6EA] p-3 rounded-2xl text-[#F4A300]"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></div>
                <h3 className="text-2xl font-extrabold text-[#0B4D1E]">Edit Transaksi</h3>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsEditOpen(false); }}>
              <div><label className="block text-sm font-bold text-[#0B4D1E] mb-2">Tanggal</label><input type="date" className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]" defaultValue="2026-05-09" /></div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Wilayah</label>
                <div className="relative">
                  <select className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer">
                    <option>BEM FATETA</option><option>BEM FAPET</option><option>BEM FEM</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Kategori</label>
                <div className="relative">
                  <select className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer">
                    <option>Plastik</option><option>Kertas</option><option>Logam</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* INPUT BERAT DENGAN STEP 0.01 BUAT DESIMAL */}
                <div><label className="block text-sm font-bold text-[#0B4D1E] mb-2">Berat (kg)</label><input type="number" step="0.01" className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]" defaultValue={selectedTx.berat} /></div>
                <div><label className="block text-sm font-bold text-[#0B4D1E] mb-2">Nilai (Rp)</label><input type="number" className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]" defaultValue="112500" /></div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Status</label>
                <div className="relative">
                  <select className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer">
                    <option>Selesai</option><option>Pending</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
              </div>
              <div><label className="block text-sm font-bold text-[#0B4D1E] mb-2">Catatan (Opsional)</label><textarea className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] h-24 resize-none" placeholder="Masukkan catatan tambahan..."></textarea></div>
              
              <div className="flex gap-4 mt-8 pt-4">
                <button type="button" onClick={() => setIsEditOpen(false)} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
                <button type="submit" className="flex-1 bg-[#0B4D1E] text-white py-4 rounded-2xl font-bold hover:bg-[#083a16] shadow-md hover:-translate-y-1 hover:shadow-lg transition-all">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: KONFIRMASI HAPUS */}
      {isDeleteOpen && selectedTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative animate-fade-in-up border border-gray-100 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-2xl font-extrabold text-[#0B4D1E] mb-2">Hapus Transaksi?</h3>
            <p className="text-gray-500 font-medium mb-8 text-sm">Data transaksi dari <b>{selectedTx.wilayah}</b> akan dihapus permanen dan tidak dapat dikembalikan.</p>
            <div className="flex gap-4">
              <button onClick={() => setIsDeleteOpen(false)} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-3.5 rounded-xl font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
              <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white py-3.5 rounded-xl font-bold hover:bg-red-600 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFIKASI (FIXED DI BAWAH NAVBAR - TETAP MUNCUL WALAUPUN DI-SCROLL) */}
      {showToast && (
        <div className="fixed top-[110px] right-10 z-[9999] bg-[#FFF5F5] text-red-600 border border-red-200 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in">
          <div className="bg-red-500 text-white rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
          <span className="font-extrabold text-lg">Transaksi dihapus!</span>
        </div>
      )}

    </AdminLayout>
  );
}

export default KelolaTransaksiPage;