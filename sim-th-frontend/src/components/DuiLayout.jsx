import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function DuiLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // State Profil (Auto-sync dari backend)
  const [namaProfil, setNamaProfil] = useState('Memuat...');
  const [roleProfil, setRoleProfil] = useState('DUI');

  // State Searchbar
  const [searchQuery, setSearchQuery] = useState('');

  // STATE NOTIFIKASI POPUP (ZERO DUMMY)
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [dataNotif, setDataNotif] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // FETCH DATA PROFIL DARI JWT
  useEffect(() => {
    const fetchProfil = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const username = payload.sub;

        const baseUrl = import.meta.env.VITE_API_URL;
        if (!baseUrl) return;

        const res = await fetch(`${baseUrl}/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.status === 'sukses') {
          const myUser = data.data.find(u => u.username === username);
          if (myUser) {
            setNamaProfil(myUser.nama); 
            // Handle role admin_dui atau dui
            setRoleProfil(myUser.role === 'admin_dui' || myUser.role === 'dui' ? 'DUI' : myUser.role);
          }
        }
      } catch (error) {
        console.error("Gagal memuat profil layout:", error);
      }
    };
    fetchProfil();
  }, [navigate]);

  // FETCH DATA NOTIFIKASI DARI BACKEND
  const fetchNavbarNotifications = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token || !baseUrl) return;

      const response = await fetch(`${baseUrl}/notifikasi`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resData = await response.json();
      
      if (resData.status === 'sukses' && Array.isArray(resData.data)) {
        // Ambil 5 notifikasi teratas untuk modal dropdown
        setDataNotif(resData.data.slice(0, 5));
        // Hitung notif yang isRead-nya false
        const hitungBelumDibaca = resData.data.filter(n => !n.isRead).length;
        setUnreadCount(hitungBelumDibaca);
      }
    } catch (error) {
      console.error("Gagal sinkronisasi notifikasi navbar:", error);
    }
  };

  useEffect(() => {
    fetchNavbarNotifications();
    // Sinkronisasi otomatis tiap 15 detik biar angkanya update kalau ada pesan baru
    const interval = setInterval(fetchNavbarNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const formatWaktuNotif = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const handleLogout = () => navigate('/login');

  // SMART SEARCHBAR ROUTING
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      
      if (query.includes('monitoring') || query.includes('wilayah')) {
        navigate('/dui/monitoring');
      } else if (query.includes('leaderboard') || query.includes('kpi') || query.includes('peringkat')) {
        navigate('/dui/leaderboard');
      } else if (query.includes('laporan') || query.includes('grafik') || query.includes('export')) {
        navigate('/dui/laporan');
      } else if (query.includes('aktivitas') || query.includes('timeline')) {
        navigate('/dui/aktivitas');
      } else if (query.includes('notif') || query.includes('pesan')) {
        navigate('/dui/notifikasi');
      } else if (query.includes('profil') || query.includes('akun')) {
        navigate('/dui/profil');
      } else {
        // Fallback kalau nggak nemu kata kunci yang pas
        navigate('/dui/dashboard');
      }
      setSearchQuery(''); // Bersihkan kolom search setelah enter
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dui/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Monitoring Wilayah', path: '/dui/monitoring', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
    { name: 'Leaderboard KPI', path: '/dui/leaderboard', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
    { name: 'Laporan', path: '/dui/laporan', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Aktivitas Sistem', path: '/dui/aktivitas', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { name: 'Profil', path: '/dui/profil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex font-sans animate-fade-in">
      
      <aside className={`w-72 bg-[#0B4D1E] text-white flex flex-col fixed h-full z-40 transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center gap-3">
          <div className="bg-[#F4A300] p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-wide">SIM-TH</h1>
            <p className="text-xs text-green-200 uppercase tracking-widest">DUI Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link key={item.name} to={item.path} className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all duration-300 font-medium ${isActive ? 'bg-[#F4A300] text-white shadow-lg' : 'text-green-100 hover:bg-[#083a16] hover:text-white'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 3 : 2} d={item.icon} /></svg>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mb-4">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-3.5 text-green-100 hover:bg-red-500/20 hover:text-red-400 rounded-2xl transition-all duration-300 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Cari halaman, monitoring, laporan (Tekan Enter)..." 
                className="w-full bg-[#F5EFE6] px-14 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-all text-sm font-medium placeholder-gray-500" 
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            
            {/* WRAPPER NOTIFIKASI DROPDOWN (ZERO DUMMY) */}
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-[#F4A300] text-white text-[11px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="font-extrabold text-[#0B4D1E] text-lg">Notifikasi</h3>
                    <p className="text-gray-400 text-xs font-medium mt-1">{unreadCount} belum dibaca</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {dataNotif.length > 0 ? (
                      dataNotif.map((item) => (
                        <div key={item.id} className="p-5 border-b border-gray-50 hover:bg-[#FDF6EA] cursor-pointer flex gap-4 transition-colors">
                          <div className="mt-1.5 flex-shrink-0">
                            {!item.isRead ? <div className="w-2.5 h-2.5 rounded-full bg-[#F4A300]"></div> : <div className="w-2.5 h-2.5"></div>}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#0B4D1E]">{item.judul || 'Pemberitahuan'}</p>
                            <p className="text-xs text-gray-500 mt-1 font-medium">{item.deskripsi || item.pesan}</p>
                            <p className="text-[10px] text-gray-400 mt-1.5 font-bold">{formatWaktuNotif(item.waktu || item.created_at)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-sm text-gray-400 italic">Belum ada notifikasi baru.</div>
                    )}
                  </div>
                  <div className="p-4 text-center bg-white border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <button onClick={() => { setIsNotifOpen(false); navigate('/dui/notifikasi'); }} className="text-[#0B4D1E] font-bold text-sm hover:text-[#F4A300] flex items-center justify-center gap-2 w-full transition-colors">
                      Lihat Semua Notifikasi 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-10 w-px bg-gray-200"></div>
            
            <Link to="/dui/profil" className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-right hidden md:block">
                <p className="font-extrabold text-[#0B4D1E] text-sm">{namaProfil}</p>
                <p className="text-xs text-[#F4A300] font-bold bg-[#F4A300]/10 inline-block px-3 py-1 rounded-full mt-1">{roleProfil}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#8FA57A] to-[#0B4D1E] rounded-full flex items-center justify-center text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
            </Link>
          </div>
        </header>

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

export default DuiLayout;