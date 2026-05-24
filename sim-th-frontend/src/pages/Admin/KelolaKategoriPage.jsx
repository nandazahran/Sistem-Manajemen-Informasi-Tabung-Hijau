import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

function KelolaKategoriPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);

  const categories = [
    { id: 1, name: 'Plastik', jenis: 'Daur Ulang', harga: '4.500', setoran: '850 kg', update: '8 Mei 2026' },
    { id: 2, name: 'Kertas', jenis: 'Daur Ulang', harga: '2.500', setoran: '620 kg', update: '7 Mei 2026' },
    { id: 3, name: 'Logam', jenis: 'Daur Ulang', harga: '7.500', setoran: '280 kg', update: '6 Mei 2026' },
  ];

  const historyData = [
    { id: 1, name: 'Plastik', old: '4.000', new: '4.500', date: '8/5/2026' },
    { id: 2, name: 'Kertas', old: '2.000', new: '2.500', date: '7/5/2026' },
    { id: 3, name: 'Logam', old: '7.000', new: '7.500', date: '6/5/2026' },
  ];

  const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(''), 3000); };

  const confirmDelete = () => { setIsDeleteOpen(false); showToast('Kategori berhasil dihapus!'); };

  return (
    <AdminLayout>
      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* BANNER UTAMA */}
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm mt-2 mb-8">
        <div className="flex items-center gap-5 text-white mb-6 md:mb-0">
          <div className="bg-[#F4A300] p-4 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mb-1">Kelola Kategori Sampah</h2>
            <p className="text-green-100/80 font-medium">Manajemen kategori dan harga sampah</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsHistoryOpen(true)} className="bg-white/10 text-white border border-white/20 px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/20 transition-all shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Riwayat Harga
          </button>
          <button onClick={() => setIsAddOpen(true)} className="bg-[#F4A300] text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#d68e00] transition-all shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg> Tambah Kategori
          </button>
        </div>
      </div>

      {/* SEARCHBAR & TABEL */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
        <div className="relative mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Cari kategori sampah..." className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F5EFE6] text-[#0B4D1E]">
              <tr>
                <th className="px-6 py-5 font-bold rounded-l-xl">Kategori</th>
                <th className="px-6 py-5 font-bold">Jenis</th>
                <th className="px-6 py-5 font-bold">Harga / kg</th>
                <th className="px-6 py-5 font-bold">Total Setoran</th>
                <th className="px-6 py-5 font-bold">Update Terakhir</th>
                <th className="px-6 py-5 font-bold text-center rounded-r-xl">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 flex items-center gap-3">
                    <div className="bg-[#EAE5DA] p-2 rounded-lg text-[#0B4D1E]"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div>
                    <span className="font-extrabold text-[#0B4D1E]">{c.name}</span>
                  </td>
                  <td className="px-6 py-5"><span className="bg-green-100 text-green-700 text-[10px] px-3 py-1 rounded-full font-bold">{c.jenis}</span></td>
                  <td className="px-6 py-5 font-extrabold text-green-600">Rp {c.harga}</td>
                  <td className="px-6 py-5 font-bold text-[#0B4D1E]">{c.setoran}</td>
                  <td className="px-6 py-5 text-gray-400 text-sm font-medium">{c.update}</td>
                  <td className="px-6 py-5 flex justify-center gap-3">
                    <button onClick={() => { setSelectedCat(c); setIsEditOpen(true); }} className="p-2 text-gray-400 hover:text-[#F4A300] hover:bg-[#FDF6EA] rounded-lg transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg></button>
                    <button onClick={() => { setSelectedCat(c); setIsDeleteOpen(true); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"><p className="text-gray-400 text-sm font-medium mb-1">Total Kategori</p><h3 className="text-3xl font-extrabold text-[#0B4D1E]">3</h3></div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"><p className="text-gray-400 text-sm font-medium mb-1">Rata-rata Harga</p><h3 className="text-3xl font-extrabold text-green-600">Rp 4.833</h3></div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"><p className="text-gray-400 text-sm font-medium mb-1">Total Setoran</p><h3 className="text-3xl font-extrabold text-[#0B4D1E]">1750 kg</h3></div>
      </div>

      {/* MODAL RIWAYAT HARGA */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative animate-fade-in-up border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-extrabold text-[#0B4D1E]">Riwayat Perubahan Harga</h3>
              <button onClick={() => setIsHistoryOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="space-y-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
              {historyData.map((h) => (
                <div key={h.id} className="bg-[#F5EFE6] p-5 rounded-2xl flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-[#0B4D1E]">{h.name}</h4>
                    <p className="text-sm font-medium text-gray-500 mt-1">Rp {h.old} <span className="mx-1">→</span> <span className="font-extrabold text-green-600">Rp {h.new}</span></p>
                    <p className="text-[10px] text-gray-400 mt-1">Diubah oleh: Admin SIM-TH</p>
                  </div>
                  <span className="text-xs text-gray-400 font-bold">{h.date}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setIsHistoryOpen(false)} className="w-full bg-[#0B4D1E] text-white py-4 flex items-center justify-center gap-2 rounded-2xl font-bold mt-6 hover:bg-[#083a16] transition-all">Lihat Semua Riwayat <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></button>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH/EDIT KATEGORI */}
      {(isAddOpen || isEditOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative animate-fade-in-up border border-gray-100">
             <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-extrabold text-[#0B4D1E]">{isEditOpen ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h3>
              <button onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="text-gray-400 hover:text-gray-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsAddOpen(false); setIsEditOpen(false); }}>
              <div><label className="block text-sm font-bold text-[#0B4D1E] mb-2">Nama Kategori</label><input type="text" placeholder="Contoh: Botol Plastik" className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]" defaultValue={isEditOpen ? selectedCat?.name : ''} /></div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Jenis</label>
                <div className="relative">
                  <select className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none">
                    <option>Daur Ulang</option><option>Organik</option><option>Non-organik</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
              </div>
              <div><label className="block text-sm font-bold text-[#0B4D1E] mb-2">Harga per kg</label><input type="number" placeholder="Contoh: 4500" className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#F4A300] border border-transparent focus:border-[#F4A300]" defaultValue={isEditOpen ? selectedCat?.harga.replace('.','') : ''} /></div>
              <div className="flex gap-4 mt-8 pt-4">
                <button type="button" onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
                <button type="submit" className="flex-1 bg-[#0B4D1E] text-white py-4 rounded-2xl font-bold hover:bg-[#083a16] shadow-md transition-all flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  {isEditOpen ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {isDeleteOpen && selectedCat && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"><svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></div>
            <h3 className="text-2xl font-extrabold text-[#0B4D1E] mb-2">Hapus Kategori?</h3>
            <p className="text-gray-500 font-medium mb-8 text-sm">Kategori {selectedCat.name} akan dihapus permanen.</p>
            <div className="flex gap-4">
              <button onClick={() => setIsDeleteOpen(false)} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-3.5 rounded-xl font-bold">Batal</button>
              <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white py-3.5 rounded-xl font-bold hover:bg-red-600 shadow-md">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST SLIDE IN */}
      {toastMessage && (
        <div className="fixed top-[110px] right-10 z-[9999] bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in">
          <div className="bg-[#2E7D32] text-white rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
          <span className="font-extrabold text-sm">{toastMessage}</span>
        </div>
      )}
    </AdminLayout>
  );
}

export default KelolaKategoriPage;