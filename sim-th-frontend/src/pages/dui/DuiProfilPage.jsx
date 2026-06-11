import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DuiLayout from '../../components/DuiLayout';

function DuiProfilPage() {
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPassOpen, setIsPassOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // STATE UNTUK DATA PROFIL RIIL DARI BACKEND
  const [profilData, setProfilData] = useState({
    nama: 'Memuat...',
    email: 'Memuat...',
    no_hp: '-',
    institusi: 'Memuat...',
    role: 'Memuat...',
    tglGabung: '-'
  });

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return;

        // Decode token buat dapet username/sub
        const payload = JSON.parse(atob(token.split('.')[1]));
        const username = payload.sub;

        const baseUrl = import.meta.env.VITE_API_URL;
        if (!baseUrl) return;

        const response = await fetch(`${baseUrl}/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resData = await response.json();

        if (resData.status === 'sukses') {
          const myUser = resData.data.find(u => u.username === username);
          if (myUser) {
            setProfilData({
              nama: myUser.nama || '-',
              // Jika backend belum support kolom email spesifik, kita format dari username sementara
              email: myUser.email || `${myUser.username}@simth.ipb.ac.id`, 
              role: myUser.role === 'admin_dui' ? 'DUI' : myUser.role,
              no_hp: myUser.no_hp || '-',
              institusi: myUser.institusi || 'BEM KM IPB',
              tglGabung: myUser.created_at 
                ? new Date(myUser.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) 
                : '-'
            });
          }
        }
      } catch (error) {
        console.error("Gagal memuat data profil:", error);
      }
    };
    fetchProfil();
  }, []);

  const showToast = (msg) => { 
    setToastMessage(msg); 
    setTimeout(() => setToastMessage(''), 3000); 
  };
  
  const handleLogout = () => { 
    navigate('/login'); 
  };
  
  const handleSaveProfile = (e) => { 
    e.preventDefault(); 
    // TODO: Nanti sambungin ke endpoint PUT/POST Nanda disini
    setIsEditOpen(false); 
    showToast('Profil berhasil diperbarui!'); 
  };
  
  const handleSavePassword = (e) => { 
    e.preventDefault(); 
    // TODO: Nanti sambungin ke endpoint ubah password Nanda disini
    setIsPassOpen(false); 
    showToast('Password berhasil diubah!'); 
  };

  return (
    <DuiLayout>
      <style>{`@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* BANNER PROFIL */}
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex items-center gap-6 text-white mt-2 mb-8 shadow-sm">
        {/* Ikon Kamera dan Animasi Hover Dihapus */}
        <div className="w-24 h-24 bg-[#F4A300] rounded-3xl flex items-center justify-center shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold mb-2">{profilData.nama}</h2>
          <div className="flex gap-2">
            <span className="bg-green-600/50 text-white text-xs px-3 py-1 rounded-full font-bold border border-green-500/50">{profilData.email}</span>
            <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full font-bold border border-white/20">{profilData.role}</span>
            <span className="bg-[#F4A300]/20 text-[#F4A300] text-xs px-3 py-1 rounded-full font-bold border border-[#F4A300]/30">{profilData.institusi}</span>
          </div>
        </div>
      </div>

      {/* INFORMASI PROFIL */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8 relative">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-extrabold text-xl text-[#0B4D1E]">Informasi Profil</h3>
          <button onClick={() => setIsEditOpen(true)} className="bg-[#125B2A] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#0B4D1E] transition-all shadow-sm text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> Edit Profil
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Nama Lengkap', value: profilData.nama, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            { label: 'Email', value: profilData.email, icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
            { label: 'Role', value: profilData.role, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
            { label: 'Nomor Telepon', value: profilData.no_hp, icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
            { label: 'Institusi', value: profilData.institusi, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
            { label: 'Bergabung Sejak', value: profilData.tglGabung, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
          ].map((item, i) => (
            <div key={i} className="bg-[#F5EFE6] p-5 rounded-2xl flex items-center gap-5">
              <div className="bg-[#EAE5DA] p-3 rounded-full text-[#0B4D1E]"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg></div>
              <div><p className="text-gray-400 text-xs font-bold mb-1">{item.label}</p><p className="font-extrabold text-[#0B4D1E]">{item.value}</p></div>
            </div>
          ))}
        </div>
      </div>

      <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-4 px-2">Keamanan Akun</h3>
      <div onClick={() => setIsPassOpen(true)} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all mb-8 group">
        <div className="flex items-center gap-5">
          <div className="bg-[#F5EFE6] p-4 rounded-2xl text-[#0B4D1E] group-hover:scale-110 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg></div>
          <div><h4 className="font-extrabold text-[#0B4D1E] text-lg">Ubah Password</h4><p className="text-gray-500 text-sm font-medium">Update password akun Anda</p></div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-[#0B4D1E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
      </div>

      <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-4 px-2">Keluar dari Sistem</h3>
      <div onClick={handleLogout} className="bg-[#FFF5F5] p-6 rounded-[2rem] shadow-sm border border-red-100 flex items-center justify-between cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all mb-10 group">
        <div className="flex items-center gap-5">
          <div className="bg-red-100 p-4 rounded-2xl text-red-600 group-hover:scale-110 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></div>
          <div><h4 className="font-extrabold text-red-600 text-lg">Logout</h4><p className="text-red-500/80 text-sm font-medium">Keluar dari sistem SIM-TH</p></div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-300 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
      </div>


      {/* MODAL EDIT PROFIL */}
      {isEditOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative animate-fade-in-up border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-extrabold text-[#0B4D1E]">Edit Profil</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-[#0B4D1E] hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Nama Lengkap</label>
                <input type="text" defaultValue={profilData.nama} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#125B2A]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Email</label>
                <input type="email" defaultValue={profilData.email} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#125B2A]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Nomor Telepon</label>
                <input type="text" defaultValue={profilData.no_hp} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#125B2A]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Institusi</label>
                <input type="text" defaultValue={profilData.institusi} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#125B2A]" />
              </div>
              
              <div className="flex gap-4 mt-8 pt-4">
                <button type="button" onClick={() => setIsEditOpen(false)} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
                <button type="submit" className="flex-1 bg-[#125B2A] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#0B4D1E] transition-all shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL UBAH PASSWORD */}
      {isPassOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative animate-fade-in-up border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-extrabold text-[#0B4D1E]">Ubah Password</h3>
              <button onClick={() => setIsPassOpen(false)} className="text-[#0B4D1E] hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSavePassword} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Password Lama</label>
                <input type="password" placeholder="Masukkan password lama" className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#125B2A]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Password Baru</label>
                <input type="password" placeholder="Masukkan password baru" className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#125B2A]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Konfirmasi Password Baru</label>
                <input type="password" placeholder="Ulangi password baru" className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#125B2A]" />
              </div>
              
              <div className="flex gap-4 mt-8 pt-4">
                <button type="button" onClick={() => setIsPassOpen(false)} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
                <button type="submit" className="flex-1 bg-[#125B2A] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#0B4D1E] transition-all shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Ubah Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFIKASI */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '100px', right: '40px', zIndex: 999999, animation: 'fadeInDown 0.3s ease-out' }} className="bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
          <div className="bg-[#2E7D32] text-white rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
          <span className="font-extrabold text-sm">{toastMessage}</span>
        </div>
      )}
    </DuiLayout>
  );
}

export default DuiProfilPage;