import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

function AdminDashboardPage() {
  const navigate = useNavigate();

  const stats = [
    { title: 'Total Transaksi', value: '1,284', badge: '+12% bulan ini', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { title: 'Total Berat Sampah', value: '1,890 kg', badge: '+8% bulan ini', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2' },
    { title: 'Total Nilai Ekonomi', value: 'Rp 6,1jt', badge: '+15% bulan ini', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { title: 'Wilayah Aktif', value: '8', badge: 'dari 8 total', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    { title: 'User Aktif', value: '42', badge: '+3 baru', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197' },
    { title: 'KPI Tertinggi', value: '925', badge: 'BEM FATETA', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  ];

  return (
    <AdminLayout>
      {/* BANNER GRADIENT KREM KE HIJAU */}
      <div className="bg-gradient-to-r from-[#F5EFE6] via-[#F5EFE6] to-[#8FA57A]/30 rounded-3xl p-12 flex items-center justify-between shadow-sm relative overflow-hidden mt-2 mb-8 border border-white/60">
        <div className="z-10 max-w-xl">
          <h2 className="text-4xl font-extrabold text-[#0B4D1E] mb-4">Selamat Datang, Admin SIM-TH <span className="text-green-600">🌱</span></h2>
          <p className="text-gray-700 font-medium text-lg mb-8">Pantau dan kelola seluruh aktivitas Tabung Hijau IPB secara terpusat.</p>
          <button onClick={() => navigate('/admin/kelola-wilayah')} className="bg-[#F4A300] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            Kelola Monitoring <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </button>
        </div>
        <div className="hidden md:flex w-96 h-48 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 items-center justify-center z-10 shadow-sm relative">
           <span className="text-sm font-bold text-[#0B4D1E]">Ilustrasi Dashboard Admin</span>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mt-8">
        <h3 className="text-[#0B4D1E] font-extrabold text-xl mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { t: 'Tambah User', s: 'Daftar user baru', p: '/admin/kelola-user', i: 'M12 4v16m8-8H4' },
            { t: 'Tambah Kategori', s: 'Kategori sampah', p: '/admin/kelola-kategori', i: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4' },
            { t: 'Export Laporan', s: 'Unduh data', p: '/admin/laporan', i: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1' },
            { t: 'Leaderboard KPI', s: 'Lihat ranking', p: '/admin/leaderboard', i: 'M5 3v4M3 5h4M6 17v4' },
          ].map((act, i) => (
            <button key={i} onClick={() => navigate(act.p)} className="bg-[#125B2A] hover:bg-[#0B4D1E] p-5 rounded-2xl flex items-center gap-4 transition-all group">
              <div className="bg-white/20 p-3 rounded-full text-white group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={act.i} /></svg>
              </div>
              <div className="text-left">
                <h4 className="text-white font-bold text-sm">{act.t}</h4>
                <p className="text-green-100/60 text-[10px] font-medium">{act.s}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* STATS KONSISTEN BEM & DUI */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-6">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="p-4 rounded-2xl bg-[#EAE5DA] text-[#0B4D1E]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </div>
              <span className="bg-[#E8F5E9] text-[#2E7D32] text-xs font-extrabold px-3 py-1.5 rounded-full">
                {s.badge}
              </span>
            </div>
            <p className="text-gray-500 text-sm font-medium">{s.title}</p>
            <h3 className="text-3xl font-extrabold text-[#0B4D1E] mt-1">{s.value}</h3>
          </div>
        ))}
      </div>

      {/* GRAFIK (SESUAI FOTO 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Line Chart Card */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="font-extrabold text-lg text-[#0B4D1E] mb-6">Tren Sampah Bulanan</h3>
          <div className="h-48 flex items-end justify-between px-2 relative">
            <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 40">
              <path d="M0 35 Q 25 30, 50 20 T 100 5" fill="none" stroke="#125B2A" strokeWidth="2" />
              <circle cx="0" cy="35" r="2" fill="#125B2A" />
              <circle cx="25" cy="30" r="2" fill="#125B2A" />
              <circle cx="50" cy="20" r="2" fill="#125B2A" />
              <circle cx="75" cy="15" r="2" fill="#125B2A" />
              <circle cx="100" cy="5" r="2" fill="#125B2A" />
            </svg>
            <div className="w-full flex justify-between mt-auto pt-4 text-[10px] font-bold text-gray-400">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Card */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="font-extrabold text-lg text-[#0B4D1E] mb-6">Nilai Ekonomi Bulanan</h3>
          <div className="h-48 flex items-end justify-between px-4">
            {[40, 55, 70, 85, 100].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full">
                <div style={{ height: `${h}%` }} className="w-8 bg-[#125B2A] rounded-t-lg transition-all hover:opacity-80"></div>
                <span className="text-[10px] font-bold text-gray-400">{['Jan','Feb','Mar','Apr','Mei'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart Card */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="font-extrabold text-lg text-[#0B4D1E] mb-6">Kategori Sampah Terbanyak</h3>
          <div className="flex justify-center items-center h-48 relative">
             <div className="w-32 h-32 rounded-full" style={{ background: 'conic-gradient(#125B2A 0% 45%, #F4A300 45% 75%, #EAE5DA 75% 100%)' }}></div>
             <div className="absolute right-0 text-[10px] font-bold text-[#0B4D1E] space-y-2">
               <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#125B2A] rounded-full"></div> Plastik 45%</div>
               <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#F4A300] rounded-full"></div> Kertas 30%</div>
             </div>
          </div>
        </div>
      </div>

      {/* AKTIVITAS & RIWAYAT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Aktivitas Card */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-extrabold text-xl text-[#0B4D1E]">Aktivitas Sistem</h3>
            <button onClick={() => navigate('/admin/aktivitas')} className="text-sm font-bold text-[#0B4D1E] hover:text-[#F4A300] flex items-center gap-1 transition-colors">
              Lihat Semua 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
          <div className="space-y-6">
            {[
              { t: 'Transaksi baru masuk', s: 'BEM FATETA - Plastik 25kg', time: '5 menit lalu', c: 'bg-green-100 text-green-600', i: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { t: 'User baru ditambahkan', s: 'BEM FAPET berhasil didaftarkan', time: '15 menit lalu', c: 'bg-blue-100 text-blue-600', i: 'M16 7a4 4 0 11-8 0 4 4 0 018 0z' },
              { t: 'Kategori harga diperbarui', s: 'Plastik: Rp 4.500/kg', time: '1 jam lalu', c: 'bg-yellow-100 text-yellow-600', i: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <div className={`${item.c} p-3 rounded-full transition-transform group-hover:scale-110`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.i} /></svg></div>
                <div className="flex-1">
                  <p className="font-bold text-[#0B4D1E] text-sm">{item.t}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{item.s}</p>
                </div>
                <div className="text-[10px] text-gray-400 font-bold">{item.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Riwayat Card */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-extrabold text-xl text-[#0B4D1E]">Riwayat Terbaru</h3>
            <button onClick={() => navigate('/admin/riwayat-transaksi')} className="text-sm font-bold text-[#0B4D1E] hover:text-[#F4A300] flex items-center gap-1 transition-colors">
              Lihat Semua 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
          <div className="space-y-4">
            {[
              { n: 'BEM FATETA', m: 'Plastik', q: '25 kg', d: '9 Mei 2026', a: 'Rp 112.500' },
              { n: 'BEM FAPET', m: 'Kertas', q: '15 kg', d: '9 Mei 2026', a: 'Rp 37.500' },
              { n: 'BEM FEM', m: 'Logam', q: '10 kg', d: '8 Mei 2026', a: 'Rp 75.000' },
            ].map((rw, i) => (
              <div key={i} className="flex justify-between items-center bg-[#F5EFE6] p-5 rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100 cursor-pointer group">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-[#0B4D1E] text-sm">{rw.n}</p>
                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">{rw.m}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-bold mt-1">{rw.q} • {rw.d}</p>
                </div>
                <div className="font-extrabold text-[#0B4D1E] group-hover:text-green-600 transition-colors">{rw.a}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

export default AdminDashboardPage;