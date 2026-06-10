import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import bannerImg from '../assets/DB-gambar-banner.png';

function DashboardPage() {
  const navigate = useNavigate();

  // STATE UNTUK DATA API (KOSONGAN/LOADING STATE)
  const [stats, setStats] = useState({
    totalSampah: '0 kg',
    nilaiEkonomi: 'Rp 0',
    totalTransaksi: '0',
    rank: '-'
  });
  const [top3, setTop3] = useState([]);
  const [transaksiTerbaru, setTransaksiTerbaru] = useState([]);
  const [aktivitas, setAktivitas] = useState([]);
  const [namaWilayah, setNamaWilayah] = useState('Memuat...');
  const [grafikBulanan, setGrafikBulanan] = useState([]);

  // ==========================================
  // FETCH DATA ASLI DARI API & LOCALSTORAGE
  // ==========================================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        // 1. Ambil Nama Wilayah Dinamis dari LocalStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.nama_wilayah) {
          setNamaWilayah(userData.nama_wilayah);
        } else if (userData && userData.nama) {
          setNamaWilayah(userData.nama);
        } else {
          setNamaWilayah('BEM Wilayah');
        }

        // 2. Fetch Data Statistik Dashboard dari Backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/dashboard/wilayah`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resData = await response.json();

        if (resData.status === 'sukses') {
          setStats({
            totalSampah: `${resData.data.total_sampah || 0} kg`,
            nilaiEkonomi: formatRp(resData.data.nilai_ekonomi || 0),
            totalTransaksi: resData.data.total_transaksi || 0,
            rank: resData.data.rank ? `#${resData.data.rank} Wilayah` : '-'
          });
          setTop3(resData.data.top_wilayah || []);
          setTransaksiTerbaru(resData.data.transaksi_terbaru || []);
          setGrafikBulanan(resData.data.grafik_bulanan || []);
          setAktivitas(resData.data.aktivitas_terbaru || []);
        }
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  const formatTanggalSingkat = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <DashboardLayout>
      {/* BANNER UTAMA */}
      <div className="bg-gradient-to-r from-[#F5EFE6] via-[#F5EFE6] to-[#8FA57A]/30 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-sm relative overflow-hidden mt-2 border border-white/60">
        <div className="z-10 max-w-xl mb-6 md:mb-0">
          <h2 className="text-4xl font-extrabold text-[#0B4D1E] mb-4">Selamat Datang, {namaWilayah} <span className="text-green-600">🌱</span></h2>
          <p className="text-gray-700 font-medium text-lg mb-8">Kelola transaksi sampah wilayah dengan lebih terstruktur dan transparan.</p>
          <Link to="/input-transaksi" className="inline-flex bg-[#F4A300] text-white px-8 py-4 rounded-full font-bold items-center gap-2 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            Input Transaksi
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </Link>
        </div>
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0 z-10 flex justify-center md:justify-end">
           <img src={bannerImg} alt="Ilustrasi Banner" className="w-full max-w-[280px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500" />
        </div>
      </div>

      {/* KUMPULAN CARDS BEM WILAYAH */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        {[
          { title: 'Total Sampah', value: stats.totalSampah, icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3', badge: 'All Time' },
          { title: 'Nilai Ekonomi', value: stats.nilaiEkonomi, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', badge: 'Total' },
          { title: 'Total Transaksi', value: stats.totalTransaksi, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', badge: 'Selesai' },
          { title: 'Ranking KPI', value: stats.rank, icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z', badge: 'Global' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="p-4 rounded-2xl bg-[#EAE5DA] text-[#0B4D1E]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} /></svg>
              </div>
              <span className="bg-[#E8F5E9] text-[#2E7D32] text-xs font-extrabold px-3 py-1.5 rounded-full">{stat.badge}</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
            <h3 className="text-3xl font-extrabold text-[#0B4D1E] mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div onClick={() => navigate('/laporan')} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2 hover:-translate-y-1 transition-transform duration-300 cursor-pointer group">
          <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-1 group-hover:text-[#F4A300] transition-colors">Aktivitas Bulanan <span className="text-sm font-normal text-gray-400 ml-2">(Klik untuk detail)</span></h3>
          <p className="text-gray-500 text-sm mb-6">Pengumpulan sampah per bulan (kg)</p>
          
          <div className="w-full h-64 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-end justify-between p-4 gap-2">
            {grafikBulanan.map((g, i) => {
               const maxBerat = Math.max(...grafikBulanan.map(x => x.berat), 1);
               const heightPct = Math.max((g.berat / maxBerat) * 100, 2); 
               return (
                 <div key={i} className="flex flex-col items-center justify-end w-full h-full gap-2 group">
                   <div className="w-full bg-[#8FA57A] rounded-t-md relative group-hover:bg-[#F4A300] transition-colors" style={{ height: `${heightPct}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-10">
                        {g.berat / 1000} kg
                      </div>
                   </div>
                   <span className="text-[10px] text-gray-500 font-bold">{g.bulan}</span>
                 </div>
               )
            })}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-100 rounded-lg text-[#F4A300]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </div>
            <h3 className="font-extrabold text-xl text-[#0B4D1E]">Top 3 Wilayah</h3>
          </div>
          
          <div className="space-y-4">
            {top3.map((item, index) => {
              const icons = ['🏆', '🥈', '🥉'];
              const bgs = ['bg-yellow-400', 'bg-gray-400', 'bg-[#CD7F32]'];
              const isMe = item.nama_wilayah === namaWilayah;
              return (
                <div key={index} className={`flex items-center gap-4 p-3 rounded-2xl ${isMe ? 'border-2 border-[#F4A300] bg-orange-50' : 'bg-[#F5EFE6]'}`}>
                  <div className={`w-10 h-10 ${bgs[index]} rounded-full flex items-center justify-center text-white text-xl`}>{icons[index]}</div>
                  <div>
                    <p className="font-bold text-[#0B4D1E]">{item.nama_wilayah} {isMe && <span className="ml-2 bg-[#F4A300] text-white text-[10px] px-2 py-0.5 rounded-full">You</span>}</p>
                    <p className="text-xs text-gray-500">{item.poin_kpi} poin</p>
                  </div>
                </div>
              );
            })}
            {top3.length === 0 && <p className="text-sm text-gray-500 italic text-center py-4">Belum ada data KPI</p>}
          </div>
          <Link to="/leaderboard" className="w-full mt-6 text-sm font-bold text-[#0B4D1E] hover:text-[#F4A300] flex items-center justify-center gap-2">
            Lihat Semua Peringkat <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-center mb-6">
            <h3 className="font-extrabold text-xl text-[#0B4D1E]">Transaksi Terbaru</h3>
            <Link to="/riwayat" className="text-sm font-bold text-[#0B4D1E] hover:text-[#F4A300] flex items-center gap-1 transition-colors">
              Lihat Selengkapnya 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>
          <div className="space-y-4">
            {transaksiTerbaru.map((trx, idx) => (
              <div key={idx} className="flex justify-between items-center bg-[#F5EFE6] p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-gray-100">
                <div><p className="font-bold text-[#0B4D1E]">{trx.nama_kategori} - {trx.berat / 1000} kg</p><p className="text-xs text-gray-500 mt-1">{formatTanggalSingkat(trx.tanggal)} • Oleh: {trx.nama_petugas}</p></div>
                <div className="font-extrabold text-[#0B4D1E]">{formatRp(trx.total_nilai)}</div>
              </div>
            ))}
            {transaksiTerbaru.length === 0 && <p className="text-sm text-gray-500 italic text-center py-4">Belum ada transaksi bulan ini</p>}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-300 flex flex-col">
           <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <h3 className="font-extrabold text-xl text-[#0B4D1E]">Aktivitas</h3>
          </div>
          
          <div className="relative border-l-2 border-gray-100 ml-6 space-y-10 flex-1">
            {aktivitas.map((akt, idx) => (
              <div key={idx} className="relative pl-8">
                <div className={`absolute -left-[19px] top-0 w-9 h-9 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${idx % 2 === 0 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-[#F4A300]'}`}>
                  {idx % 2 === 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  )}
                </div>
                <p className="font-bold text-[#0B4D1E] text-sm">{akt.judul}</p>
                <p className="text-xs text-gray-500 mt-1">{akt.deskripsi}</p>
                <p className="text-xs text-gray-400 mt-1">{akt.waktu}</p>
              </div>
            ))}
            {aktivitas.length === 0 && <p className="text-sm text-gray-500 italic py-4">Belum ada riwayat aktivitas</p>}
          </div>
            <Link to="/aktivitas" className="w-full mt-8 text-sm font-bold text-[#0B4D1E] hover:text-[#F4A300] flex items-center justify-center gap-2 transition-colors">
            Lihat Semua Aktivitas
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
           </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;