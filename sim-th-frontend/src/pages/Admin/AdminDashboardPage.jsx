import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import bannerImg from '../../assets/DB-gambar-banner.png';

function AdminDashboardPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState([
    { title: 'Total Transaksi', value: '0', badge: 'Memuat...', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { title: 'Total Berat Sampah', value: '0 kg', badge: 'Memuat...', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2' },
    { title: 'Total Nilai Ekonomi', value: 'Rp 0', badge: 'Memuat...', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { title: 'Wilayah Aktif', value: '0', badge: 'Memuat...', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    { title: 'User Aktif', value: '0', badge: 'Memuat...', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197' },
    { title: 'KPI Tertinggi', value: '0', badge: '-', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  ]);

  const [aktivitasTerbaru, setAktivitasTerbaru] = useState([]);
  const [riwayatTerbaru, setRiwayatTerbaru] = useState([]);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return;
        const headers = { 'Authorization': `Bearer ${token}` };

        // 1. Fetch Global Dashboard
        const dashRes = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`, { headers });
        const dashData = await dashRes.json();
        
        // 2. Fetch Leaderboard
        const lbRes = await fetch(`${import.meta.env.VITE_API_URL}/dashboard/leaderboard`, { headers });
        const lbData = await lbRes.json();
        
        // 3. Fetch Wilayah Aktif
        const wilRes = await fetch(`${import.meta.env.VITE_API_URL}/wilayah/aktif`, { headers });
        const wilData = await wilRes.json();
        
        // 4. Fetch Users (Hitung yang aktif jika ada statusnya, sementara total)
        const userRes = await fetch(`${import.meta.env.VITE_API_URL}/users`, { headers });
        const userData = await userRes.json();
        
        // 5. Fetch Transaksi
        const trxRes = await fetch(`${import.meta.env.VITE_API_URL}/transaksi`, { headers });
        const trxData = await trxRes.json();

        // --- Susun Data ---
        const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
        
        let newStats = [...stats];
        if (dashData.status === 'sukses') {
          newStats[0].value = (dashData.rekap_seluruh_ipb?.jumlah_transaksi || 0).toString();
          newStats[0].badge = 'Total Seluruh Wilayah';
          newStats[1].value = `${(dashData.rekap_seluruh_ipb?.total_berat_gram || 0) / 1000} kg`;
          newStats[1].badge = 'Total Berat Disetor';
          newStats[2].value = formatRp(dashData.rekap_seluruh_ipb?.total_rupiah || 0);
          newStats[2].badge = 'Total Nilai Terkumpul';
        }
        
        if (wilData.status === 'sukses') {
          newStats[3].value = wilData.data.length.toString();
          newStats[3].badge = 'Wilayah Status Aktif';
        }
        
        if (userData.status === 'sukses') {
          newStats[4].value = userData.data.length.toString();
          newStats[4].badge = 'Akun Terdaftar';
        }
        
        if (lbData.status === 'sukses' && lbData.data.length > 0) {
          newStats[5].value = lbData.data[0].poin_kpi.toString();
          newStats[5].badge = lbData.data[0].nama_wilayah;
        }

        setStats(newStats);

        if (trxData.status === 'sukses') {
          const sortedTrx = trxData.data.sort((a, b) => b.id - a.id);
          setRiwayatTerbaru(sortedTrx.slice(0, 3));
          
          // Generate aktivitas dari transaksi
          const mapAktivitas = sortedTrx.slice(0, 3).map(t => {
            const date = new Date(t.tanggal);
            const timeStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
            return {
              t: 'Transaksi baru dicatat',
              s: `${t.nama_wilayah} - ${t.nama_kategori} ${t.berat / 1000}kg`,
              time: timeStr,
              c: 'bg-green-100 text-green-600',
              i: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
            };
          });
          setAktivitasTerbaru(mapAktivitas);
        }

      } catch (error) {
        console.error("Gagal mengambil data dashboard admin:", error);
      }
    };
    fetchAdminDashboard();
  }, []);

  return (
    <AdminLayout>
      {/* BANNER GRADIENT KREM KE HIJAU DENGAN GAMBAR */}
      <div className="bg-gradient-to-r from-[#F5EFE6] via-[#F5EFE6] to-[#8FA57A]/30 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-sm relative overflow-hidden mt-2 mb-8 border border-white/60">
        <div className="z-10 max-w-xl mb-6 md:mb-0">
          <h2 className="text-4xl font-extrabold text-[#0B4D1E] mb-4">Selamat Datang, Admin SIM-TH <span className="text-green-600">🌱</span></h2>
          <p className="text-gray-700 font-medium text-lg mb-8">Pantau dan kelola seluruh aktivitas Tabung Hijau IPB secara terpusat.</p>
          <button onClick={() => navigate('/admin/kelola-wilayah')} className="bg-[#F4A300] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            Kelola Monitoring <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </button>
        </div>
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0 z-10 flex justify-center md:justify-end">
           <img src={bannerImg} alt="Ilustrasi Banner" className="w-full max-w-[280px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500" />
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
            {aktivitasTerbaru.map((item, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <div className={`${item.c} p-3 rounded-full transition-transform group-hover:scale-110`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.i} /></svg></div>
                <div className="flex-1">
                  <p className="font-bold text-[#0B4D1E] text-sm">{item.t}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{item.s}</p>
                </div>
                <div className="text-[10px] text-gray-400 font-bold">{item.time}</div>
              </div>
            ))}
            {aktivitasTerbaru.length === 0 && <p className="text-sm text-gray-500 py-4">Belum ada aktivitas.</p>}
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
            {riwayatTerbaru.map((rw, i) => {
              const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
              const dateObj = new Date(rw.tanggal);
              const tglStr = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
              return (
              <div key={i} className="flex justify-between items-center bg-[#F5EFE6] p-5 rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100 cursor-pointer group">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-[#0B4D1E] text-sm">{rw.nama_wilayah}</p>
                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">{rw.nama_kategori}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-bold mt-1">{rw.berat / 1000} kg • {tglStr}</p>
                </div>
                <div className="font-extrabold text-[#0B4D1E] group-hover:text-green-600 transition-colors">{formatRp(rw.total_nilai)}</div>
              </div>
            )})}
            {riwayatTerbaru.length === 0 && <p className="text-sm text-gray-500 py-4 text-center">Belum ada riwayat transaksi.</p>}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

export default AdminDashboardPage;