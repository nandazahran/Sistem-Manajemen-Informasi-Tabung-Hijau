import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [namaProfil, setNamaProfil] = useState('Memuat...');
  const [roleProfil, setRoleProfil] = useState('User');
  const [isBEMWilayah, setIsBEMWilayah] = useState(false);

  useEffect(() => {
    const fetchProfil = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const username = payload.sub;

        const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.status === 'sukses') {
          // Cari user yang sesuai dengan username yang login
          const myUser = data.data.find(u => u.username === username);
          if (myUser) {
            setNamaProfil(myUser.nama); // Menampilkan Nama Lengkap dari Database
            // Cek role yang sebenarnya (bukan sekedar ngecek username)
            let displayedRole = 'BEM Wilayah';
            if (myUser.role === 'dui') {
              displayedRole = 'Direktorat Umum dan Infrastruktur';
            } else if (myUser.role === 'bem_km') {
              displayedRole = 'BEM KM IPB';
            } else if (myUser.role === 'admin') {
              displayedRole = 'Administrator';
            }
            
            const isNotAdmin = myUser.role !== 'bem_km' && myUser.role !== 'admin' && myUser.role !== 'dui';
            setIsBEMWilayah(isNotAdmin); 
            setRoleProfil(displayedRole);
          }
        }
      } catch (error) {
        console.error("Gagal memuat profil layout:", error);
      }
    };
    fetchProfil();
  }, []);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', show: true },
    { name: 'Input Transaksi', path: '/input-transaksi', icon: 'M12 4v16m8-8H4', show: !isBEMWilayah },
    { name: 'Riwayat Transaksi', path: '/riwayat', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', show: true },
    { name: 'Buku Tabungan', path: '/tabungan', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', show: true },
    { name: 'Leaderboard KPI', path: '/leaderboard', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', show: true },
    { name: 'Laporan', path: '/laporan', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', show: true },
    { name: 'Pengaturan Data', path: '/pengaturan', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', show: !isBEMWilayah },
    { name: 'Profil', path: '/profil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', show: true },
  ].filter(item => item.show);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      navigate('/riwayat');
    }
  };

  return (
    // Tambahin animate-fade-in disini biar layarnya gak nge-blink kasar
    <div className="min-h-screen bg-[#F5EFE6] flex font-sans animate-fade-in">
      
      <aside className={`w-72 bg-[#0B4D1E] text-white flex flex-col fixed h-full z-40 transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center gap-3">
          <div className="bg-[#F4A300] p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-wide">SIM-TH</h1>
            <p className="text-xs text-green-200">Tabung Hijau</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path} className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all duration-300 font-medium ${isActive ? 'bg-[#F4A300] text-white shadow-lg' : 'text-green-100 hover:bg-[#083a16] hover:text-white'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mb-4">
          <Link to="/login" className="flex items-center gap-4 px-6 py-3.5 text-green-100 hover:bg-red-500/20 hover:text-red-400 rounded-2xl transition-all duration-300 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </Link>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <header className="h-24 bg-white flex items-center justify-between px-10 sticky top-0 z-30 shadow-sm border-b border-gray-100">
          <div className="flex items-center gap-6 flex-1">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-gray-50 rounded-xl shadow-sm text-gray-600 hover:text-[#0B4D1E] hover:bg-gray-100 transition-all border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
            </button>
            <div className="relative w-full max-w-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="Cari transaksi, kategori, laporan, (Tekan Enter)..." 
                onKeyDown={handleSearch}
                className="w-full bg-[#F5EFE6] px-14 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-all text-sm font-medium placeholder-gray-500" 
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/notifikasi" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-0 right-0 w-5 h-5 bg-[#F4A300] text-white text-[11px] font-bold flex items-center justify-center rounded-full border-2 border-white">3</span>
            </Link>
            <div className="h-10 w-px bg-gray-200"></div>
            <Link to="/profil" className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-right">
                <p className="font-extrabold text-[#0B4D1E] text-sm">{namaProfil}</p>
                <p className="text-xs text-[#F4A300] font-bold bg-[#F4A300]/10 inline-block px-3 py-1 rounded-full mt-1">{roleProfil}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#8FA57A] to-[#0B4D1E] rounded-full flex items-center justify-center text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
            </Link>
          </div>
        </header>

        {/* INI KUNCI ANIMASINYA BRO! 
            animate-page-transition bikin setiap konten yang masuk langsung sliding naik dari bawah */}
        <main className="flex-1 px-10 pb-4 animate-page-transition">
          {children}
        </main>

        <footer className="py-8 text-center text-sm border-t border-gray-200/50 mt-10">
           <p className="font-semibold text-[#0B4D1E]/70 text-lg mb-1">SIM-TH © 2026</p>
           <p className="text-[#0B4D1E]/50 font-medium">Developed for Program Tabung Hijau IPB University</p>
        </footer>
      </div>
    </div>
  );
}

export default DashboardLayout;