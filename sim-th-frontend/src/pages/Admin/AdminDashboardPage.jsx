import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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
  
  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [pieKategori, setPieKategori] = useState([]);
  const [pieWilayah, setPieWilayah] = useState([]);

  const COLORS_KATEGORI = ['#125B2A', '#F4A300', '#8FA57A', '#EAE5DA'];

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
          
          if (dashData.grafik_bulanan && Array.isArray(dashData.grafik_bulanan)) {
            setLineData(dashData.grafik_bulanan.map(g => ({ name: g.bulan, berat: g.total_berat / 1000 })));
            setBarData(dashData.grafik_bulanan.map(g => ({ name: g.bulan, nilai: g.total_nilai })));
          }

          if (dashData.breakdown_kategori && Array.isArray(dashData.breakdown_kategori)) {
             setPieKategori(dashData.breakdown_kategori.map(k => ({ name: k.kategori, value: k.total_berat / 1000 })));
          }
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
          setPieWilayah(lbData.data.map(w => ({
            name: w.nama_wilayah,
            value: w.total_berat_gram / 1000
          })));
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

      {/* GRAFIK DINAMIS DARI BACKEND */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 mt-6">
        
        {/* Tren Sampah Bulanan */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">Tren Sampah Bulanan</h3>
          <div className="h-64">
            {lineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} width={40} />
                  <Tooltip cursor={{stroke: '#E5E7EB', strokeWidth: 2}} contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} formatter={(value) => [`${value} kg`, 'Berat']} />
                  <Line type="monotone" dataKey="berat" stroke="#125B2A" strokeWidth={4} dot={{r: 5, fill: '#125B2A'}} activeDot={{r: 8}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 flex items-center justify-center">
                 <p className="text-gray-400 font-medium">Belum ada data tren sampah bulanan.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pertumbuhan Nilai Ekonomi */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">Pertumbuhan Nilai Ekonomi</h3>
          <div className="h-64">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} width={60} tickFormatter={(val) => `${val/1000}k`} />
                  <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} formatter={(val) => `Rp ${val.toLocaleString()}`} />
                  <Bar dataKey="nilai" fill="#125B2A" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 flex items-center justify-center">
                 <p className="text-gray-400 font-medium">Belum ada data nilai ekonomi.</p>
              </div>
            )}
          </div>
        </div>

        {/* Kategori Sampah Terbanyak */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">Kategori Sampah Terbanyak</h3>
          <div className="h-64 relative">
            {pieKategori.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} formatter={(value) => `${value} kg`} />
                  <Pie data={pieKategori} innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" label={({name}) => `${name}`} labelLine={false} style={{fontSize: '11px', fontWeight: 'bold'}}>
                    {pieKategori.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS_KATEGORI[index % COLORS_KATEGORI.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 flex items-center justify-center">
                 <p className="text-gray-400 font-medium">Belum ada data kategori sampah.</p>
              </div>
            )}
          </div>
        </div>

        {/* Kontribusi Wilayah */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">Kontribusi Wilayah (kg)</h3>
          <div className="h-64 relative">
            {pieWilayah.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} formatter={(value) => `${value.toFixed(1)} kg`} />
                  <Pie data={pieWilayah} innerRadius={0} outerRadius={100} paddingAngle={1} dataKey="value" label={({name}) => name} labelLine={false} style={{fontSize: '11px', fontWeight: 'bold'}}>
                    {pieWilayah.map((entry, index) => <Cell key={`cell-${index}`} fill={['#125B2A', '#F4A300', '#8FA57A', '#517D3B', '#D1D5DB'][index % 5]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 flex items-center justify-center">
                 <p className="text-gray-400 font-medium">Belum ada data kontribusi wilayah.</p>
              </div>
            )}
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