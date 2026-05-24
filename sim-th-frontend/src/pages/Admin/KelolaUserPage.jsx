import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

function KelolaUserPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Dummy Data
  const users = [
    { id: 1, name: 'Ahmad Fauzi', email: 'ahmad.fauzi@bem.ipb.ac.id', role: 'BEM Wilayah', wilayah: 'FATETA', status: 'Aktif' },
    { id: 2, name: 'Siti Nurhaliza', email: 'siti.nur@bem.ipb.ac.id', role: 'BEM Wilayah', wilayah: 'FAPET', status: 'Aktif' },
    { id: 3, name: 'Budi Santoso', email: 'budi.santoso@bem.ipb.ac.id', role: 'BEM Wilayah', wilayah: 'FEM', status: 'Aktif' },
    { id: 4, name: 'Dewi Lestari', email: 'dewi.lestari@bem.ipb.ac.id', role: 'DUI', wilayah: 'FAHUTAN', status: 'Aktif' },
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleResetPassword = (user) => { showToast(`Password ${user.name} berhasil di-reset!`); };
  const handleToggleStatus = (user) => { showToast(`Akun ${user.name} berhasil di${user.status === 'Aktif' ? 'nonaktifkan' : 'aktifkan'}!`); };

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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mb-1">Kelola User</h2>
            <p className="text-green-100/80 font-medium">Manajemen akun pengguna sistem SIM-TH</p>
          </div>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="bg-[#F4A300] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#d68e00] transition-all shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Tambah User
        </button>
      </div>

      {/* FILTER & SEARCHBAR */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Cari nama atau email user..." className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-all" />
        </div>
        <div className="flex gap-4">
          <div className="relative w-48">
            <select className="w-full bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-[#F4A300] cursor-pointer appearance-none">
              <option>Semua Role</option><option>Admin</option><option>BEM Wilayah</option><option>DUI</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0B4D1E] pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </div>
          <div className="relative w-48">
            <select className="w-full bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-[#F4A300] cursor-pointer appearance-none">
              <option>Semua Status</option><option>Aktif</option><option>Nonaktif</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0B4D1E] pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </div>
        </div>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F5EFE6] text-[#0B4D1E]">
              <tr>
                <th className="px-8 py-5 font-bold">User</th>
                <th className="px-8 py-5 font-bold">Role & Wilayah</th>
                <th className="px-8 py-5 font-bold">Status</th>
                <th className="px-8 py-5 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-extrabold text-[#0B4D1E]">{u.name}</p>
                    <p className="text-gray-400 text-xs font-medium">{u.email}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="bg-green-100 text-green-700 text-[10px] px-3 py-1 rounded-full font-bold">{u.role}</span>
                    <p className="text-gray-400 text-xs font-medium mt-1">{u.wilayah}</p>
                  </td>
                  <td className="px-8 py-5"><span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#2E7D32]">{u.status}</span></td>
                  <td className="px-8 py-5 flex items-center justify-center gap-3">
                    <button onClick={() => handleResetPassword(u)} title="Reset Password" className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg></button>
                    <button onClick={() => { setSelectedUser(u); setIsEditOpen(true); }} className="p-2 text-gray-400 hover:text-[#F4A300] hover:bg-[#FDF6EA] rounded-lg transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg></button>
                    <button onClick={() => handleToggleStatus(u)} title="Nonaktifkan" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12l-6 6m0-6l6 6" /></svg></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUMMARY CARDS BAWAH */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
          <p className="text-gray-400 text-sm font-medium mb-1">Total User</p><h3 className="text-3xl font-extrabold text-[#0B4D1E]">6</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
          <p className="text-gray-400 text-sm font-medium mb-1">Admin</p><h3 className="text-3xl font-extrabold text-[#F4A300]">1</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
          <p className="text-gray-400 text-sm font-medium mb-1">BEM Wilayah</p><h3 className="text-3xl font-extrabold text-[#0B4D1E]">4</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
          <p className="text-gray-400 text-sm font-medium mb-1">User Aktif</p><h3 className="text-3xl font-extrabold text-[#2E7D32]">5</h3>
        </div>
      </div>

      {/* MODAL TAMBAH USER / EDIT USER */}
      {(isAddOpen || isEditOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative animate-fade-in-up border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-[#FDF6EA] p-3 rounded-2xl text-[#F4A300]"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></div>
                <h3 className="text-2xl font-extrabold text-[#0B4D1E]">{isEditOpen ? 'Edit User' : 'Tambah User Baru'}</h3>
              </div>
              <button onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="text-gray-400 hover:text-gray-600 transition-colors p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsAddOpen(false); setIsEditOpen(false); }}>
              <div><label className="block text-sm font-bold text-[#0B4D1E] mb-2">Nama Lengkap</label><input type="text" placeholder="Masukkan nama lengkap" className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]" defaultValue={isEditOpen ? selectedUser?.name : ''} /></div>
              <div><label className="block text-sm font-bold text-[#0B4D1E] mb-2">Email</label><input type="email" placeholder="user@bem.ipb.ac.id" className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]" defaultValue={isEditOpen ? selectedUser?.email : ''} /></div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Role</label>
                <div className="relative">
                  <select className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none">
                    <option>Admin</option><option>BEM Wilayah</option><option>DUI</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Wilayah</label>
                <div className="relative">
                  <select className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none">
                    <option>FATETA</option><option>FAPET</option><option>FEM</option><option>FAHUTAN</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
              </div>
              {!isEditOpen && <div><label className="block text-sm font-bold text-[#0B4D1E] mb-2">Password</label><input type="password" placeholder="Minimal 8 karakter" className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]" /></div>}
              <div className="flex gap-4 mt-8 pt-4">
                <button type="button" onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
                <button type="submit" className="flex-1 bg-[#0B4D1E] text-white py-4 rounded-2xl font-bold hover:bg-[#083a16] shadow-md transition-all flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  {isEditOpen ? 'Simpan' : 'Tambah User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFIKASI SLIDE IN (POSISI PAS DI BAWAH NAVBAR) */}
      {toastMessage && (
        <div className="fixed top-[110px] right-10 z-[9999] bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in">
          <div className="bg-[#2E7D32] text-white rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
          <span className="font-extrabold text-sm">{toastMessage}</span>
        </div>
      )}
    </AdminLayout>
  );
}

export default KelolaUserPage;