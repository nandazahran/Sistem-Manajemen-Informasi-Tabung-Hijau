import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

function ProfilPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  
  // Data asli yang tampil di halaman
  const [formData, setFormData] = useState({
    nama: 'Memuat...',
    email: 'Memuat...',
    organisasi: 'Memuat...', // Role
    telepon: 'Belum diatur',
    institusi: 'Institut Pertanian Bogor',
    bergabung: '15 Januari 2024'
  });

  // State untuk Modal Edit Profil
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({}); // Data sementara buat di modal

  // State untuk Modal Password
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });

  const formatRole = (role) => {
    const roles = {
      'bem_km': 'BEM KM IPB', 'bem_fateta': 'BEM FATETA', 'admin': 'Admin'
    };
    return roles[role] || (role ? role.toUpperCase() : 'BEM Wilayah');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return;
        
        const payload = JSON.parse(atob(token.split('.')[1]));
        const usernameJwt = payload.sub;
        
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.status === 'sukses') {
          const myUser = data.data.find(u => u.username === usernameJwt);
          if (myUser) {
            setUserId(myUser.id);
            setFormData(prev => ({
              ...prev,
              nama: myUser.nama,
              email: myUser.email || `${myUser.username}@simth.ipb.ac.id`,
              organisasi: formatRole(myUser.role),
              telepon: myUser.telepon || '081234567890',
              institusi: 'BEM KM IPB' // Default dummy dari referensi
            }));
          }
        }
      } catch (error) {
        console.error('Gagal memuat profil', error);
      }
    };
    fetchProfile();
  }, []);

  // Fungsi buka modal edit dan copy data saat ini ke form edit
  const openEditModal = () => {
    setEditData(formData);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nama: editData.nama, 
          status: "Aktif",
          telepon: editData.telepon !== 'Belum diatur' ? editData.telepon : null
          // Catatan: Tambahkan field email/institusi ke payload jika backend mendukung
        })
      });
      const data = await res.json();
      if (data.status === 'sukses') {
        alert('Profil berhasil diperbarui!');
        setFormData(editData); // Update data tampilan utama
        setIsEditModalOpen(false); // Tutup modal
      } else alert(`Gagal: ${data.pesan}`);
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan profil.');
    }
  };

  const handleSavePassword = async () => {
    if(passData.new !== passData.confirm) { alert('Password baru dan konfirmasi tidak cocok!'); return; }
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/ubah-password`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ password_lama: passData.current, password_baru: passData.new })
      });
      const data = await res.json();
      if (data.status === 'sukses') {
        alert(data.pesan);
        setIsPasswordModalOpen(false);
        setPassData({ current: '', new: '', confirm: '' });
      } else alert(`Gagal: ${data.pesan}`);
    } catch (error) {
      alert('Terjadi kesalahan saat mengubah password.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  const initials = formData.organisasi !== 'Memuat...' ? formData.organisasi.replace('BEM ', '').substring(0, 2).toUpperCase() : 'U';

  return (
    <DashboardLayout>
      {/* BANNER PROFIL */}
      <div className="bg-[#0B4D1E] rounded-[2.5rem] p-12 flex items-center gap-8 text-white shadow-sm mt-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative group cursor-pointer z-10">
          <div className="w-28 h-28 bg-[#F4A300] rounded-3xl flex items-center justify-center text-4xl font-extrabold shadow-lg">{initials}</div>
          <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
        </div>
        <div className="z-10">
          <h2 className="text-4xl font-extrabold mb-2">{formData.organisasi}</h2>
          <p className="text-green-100/80 font-medium mb-4">{formData.nama} • Kelola informasi akun Anda</p>
          <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm border border-white/30">Role: User Aktif</span>
        </div>
      </div>

      {/* CARD 1: INFORMASI PROFIL (Read Only) */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-extrabold text-2xl text-[#0B4D1E]">Informasi Profil</h3>
          <button onClick={openEditModal} className="bg-[#125B2A] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#0B4D1E] transition-colors flex items-center gap-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Edit Profil
          </button>
        </div>
        
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-[#F5EFE6] p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0B4D1E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nama Lengkap</p>
                <p className="font-extrabold text-[#0B4D1E]">{formData.nama}</p>
              </div>
            </div>

            <div className="bg-[#F5EFE6] p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0B4D1E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                <p className="font-extrabold text-[#0B4D1E]">{formData.email}</p>
              </div>
            </div>

            <div className="bg-[#F5EFE6] p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0B4D1E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Role</p>
                <p className="font-extrabold text-[#0B4D1E]">BEM Wilayah</p>
              </div>
            </div>

            <div className="bg-[#F5EFE6] p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0B4D1E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nomor Telepon</p>
                <p className="font-extrabold text-[#0B4D1E]">{formData.telepon}</p>
              </div>
            </div>

            <div className="bg-[#F5EFE6] p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0B4D1E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Institusi</p>
                <p className="font-extrabold text-[#0B4D1E]">{formData.institusi}</p>
              </div>
            </div>

            <div className="bg-[#F5EFE6] p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0B4D1E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bergabung Sejak</p>
                <p className="font-extrabold text-[#0B4D1E]">{formData.bergabung}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* CARD 2: KEAMANAN AKUN (Lebih Kecil & Interaktif) */}
      <div className="mt-10">
        <h3 className="font-extrabold text-2xl text-[#0B4D1E] mb-6">Keamanan Akun</h3>
        <button onClick={() => setIsPasswordModalOpen(true)} className="w-full bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:-translate-y-1 hover:shadow-md transition-all group">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-[#F5EFE6] rounded-2xl flex items-center justify-center text-[#0B4D1E]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
            </div>
            <div className="text-left">
              <p className="font-extrabold text-lg text-[#0B4D1E]">Ubah Password</p>
              <p className="text-sm text-gray-500 font-medium">Update password akun Anda</p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#0B4D1E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </button>
      </div>

      {/* CARD 3: LOGOUT (Lebih Kecil, Memanjang, & Interaktif) */}
      <div className="mt-8 mb-12">
        <h3 className="font-extrabold text-2xl text-[#0B4D1E] mb-6">Keluar dari Sistem</h3>
        <button onClick={handleLogout} className="w-full bg-[#FFF5F5] p-5 rounded-3xl shadow-sm border border-red-100 flex items-center justify-between hover:-translate-y-1 hover:shadow-md transition-all group">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </div>
            <div className="text-left">
              <p className="font-extrabold text-lg text-red-600">Logout</p>
              <p className="text-sm text-red-500/70 font-medium">Keluar dari sistem SIM-TH</p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-300 group-hover:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </div>

      {/* MODAL EDIT PROFIL (Sesuai Gambar 1) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-fade-in-up border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-extrabold text-[#0B4D1E]">Edit Profil</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Nama Lengkap</label>
                <input type="text" value={editData.nama} onChange={(e) => setEditData({...editData, nama: e.target.value})} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Email</label>
                <input type="email" value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Nomor Telepon</label>
                <input type="text" value={editData.telepon} onChange={(e) => setEditData({...editData, telepon: e.target.value})} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Institusi</label>
                <input type="text" value={editData.institusi} onChange={(e) => setEditData({...editData, institusi: e.target.value})} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow" />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
              <button onClick={handleSaveProfile} className="flex-1 bg-[#125B2A] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#0B4D1E] transition-all shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL UBAH PASSWORD */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative animate-fade-in-up border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-[#EAE5DA] p-3 rounded-2xl text-[#0B4D1E]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <h3 className="text-2xl font-extrabold text-[#0B4D1E]">Ubah Password</h3>
              </div>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Password Saat Ini</label>
                <div className="relative">
                  <input type={showCurrent ? "text" : "password"} value={passData.current} onChange={(e) => setPassData({...passData, current: e.target.value})} placeholder="Masukkan password saat ini" className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none pr-12 focus:ring-2 focus:ring-[#0B4D1E] transition-all" />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B4D1E] transition-colors">
                    {showCurrent ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Password Baru</label>
                <div className="relative">
                  <input type={showNew ? "text" : "password"} value={passData.new} onChange={(e) => setPassData({...passData, new: e.target.value})} placeholder="Minimal 8 karakter" className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none pr-12 focus:ring-2 focus:ring-[#0B4D1E] transition-all" />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B4D1E] transition-colors">
                    {showNew ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Konfirmasi Password Baru</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} value={passData.confirm} onChange={(e) => setPassData({...passData, confirm: e.target.value})} placeholder="Ulangi password baru" className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none pr-12 focus:ring-2 focus:ring-[#0B4D1E] transition-all" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B4D1E] transition-colors">
                    {showConfirm ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setIsPasswordModalOpen(false)} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
              <button onClick={handleSavePassword} className="flex-1 bg-[#0B4D1E] text-white py-4 rounded-2xl font-bold hover:bg-[#083a16] shadow-md hover:-translate-y-1 hover:shadow-lg transition-all">Simpan Password</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ProfilPage;