import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Tambah ini buat pindah halaman
import DashboardLayout from '../components/DashboardLayout';

function ProfilPage() {
  const navigate = useNavigate(); // Inisialisasi navigasi
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    nama: 'Memuat...',
    organisasi: 'Memuat...',
    username: 'Memuat...',
    telepon: 'Belum diatur',
    alamat: 'Institut Pertanian Bogor'
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });

  // Pemetaan label agar rapi seperti di RegisterPage
  const formatRole = (role) => {
    const roles = {
      'bem_km': 'BEM KM IPB',
      'bem_faperta': 'BEM FAPERTA',
      'bem_skhb': 'BEM SKHB',
      'bem_fpik': 'BEM FPIK',
      'bem_fapet': 'BEM FAPET',
      'bem_fahutan': 'BEM FAHUTAN',
      'bem_fateta': 'BEM FATETA',
      'bem_fmipa': 'BEM FMIPA',
      'bem_fem': 'BEM FEM',
      'bem_fema': 'BEM FEMA',
      'bem_vokasi': 'BEM VOKASI',
      'bem_sb': 'BEM SB',
      'bem_fk': 'BEM FK',
      'bem_ssmi': 'BEM SSMI',
      'ormawa_ppku': 'Ormawa Eksekutif PPKU'
    };
    return roles[role] || (role ? role.toUpperCase() : 'Memuat...');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return;
        
        // Baca identitas dari JWT
        const payload = JSON.parse(atob(token.split('.')[1]));
        const usernameJwt = payload.sub;
        
        // Tarik data seluruh user
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.status === 'sukses') {
          // Cari user yang sesuai dengan yang sedang login
          const myUser = data.data.find(u => u.username === usernameJwt);
          if (myUser) {
            setUserId(myUser.id);
            setFormData(prev => ({
              ...prev,
              nama: myUser.nama,
              organisasi: formatRole(myUser.role),
              username: myUser.username
            }));
          }
        }
      } catch (error) {
        console.error('Gagal memuat profil', error);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nama: formData.nama, status: "Aktif" }) // Menembak endpoint update profil
      });
      const data = await res.json();
      
      if (data.status === 'sukses') {
        alert('Profil berhasil diperbarui!');
        setIsEditing(false);
      } else {
        alert(`Gagal: ${data.pesan}`);
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan profil.');
    }
  };

  const handleSavePassword = async () => {
    if(passData.new !== passData.confirm) {
      alert('Password baru dan konfirmasi tidak cocok!');
      return;
    }
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/ubah-password`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password_lama: passData.current, password_baru: passData.new })
      });
      const data = await res.json();
      
      if (data.status === 'sukses') {
        alert(data.pesan);
        setIsPasswordModalOpen(false);
        setPassData({ current: '', new: '', confirm: '' });
      } else {
        alert(`Gagal: ${data.pesan}`);
      }
    } catch (error) {
      alert('Terjadi kesalahan saat mengubah password.');
    }
  };

  // Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  // Membuat singkatan nama untuk foto profil dinamis (contoh: "BEM FATETA" -> "BF")
  const initials = formData.organisasi !== 'Memuat...' ? formData.organisasi.replace('BEM ', '').replace('Ormawa ', '').substring(0, 2).toUpperCase() : 'U';

  return (
    <DashboardLayout>
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

      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 mt-8 hover:-translate-y-1 transition-transform duration-300">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-extrabold text-2xl text-[#0B4D1E]">Informasi Akun</h3>
          <button onClick={handleSaveProfile} className="bg-[#F5EFE6] text-[#0B4D1E] px-6 py-2.5 rounded-full font-bold hover:bg-[#EAE5DA] transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            {isEditing ? 'Simpan Profil' : 'Edit Profil'}
          </button>
        </div>
        <div className="space-y-6">
          {Object.keys(formData).map((key) => {
            const isReadOnly = !isEditing || key === 'username' || key === 'organisasi';
            return (
              <div key={key}>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-2 capitalize">
                  {key === 'nama' ? 'Nama Lengkap' : key}
                </label>
                <input type="text" value={formData[key]} onChange={(e) => setFormData({...formData, [key]: e.target.value})} readOnly={isReadOnly} className={`w-full px-5 py-4 rounded-2xl font-bold transition-all outline-none ${(!isReadOnly && key !== 'organisasi') ? 'bg-white border-2 border-[#F4A300] text-[#0B4D1E]' : 'bg-[#F5EFE6] border-2 border-transparent text-[#0B4D1E] cursor-not-allowed'}`} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 mt-8 hover:-translate-y-1 transition-transform duration-300">
        <h3 className="font-extrabold text-2xl text-[#0B4D1E] mb-6">Keamanan</h3>
        <button onClick={() => setIsPasswordModalOpen(true)} className="w-full bg-[#F5EFE6] hover:bg-[#EAE5DA] px-6 py-5 rounded-2xl flex items-center justify-between transition-colors group">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-xl shadow-sm group-hover:text-[#0B4D1E] text-gray-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <div className="text-left">
              <p className="font-bold text-[#0B4D1E]">Ubah Password</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Terakhir diubah 30 hari lalu</p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#0B4D1E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Button Logout dengan fungsi handleLogout */}
      <button onClick={handleLogout} className="w-full mt-8 bg-[#FFF5F5] hover:bg-[#FFEBEB] text-red-600 border border-red-100 py-5 rounded-[2rem] font-bold flex items-center justify-center gap-3 transition-colors shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        Logout dari Akun
      </button>

      {/* MODAL UBAH PASSWORD SAMA KAYAK SEBELUMNYA */}
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
              <div className="bg-[#EAE5DA] p-4 rounded-xl mt-4">
                <p className="text-xs text-[#0B4D1E]/80 font-medium">Password harus minimal 8 karakter dan mengandung kombinasi huruf dan angka untuk keamanan maksimal.</p>
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