import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

function KelolaWilayahPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedWilayah, setSelectedWilayah] = useState(null);

  // States Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');

  const wilayahData = [
    { id: 1, name: 'BEM FATETA', ranking: '#1', kontribusi: '385', kpi: '925', transaksi: '124', nilai: '1250', status: 'Aktif', desc: 'Fakultas Teknologi Pertanian - Leading dalam pemilahan sampah organik dan daur ulang' },
    { id: 2, name: 'BEM FAPET', ranking: '#2', kontribusi: '360', kpi: '890', transaksi: '118', nilai: '1180', status: 'Aktif', desc: 'Fakultas Peternakan' },
  ];

  // Logic Filter Berfungsi
  const filteredWilayah = wilayahData.filter(w => {
    const matchSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'Semua Status' || w.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(''), 3000); };
  
  const handleAction = (w, type) => {
    setSelectedWilayah(w);
    if (type === 'view') setIsViewOpen(true);
    if (type === 'edit') setIsEditOpen(true);
    if (type === 'delete') setIsDeleteOpen(true);
    if (type === 'status') setIsStatusOpen(true);
  };

  const confirmAction = (action) => {
    if (action === 'delete') { setIsDeleteOpen(false); showToast('Wilayah berhasil dihapus!'); }
    if (action === 'status') { setIsStatusOpen(false); showToast(`Status ${selectedWilayah.name} berhasil diubah!`); }
  };

  return (
    <AdminLayout>
      <style>{`@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* BANNER */}
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm mt-2 mb-8">
        <div className="flex items-center gap-5 text-white mb-6 md:mb-0">
          <div className="bg-[#F4A300] p-4 rounded-2xl"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
          <div><h2 className="text-3xl font-extrabold mb-1">Kelola Wilayah</h2><p className="text-green-100/80 font-medium">Monitoring dan manajemen wilayah BEM Fakultas</p></div>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="bg-[#F4A300] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#d68e00] transition-all shadow-md"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg> Tambah Wilayah</button>
      </div>

      {/* SEARCHBAR & FILTER */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Cari wilayah..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full md:w-64 bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl outline-none cursor-pointer"><option>Semua Status</option><option>Aktif</option><option>Nonaktif</option></select>
      </div>

      {/* CARDS WILAYAH GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {filteredWilayah.map((w) => (
          <div key={w.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all duration-300">
            {/* Header Card */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#EAE5DA] p-3 rounded-2xl text-[#0B4D1E]"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
                <div><h3 className="font-extrabold text-lg text-[#0B4D1E]">{w.name}</h3><p className="text-gray-400 text-xs font-medium">Ranking {w.ranking}</p></div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${w.status === 'Aktif' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFEBEE] text-[#C62828]'}`}>{w.status}</span>
            </div>
            
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6 flex-1">
              <div className="bg-[#F5EFE6] p-4 rounded-2xl"><p className="text-[10px] text-gray-500 font-medium mb-1">Total Kontribusi</p><p className="font-extrabold text-[#0B4D1E] text-lg">{w.kontribusi} kg</p></div>
              <div className="bg-[#F5EFE6] p-4 rounded-2xl"><p className="text-[10px] text-gray-500 font-medium mb-1">KPI Score</p><p className="font-extrabold text-[#F4A300] text-lg">{w.kpi}</p></div>
              <div className="bg-[#F5EFE6] p-4 rounded-2xl"><p className="text-[10px] text-gray-500 font-medium mb-1">Total Transaksi</p><p className="font-extrabold text-[#0B4D1E] text-lg">{w.transaksi}</p></div>
              <div className="bg-[#F5EFE6] p-4 rounded-2xl"><p className="text-[10px] text-gray-500 font-medium mb-1">Nilai Ekonomi</p><p className="font-extrabold text-green-600 text-lg">Rp {w.nilai}k</p></div>
            </div>

            {/* Aksi Bawah */}
            <div className="flex gap-2">
              <button onClick={() => handleAction(w, 'view')} className="p-3 text-[#0B4D1E] bg-[#EAE5DA] hover:bg-[#0B4D1E] hover:text-white rounded-xl transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg></button>
              <button onClick={() => handleAction(w, 'edit')} className="p-3 text-[#F4A300] bg-[#FDF6EA] hover:bg-[#F4A300] hover:text-white rounded-xl transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg></button>
              <button onClick={() => handleAction(w, 'delete')} className="p-3 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
              <button onClick={() => handleAction(w, 'status')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${w.status === 'Aktif' ? 'text-red-500 bg-red-50 hover:bg-red-500 hover:text-white' : 'text-green-500 bg-green-50 hover:bg-green-500 hover:text-white'}`}>
                {w.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY CARDS BAWAH */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"><p className="text-gray-400 text-sm font-medium mb-1">Total Wilayah</p><h3 className="text-3xl font-extrabold text-[#0B4D1E]">8</h3></div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"><p className="text-gray-400 text-sm font-medium mb-1">Wilayah Aktif</p><h3 className="text-3xl font-extrabold text-[#2E7D32]">7</h3></div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"><p className="text-gray-400 text-sm font-medium mb-1">Total Sampah</p><h3 className="text-3xl font-extrabold text-[#0B4D1E]">2390 kg</h3></div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"><p className="text-gray-400 text-sm font-medium mb-1">KPI Rata-rata</p><h3 className="text-3xl font-extrabold text-[#F4A300]">805</h3></div>
      </div>

      {/* MODAL VIEW, EDIT, DELETE ... [Paste code modal lama lu disini] */}

      {/* TOAST POP DOWN */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '100px', right: '40px', zIndex: 999999, animation: 'fadeInDown 0.3s ease-out' }} className="bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
          <div className="bg-[#2E7D32] text-white rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
          <span className="font-extrabold text-sm">{toastMessage}</span>
        </div>
      )}
    </AdminLayout>
  );
}

export default KelolaWilayahPage;