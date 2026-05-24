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

  const wilayahData = [
    { id: 1, name: 'BEM FATETA', ranking: '#1', kontribusi: '385', kpi: '925', transaksi: '124', nilai: '1250', status: 'Aktif', desc: 'Fakultas Teknologi Pertanian - Leading dalam pemilahan sampah organik dan daur ulang' },
    { id: 2, name: 'BEM FAPET', ranking: '#2', kontribusi: '360', kpi: '890', transaksi: '118', nilai: '1180', status: 'Aktif', desc: 'Fakultas Peternakan' },
  ];

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
      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* BANNER */}
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm mt-2 mb-8">
        <div className="flex items-center gap-5 text-white mb-6 md:mb-0">
          <div className="bg-[#F4A300] p-4 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mb-1">Kelola Wilayah</h2>
            <p className="text-green-100/80 font-medium">Monitoring dan manajemen wilayah BEM Fakultas</p>
          </div>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="bg-[#F4A300] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#d68e00] transition-all shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Tambah Wilayah
        </button>
      </div>

      {/* SEARCHBAR & FILTER */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Cari wilayah..." className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-all" />
        </div>
        <div className="relative w-full md:w-64">
          <select className="w-full bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-[#F4A300] cursor-pointer appearance-none">
            <option>Semua Status</option><option>Aktif</option><option>Nonaktif</option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0B4D1E] pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </div>
      </div>

      {/* CARDS WILAYAH GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {wilayahData.map((w) => (
          <div key={w.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all duration-300">
            {/* Header Card */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#EAE5DA] p-3 rounded-2xl text-[#0B4D1E]"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
                <div>
                  <h3 className="font-extrabold text-lg text-[#0B4D1E]">{w.name}</h3>
                  <p className="text-gray-400 text-xs font-medium">Ranking {w.ranking}</p>
                </div>
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

      {/* MODAL VIEW (DETAIL) */}
      {isViewOpen && selectedWilayah && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative animate-fade-in-up border border-gray-100">
             <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-[#EAE5DA] p-3 rounded-2xl text-[#0B4D1E]"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
                <h3 className="text-2xl font-extrabold text-[#0B4D1E]">Detail {selectedWilayah.name}</h3>
              </div>
              <button onClick={() => setIsViewOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="space-y-4 divide-y divide-gray-100">
              <div className="flex justify-between pt-4"><span className="text-gray-400 font-medium text-sm">Nama Wilayah</span><span className="font-extrabold text-[#0B4D1E] text-sm">{selectedWilayah.name}</span></div>
              <div className="pt-4"><span className="block text-gray-400 font-medium text-sm mb-1">Deskripsi</span><span className="font-medium text-[#0B4D1E] text-sm leading-relaxed">{selectedWilayah.desc}</span></div>
              <div className="flex justify-between pt-4"><span className="text-gray-400 font-medium text-sm">Ranking</span><span className="font-extrabold text-[#F4A300] text-sm">{selectedWilayah.ranking}</span></div>
              <div className="flex justify-between pt-4"><span className="text-gray-400 font-medium text-sm">Total Kontribusi</span><span className="font-extrabold text-[#0B4D1E] text-sm">{selectedWilayah.kontribusi} kg</span></div>
              <div className="flex justify-between pt-4"><span className="text-gray-400 font-medium text-sm">KPI Score</span><span className="font-extrabold text-[#F4A300] text-sm">{selectedWilayah.kpi}</span></div>
              <div className="flex justify-between pt-4"><span className="text-gray-400 font-medium text-sm">Total Transaksi</span><span className="font-extrabold text-[#0B4D1E] text-sm">{selectedWilayah.transaksi}</span></div>
              <div className="flex justify-between pt-4"><span className="text-gray-400 font-medium text-sm">Nilai Ekonomi</span><span className="font-extrabold text-green-600 text-sm">Rp {selectedWilayah.nilai}.000</span></div>
              <div className="flex justify-between pt-4 items-center"><span className="text-gray-400 font-medium text-sm">Status</span><span className={`px-4 py-1 rounded-full text-[10px] font-bold ${selectedWilayah.status === 'Aktif' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFEBEE] text-[#C62828]'}`}>{selectedWilayah.status}</span></div>
            </div>
            <button onClick={() => setIsViewOpen(false)} className="w-full bg-[#0B4D1E] text-white py-4 rounded-2xl font-bold mt-8 hover:bg-[#083a16] transition-all shadow-md hover:-translate-y-1">Tutup</button>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH/EDIT */}
      {(isAddOpen || isEditOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative animate-fade-in-up border border-gray-100">
             <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-[#FDF6EA] p-3 rounded-2xl text-[#F4A300]"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></div>
                <h3 className="text-2xl font-extrabold text-[#0B4D1E]">{isEditOpen ? 'Edit Wilayah' : 'Tambah Wilayah Baru'}</h3>
              </div>
              <button onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="text-gray-400 hover:text-gray-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsAddOpen(false); setIsEditOpen(false); }}>
              <div><label className="block text-sm font-bold text-[#0B4D1E] mb-2">Nama Wilayah</label><input type="text" placeholder="Contoh: FIKOM" className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]" defaultValue={isEditOpen ? selectedWilayah?.name : ''} /></div>
              <div><label className="block text-sm font-bold text-[#0B4D1E] mb-2">Email Wilayah</label><input type="email" placeholder="Contoh: bem.fikom@ipb.ac.id" className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]" /></div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Status</label>
                <div className="relative">
                  <select className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none">
                    <option>Aktif</option><option>Nonaktif</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
              </div>
              <div className="flex gap-4 mt-8 pt-4">
                <button type="button" onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
                <button type="submit" className="flex-1 bg-[#0B4D1E] text-white py-4 rounded-2xl font-bold hover:bg-[#083a16] shadow-md transition-all flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  {isEditOpen ? 'Simpan' : 'Tambah Wilayah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS / STATUS */}
      {(isDeleteOpen || isStatusOpen) && selectedWilayah && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative animate-fade-in-up border border-gray-100 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isDeleteOpen ? 'bg-red-100' : 'bg-yellow-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 ${isDeleteOpen ? 'text-red-500' : 'text-yellow-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isDeleteOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />}
              </svg>
            </div>
            <h3 className="text-2xl font-extrabold text-[#0B4D1E] mb-2">{isDeleteOpen ? 'Hapus Wilayah?' : 'Ubah Status?'}</h3>
            <p className="text-gray-500 font-medium mb-8 text-sm">
              {isDeleteOpen ? `Data wilayah ${selectedWilayah.name} akan dihapus permanen.` : `Apakah Anda yakin ingin me${selectedWilayah.status === 'Aktif' ? 'nonaktifkan' : 'ngaktifkan'} ${selectedWilayah.name}?`}
            </p>
            <div className="flex gap-4">
              <button onClick={() => { setIsDeleteOpen(false); setIsStatusOpen(false); }} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-3.5 rounded-xl font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
              <button onClick={() => confirmAction(isDeleteOpen ? 'delete' : 'status')} className={`flex-1 text-white py-3.5 rounded-xl font-bold shadow-md hover:-translate-y-1 transition-all ${isDeleteOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-[#F4A300] hover:bg-[#d68e00]'}`}>
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFIKASI */}
      {toastMessage && (
        <div className="fixed top-[110px] right-10 z-[9999] bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in">
          <div className="bg-[#2E7D32] text-white rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
          <span className="font-extrabold text-sm">{toastMessage}</span>
        </div>
      )}

    </AdminLayout>
  );
}

export default KelolaWilayahPage;