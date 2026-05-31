import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function DuiLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dui/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Monitoring Wilayah', path: '/dui/monitoring', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
    { name: 'Leaderboard KPI', path: '/dui/leaderboard', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
    { name: 'Laporan', path: '/dui/laporan', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Aktivitas', path: '/dui/aktivitas', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { name: 'Profil', path: '/dui/profil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  const handleLogout = () => navigate('/login');

  return (
    <div className="flex h-screen bg-[#F5EFE6] font-sans">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#0B4D1E] text-white flex flex-col justify-between shadow-2xl z-20">
        <div>
          <div className="p-8 flex items-center gap-3">
            <div className="bg-[#F4A300] p-2 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2" /></svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-wide">SIM-TH</h1>
              <p className="text-[10px] text-gray-300 font-medium tracking-widest uppercase">DUI Dashboard</p>
            </div>
          </div>
          <nav className="mt-4 px-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              return (
                <Link key={item.name} to={item.path} className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-[#F4A300] text-white font-bold shadow-lg' : 'text-gray-300 hover:bg-white/10 hover:text-white font-medium'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 3 : 2} d={item.icon} /></svg>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3.5 text-gray-300 hover:bg-red-500 hover:text-white rounded-2xl transition-all font-medium group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TOP NAVBAR */}
        <header className="bg-white px-8 py-4 flex items-center justify-between shadow-sm z-10 sticky top-0">
          <div className="relative w-96">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Cari wilayah, laporan, atau aktivitas..." className="w-full bg-[#F5EFE6] pl-12 pr-4 py-2.5 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B4D1E] text-[#0B4D1E]" />
          </div>
          <div className="flex items-center gap-6">
            
            {/* INI TOMBOL LONCENG YANG UDAH DIUPDATE JADI LINK */}
            <Link to="/dui/notifikasi" className="relative text-gray-400 hover:text-[#0B4D1E] transition-colors mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">2</span>
            </Link>

            {/* PROFIL */}
            <Link to="/dui/profil" className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-sm font-extrabold text-[#0B4D1E] group-hover:text-[#F4A300] transition-colors">DUI SIM-TH</p>
                <p className="text-[11px] font-bold text-gray-400">DUI</p>
              </div>
              <div className="w-10 h-10 bg-[#0B4D1E] rounded-full flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F5EFE6] p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DuiLayout;