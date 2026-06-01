import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

function KelolaUserPage() {
  const [toastMessage, setToastMessage] = useState('');
  
  // States Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // States Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Semua Role');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  
  // States Custom Dropdown (Untuk buka-tutup)
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', role: 'BEM Wilayah', wilayah: 'FATETA', password: '' });

  const users = [
    { id: 1, name: 'Ahmad Fauzi', email: 'ahmad.fauzi@bem.ipb.ac.id', role: 'BEM Wilayah', wilayah: 'FATETA', status: 'Aktif' },
    { id: 2, name: 'Siti Nurhaliza', email: 'siti.nur@bem.ipb.ac.id', role: 'BEM Wilayah', wilayah: 'FAPET', status: 'Aktif' },
    { id: 3, name: 'Budi Santoso', email: 'budi.santoso@bem.ipb.ac.id', role: 'BEM Wilayah', wilayah: 'FEM', status: 'Aktif' },
    { id: 4, name: 'Dewi Lestari', email: 'dewi.lestari@bem.ipb.ac.id', role: 'DUI', wilayah: 'FAHUTAN', status: 'Aktif' },
  ];

  // Logic Filter
  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'Semua Role' || u.role === filterRole;
    const matchStatus = filterStatus === 'Semua Status' || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(''), 3000); };
  
  const handleDeleteUser = (user) => { showToast(`Akun ${user.name} berhasil dihapus!`); };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, wilayah: user.wilayah, password: '' });
    setIsEditOpen(true);
  };

  const closeModals = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setFormData({ name: '', email: '', role: 'BEM Wilayah', wilayah: 'FATETA', password: '' });
  };

  const handleSubmitAdd = () => {
    showToast('User baru berhasil ditambahkan!');
    closeModals();
  };

  const handleSubmitEdit = () => {
    showToast('Data user berhasil diperbarui!');
    closeModals();
  };

  return (
    <AdminLayout>
      <style>{`@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      
      {/* BANNER UTAMA */}
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm mt-2 mb-8">
        <div className="flex items-center gap-5 text-white mb-6 md:mb-0">
          <div className="bg-[#F4A300] p-4 rounded-2xl"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>
          <div><h2 className="text-3xl font-extrabold mb-1">Kelola User</h2><p className="text-green-100/80 font-medium">Manajemen akun pengguna sistem SIM-TH</p></div>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="bg-[#F4A300] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#d68e00] transition-all shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg> 
          Tambah User
        </button>
      </div>

      {/* FILTER & SEARCHBAR (CUSTOM SESUAI GAMBAR 1) */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Cari nama atau email user..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow" />
        </div>
        
        {/* Custom Dropdown Filter */}
        <div className="flex gap-4 w-full md:w-auto">
          {/* Filter Role */}
          <div className="relative w-full md:w-48">
            <div 
              onClick={() => { setIsRoleDropdownOpen(!isRoleDropdownOpen); setIsStatusDropdownOpen(false); }}
              className="bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl cursor-pointer flex justify-between items-center hover:bg-[#EAE5DA] transition-colors"
            >
              <span className="truncate">{filterRole}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
            {isRoleDropdownOpen && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden py-1">
                {['Semua Role', 'Admin', 'BEM Wilayah', 'DUI'].map(r => (
                  <div 
                    key={r} 
                    onClick={() => { setFilterRole(r); setIsRoleDropdownOpen(false); }} 
                    className={`px-5 py-2.5 cursor-pointer text-sm font-medium transition-colors ${filterRole === r ? 'bg-[#0B4D1E] text-white' : 'text-[#0B4D1E] hover:bg-gray-100'}`}
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter Status */}
          <div className="relative w-full md:w-48">
            <div 
              onClick={() => { setIsStatusDropdownOpen(!isStatusDropdownOpen); setIsRoleDropdownOpen(false); }}
              className="bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl cursor-pointer flex justify-between items-center hover:bg-[#EAE5DA] transition-colors"
            >
              <span className="truncate">{filterStatus}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
            {isStatusDropdownOpen && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden py-1">
                {['Semua Status', 'Aktif', 'Nonaktif'].map(s => (
                  <div 
                    key={s} 
                    onClick={() => { setFilterStatus(s); setIsStatusDropdownOpen(false); }} 
                    className={`px-5 py-2.5 cursor-pointer text-sm font-medium transition-colors ${filterStatus === s ? 'bg-[#0B4D1E] text-white' : 'text-[#0B4D1E] hover:bg-gray-100'}`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
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
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-extrabold text-[#0B4D1E]">{u.name}</p>
                    <p className="text-gray-400 text-xs font-medium">{u.email}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="bg-green-100 text-green-700 text-[10px] px-3 py-1 rounded-full font-bold">{u.role}</span>
                    <p className="text-gray-400 text-xs font-medium mt-1">{u.wilayah}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#2E7D32]">{u.status}</span>
                  </td>
                  <td className="px-8 py-5 flex items-center justify-center gap-3">
                    {/* BUTTON EDIT */}
                    <button onClick={() => openEditModal(u)} className="p-2 text-gray-400 hover:text-[#F4A300] hover:bg-[#FDF6EA] rounded-lg transition-all" title="Edit Data">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                    </button>
                    {/* BUTTON HAPUS */}
                    <button onClick={() => handleDeleteUser(u)} title="Hapus User" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
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

      {/* MODAL TAMBAH USER (SESUAI GAMBAR 2) */}
      {isAddOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-fade-in-up border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#FFF8E1] p-3 rounded-full text-[#F4A300]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </div>
                <h3 className="text-xl font-extrabold text-[#0B4D1E]">Tambah User Baru</h3>
              </div>
              <button onClick={closeModals} className="text-[#0B4D1E] hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Nama Lengkap</label>
                <input type="text" placeholder="Masukkan nama lengkap" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow placeholder-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Email</label>
                <input type="email" placeholder="user@bem.ipb.ac.id" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow placeholder-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Role</label>
                <div className="relative">
                  <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer">
                    <option value="Admin">Admin</option>
                    <option value="BEM Wilayah">BEM Wilayah</option>
                    <option value="DUI">DUI</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4D1E] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Wilayah</label>
                <div className="relative">
                  <select value={formData.wilayah} onChange={(e) => setFormData({...formData, wilayah: e.target.value})} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer">
                    <option value="FATETA">FATETA</option>
                    <option value="FAPET">FAPET</option>
                    <option value="FEM">FEM</option>
                    <option value="FAHUTAN">FAHUTAN</option>
                    <option value="-">-</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4D1E] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Password</label>
                <input type="password" placeholder="Minimal 8 karakter" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow placeholder-gray-400" />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={closeModals} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
              <button onClick={handleSubmitAdd} className="flex-1 bg-[#125B2A] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#0B4D1E] shadow-md transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Tambah User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT USER */}
      {isEditOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-fade-in-up border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#E8F5E9] p-3 rounded-full text-[#125B2A]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </div>
                <h3 className="text-xl font-extrabold text-[#0B4D1E]">Edit Data User</h3>
              </div>
              <button onClick={closeModals} className="text-[#0B4D1E] hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Nama Lengkap</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Role</label>
                <div className="relative">
                  <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer">
                    <option value="Admin">Admin</option>
                    <option value="BEM Wilayah">BEM Wilayah</option>
                    <option value="DUI">DUI</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4D1E] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Wilayah</label>
                <div className="relative">
                  <select value={formData.wilayah} onChange={(e) => setFormData({...formData, wilayah: e.target.value})} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer">
                    <option value="FATETA">FATETA</option>
                    <option value="FAPET">FAPET</option>
                    <option value="FEM">FEM</option>
                    <option value="FAHUTAN">FAHUTAN</option>
                    <option value="-">-</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4D1E] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={closeModals} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
              <button onClick={handleSubmitEdit} className="flex-1 bg-[#125B2A] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#0B4D1E] shadow-md transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION (UDAH FIX DI POJOK KANAN ATAS GLOBALLY) */}
      {toastMessage && (
        <div style={{ animation: 'fadeInDown 0.3s ease-out' }} className="fixed top-10 right-10 z-[99999] bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
          <div className="bg-[#2E7D32] text-white rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
          <span className="font-extrabold text-sm">{toastMessage}</span>
        </div>
      )}
    </AdminLayout>
  );
}

export default KelolaUserPage;