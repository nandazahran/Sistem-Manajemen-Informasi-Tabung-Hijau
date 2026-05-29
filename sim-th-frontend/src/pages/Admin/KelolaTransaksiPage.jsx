import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

function KelolaTransaksiPage() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  // States Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWilayah, setFilterWilayah] = useState('Semua Wilayah');
  const [filterKategori, setFilterKategori] = useState('Semua Kategori');
  const [filterBulan, setFilterBulan] = useState('Semua Bulan');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [exportFormat, setExportFormat] = useState('XLSX');
  const [exportData, setExportData] = useState({ transaksi: true, wilayah: true, kategori: true, nilai: true });

  const transactions = [
    { id: 1, tanggal: '9 Mei 2026', wilayah: 'BEM FATETA', kategori: 'Plastik', berat: '25.00', nilai: 'Rp 112.500', status: 'Selesai', petugas: 'Admin' },
    { id: 2, tanggal: '8 Mei 2026', wilayah: 'BEM FAPET', kategori: 'Kertas', berat: '15.50', nilai: 'Rp 37.500', status: 'Selesai', petugas: 'Admin' },
    { id: 3, tanggal: '7 Mei 2026', wilayah: 'BEM FEM', kategori: 'Logam', berat: '10.00', nilai: 'Rp 75.000', status: 'Selesai', petugas: 'Admin' },
    { id: 4, tanggal: '6 Mei 2026', wilayah: 'BEM FATETA', kategori: 'Plastik', berat: '30.25', nilai: 'Rp 135.000', status: 'Pending', petugas: 'Admin' },
    { id: 5, tanggal: '28 Apr 2026', wilayah: 'BEM FAHUTAN', kategori: 'Kaca', berat: '20.00', nilai: 'Rp 40.000', status: 'Selesai', petugas: 'Admin' },
  ];

  // Logic Filter Berfungsi
  const filteredTransactions = transactions.filter(tx => {
    const matchSearch = tx.wilayah.toLowerCase().includes(searchTerm.toLowerCase()) || tx.tanggal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchWilayah = filterWilayah === 'Semua Wilayah' || tx.wilayah === filterWilayah;
    const matchKategori = filterKategori === 'Semua Kategori' || tx.kategori === filterKategori;
    const matchBulan = filterBulan === 'Semua Bulan' || tx.tanggal.includes(filterBulan.split(' ')[0]);
    const matchStatus = filterStatus === 'Semua Status' || tx.status === filterStatus;
    return matchSearch && matchWilayah && matchKategori && matchBulan && matchStatus;
  });

  const handleView = (tx) => { setSelectedTx(tx); setIsDetailOpen(true); };
  const handleEdit = (tx) => { setSelectedTx(tx); setIsEditOpen(true); };
  const handleDeleteClick = (tx) => { setSelectedTx(tx); setIsDeleteOpen(true); };
  const confirmDelete = () => { setIsDeleteOpen(false); setShowToast(true); setTimeout(() => setShowToast(false), 3000); };
  const handleExport = (e) => { e.preventDefault(); alert(`Mengekspor data dalam format ${exportFormat}...`); setIsExportOpen(false); };

  return (
    <AdminLayout>
      <style>{`@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* BANNER UTAMA */}
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm mt-2 mb-8">
        <div className="flex items-center gap-5 text-white mb-6 md:mb-0">
          <div className="bg-[#F4A300] p-4 rounded-2xl"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
          <div><h2 className="text-3xl font-extrabold mb-1">Kelola Transaksi</h2><p className="text-green-100/80 font-medium">Manajemen transaksi sampah seluruh wilayah</p></div>
        </div>
        <button onClick={() => setIsExportOpen(true)} className="bg-[#F4A300] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#d68e00] transition-all shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Export Data
        </button>
      </div>

      {/* FILTER & SEARCHBAR */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
        <div className="relative mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Cari wilayah, tanggal..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-all" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select value={filterWilayah} onChange={(e) => setFilterWilayah(e.target.value)} className="w-full bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-3.5 rounded-xl outline-none border border-transparent cursor-pointer appearance-none"><option>Semua Wilayah</option><option>BEM FATETA</option><option>BEM FAPET</option><option>BEM FEM</option></select>
          <select value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)} className="w-full bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-3.5 rounded-xl outline-none border border-transparent cursor-pointer appearance-none"><option>Semua Kategori</option><option>Plastik</option><option>Kertas</option><option>Logam</option></select>
          <select value={filterBulan} onChange={(e) => setFilterBulan(e.target.value)} className="w-full bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-3.5 rounded-xl outline-none border border-transparent cursor-pointer appearance-none"><option>Semua Bulan</option><option>Mei 2026</option><option>Apr 2026</option></select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-3.5 rounded-xl outline-none border border-transparent cursor-pointer appearance-none"><option>Semua Status</option><option>Selesai</option><option>Pending</option></select>
        </div>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F5EFE6] text-[#0B4D1E]">
              <tr><th className="px-8 py-5 font-bold">Tanggal</th><th className="px-8 py-5 font-bold">Wilayah</th><th className="px-8 py-5 font-bold">Kategori</th><th className="px-8 py-5 font-bold">Berat (kg)</th><th className="px-8 py-5 font-bold">Nilai (Rp)</th><th className="px-8 py-5 font-bold">Status</th><th className="px-8 py-5 font-bold text-center">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 text-gray-500 font-medium">{tx.tanggal}</td><td className="px-8 py-5 font-extrabold text-[#0B4D1E]">{tx.wilayah}</td><td className="px-8 py-5"><span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-bold">{tx.kategori}</span></td><td className="px-8 py-5 font-bold text-[#0B4D1E]">{tx.berat}</td><td className="px-8 py-5 font-extrabold text-green-600">{tx.nilai}</td>
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
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform"><p className="text-gray-400 text-sm font-medium mb-1">Total Transaksi</p><h3 className="text-4xl font-extrabold text-[#0B4D1E]">5</h3></div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform"><p className="text-gray-400 text-sm font-medium mb-1">Total Berat</p><h3 className="text-4xl font-extrabold text-[#0B4D1E]">100.75 kg</h3></div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform"><p className="text-gray-400 text-sm font-medium mb-1">Total Nilai</p><h3 className="text-4xl font-extrabold text-green-600">Rp 400.000</h3></div>
      </div>

      {/* SEMUA MODAL SAMA (DETAIL, EDIT, EXPORT, HAPUS) ... [Cukup paste code modal lama lu disini] */}
      {/* KARENA LIMIT OUTPUT, MODAL EXPORT & EDIT TIDAK ADA PERUBAHAN. PASTE MODAL YANG LAMA DISINI */}

      {/* TOAST POP DOWN */}
      {showToast && (
        <div style={{ position: 'fixed', top: '100px', right: '40px', zIndex: 999999, animation: 'fadeInDown 0.3s ease-out' }} className="bg-[#FFF5F5] text-red-600 border border-red-200 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
          <div className="bg-red-500 text-white rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
          <span className="font-extrabold text-lg">Transaksi dihapus!</span>
        </div>
      )}
    </AdminLayout>
  );
}

export default KelolaTransaksiPage;