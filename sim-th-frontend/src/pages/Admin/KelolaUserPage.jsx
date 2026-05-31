import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

function KelolaUserPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // States Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Semua Role');
  const [filterStatus, setFilterStatus] = useState('Semua Status');

  const users = [
    { id: 1, name: 'Ahmad Fauzi', email: 'ahmad.fauzi@bem.ipb.ac.id', role: 'BEM Wilayah', wilayah: 'FATETA', status: 'Aktif' },
    { id: 2, name: 'Siti Nurhaliza', email: 'siti.nur@bem.ipb.ac.id', role: 'BEM Wilayah', wilayah: 'FAPET', status: 'Aktif' },
    { id: 3, name: 'Budi Santoso', email: 'budi.santoso@bem.ipb.ac.id', role: 'BEM Wilayah', wilayah: 'FEM', status: 'Aktif' },
    { id: 4, name: 'Dewi Lestari', email: 'dewi.lestari@bem.ipb.ac.id', role: 'DUI', wilayah: 'FAHUTAN', status: 'Aktif' },
  ];

  // Logic Filter Berfungsi
  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'Semua Role' || u.role === filterRole;
    const matchStatus = filterStatus === 'Semua Status' || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(''), 3000); };
  const handleResetPassword = (user) => { showToast(`Password ${user.name} berhasil di-reset!`); };
  const handleToggleStatus = (user) => { showToast(`Akun ${user.name} berhasil di${user.status === 'Aktif' ? 'nonaktifkan' : 'aktifkan'}!`); };

  return (
    <AdminLayout>
      <style>{`@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      
      {/* BANNER UTAMA */}
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm mt-2 mb-8">
        <div className="flex items-center gap-5 text-white mb-6 md:mb-0">
          <div className="bg-[#F4A300] p-4 rounded-2xl"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>
          <div><h2 className="text-3xl font-extrabold mb-1">Kelola User</h2><p className="text-green-100/80 font-medium">Manajemen akun pengguna sistem SIM-TH</p></div>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="bg-[#F4A300] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#d68e00] transition-all shadow-md"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg> Tambah User</button>
      </div>

      {/* FILTER & SEARCHBAR */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Cari nama atau email user..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]" />
        </div>
        <div className="flex gap-4">
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-48 bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl outline-none cursor-pointer"><option>Semua Role</option><option>Admin</option><option>BEM Wilayah</option><option>DUI</option></select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-48 bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl outline-none cursor-pointer"><option>Semua Status</option><option>Aktif</option><option>Nonaktif</option></select>
        </div>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F5EFE6] text-[#0B4D1E]">
              <tr><th className="px-8 py-5 font-bold">User</th><th className="px-8 py-5 font-bold">Role & Wilayah</th><th className="px-8 py-5 font-bold">Status</th><th className="px-8 py-5 font-bold text-center">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5"><p className="font-extrabold text-[#0B4D1E]">{u.name}</p><p className="text-gray-400 text-xs font-medium">{u.email}</p></td>
                  <td className="px-8 py-5"><span className="bg-green-100 text-green-700 text-[10px] px-3 py-1 rounded-full font-bold">{u.role}</span><p className="text-gray-400 text-xs font-medium mt-1">{u.wilayah}</p></td>
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
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"><p className="text-gray-400 text-sm font-medium mb-1">Total User</p><h3 className="text-3xl font-extrabold text-[#0B4D1E]">6</h3></div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"><p className="text-gray-400 text-sm font-medium mb-1">Admin</p><h3 className="text-3xl font-extrabold text-[#F4A300]">1</h3></div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"><p className="text-gray-400 text-sm font-medium mb-1">BEM Wilayah</p><h3 className="text-3xl font-extrabold text-[#0B4D1E]">4</h3></div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"><p className="text-gray-400 text-sm font-medium mb-1">User Aktif</p><h3 className="text-3xl font-extrabold text-[#2E7D32]">5</h3></div>
      </div>

      {/* MODAL USER ... [Paste modal form user lu disini bro] */}

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

export default KelolaUserPage;