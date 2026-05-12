import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-r from-[#F5EFE6] via-[#F5EFE6] to-[#8FA57A]/30 rounded-3xl p-12 flex items-center justify-between shadow-sm relative overflow-hidden mt-2 border border-white/60">
        <div className="z-10 max-w-xl">
          <h2 className="text-4xl font-extrabold text-[#0B4D1E] mb-4">Selamat Datang, BEM FATETA <span className="text-green-600">🌱</span></h2>
          <p className="text-gray-700 font-medium text-lg mb-8">Kelola transaksi sampah wilayah dengan lebih terstruktur dan transparan.</p>
          {/* Link ke Input Transaksi */}
          <Link to="/input-transaksi" className="inline-flex bg-[#F4A300] text-white px-8 py-4 rounded-full font-bold items-center gap-2 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            Input Transaksi
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </Link>
        </div>
        <div className="w-96 h-48 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 flex items-center justify-center z-10 shadow-sm">
           <span className="text-sm font-bold text-[#0B4D1E]">Ilustrasi Bank Sampah</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        {[
          { title: 'Total Sampah', value: '520 kg', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3', color: 'text-[#0B4D1E]', bg: 'bg-[#EAE5DA]', badge: '+12%' },
          { title: 'Nilai Ekonomi', value: 'Rp 1.250.000', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-[#F4A300]', bg: 'bg-[#FDF6EA]', badge: '+8%' },
          { title: 'Total Transaksi', value: '128', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'text-[#0B4D1E]', bg: 'bg-[#EAE5DA]', badge: '+15%' },
          { title: 'Ranking KPI', value: '#3 Wilayah', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z', color: 'text-[#0B4D1E]', bg: 'bg-[#EAE5DA]', badge: '↑ 1' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} /></svg>
              </div>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">{stat.badge}</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
            <h3 className="text-3xl font-extrabold text-[#0B4D1E] mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Grafik diklik pindah ke Laporan */}
        <div onClick={() => navigate('/laporan')} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2 hover:-translate-y-1 transition-transform duration-300 cursor-pointer group">
          <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-1 group-hover:text-[#F4A300] transition-colors">Aktivitas Bulanan <span className="text-sm font-normal text-gray-400 ml-2">(Klik untuk detail)</span></h3>
          <p className="text-gray-500 text-sm mb-6">Pengumpulan sampah per bulan (kg)</p>
          <div className="w-full h-64 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center">
            <p className="text-gray-400 font-medium">Grafik Line Chart</p>
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
            {/* Medali & Piala Icon */}
            <div className="flex items-center gap-4 bg-[#F5EFE6] p-3 rounded-2xl">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xl">🏆</div>
              <div><p className="font-bold text-[#0B4D1E]">BEM FAPET</p><p className="text-xs text-gray-500">925 poin</p></div>
            </div>
            <div className="flex items-center gap-4 bg-[#F5EFE6] p-3 rounded-2xl">
              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white text-xl">🥈</div>
              <div><p className="font-bold text-[#0B4D1E]">BEM FEM</p><p className="text-xs text-gray-500">890 poin</p></div>
            </div>
            <div className="flex items-center gap-4 border-2 border-[#F4A300] p-3 rounded-2xl relative bg-orange-50">
              <div className="w-10 h-10 bg-[#CD7F32] rounded-full flex items-center justify-center text-white text-xl">🥉</div>
              <div>
                <p className="font-bold text-[#0B4D1E]">BEM FATETA <span className="ml-2 bg-[#F4A300] text-white text-[10px] px-2 py-0.5 rounded-full">You</span></p>
                <p className="text-xs text-gray-500">875 poin</p>
              </div>
            </div>
          </div>
          {/* Link ke Leaderboard */}
          <Link to="/leaderboard" className="w-full mt-6 text-sm font-bold text-[#0B4D1E] hover:text-[#F4A300] flex items-center justify-center gap-2">
            Lihat Semua Peringkat <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-extrabold text-xl text-[#0B4D1E]">Transaksi Terbaru</h3>
            {/* Link ke Riwayat */}
            <Link to="/riwayat" className="text-sm font-bold text-[#0B4D1E] hover:text-[#F4A300]">Lihat Selengkapnya →</Link>
          </div>
          <div className="space-y-4">
            {[
              { type: 'Plastik - 25 kg', date: '9 Mei 2026', price: 'Rp 50.000' },
              { type: 'Kertas - 15 kg', date: '8 Mei 2026', price: 'Rp 25.000' },
              { type: 'Logam - 10 kg', date: '7 Mei 2026', price: 'Rp 75.000' },
              { type: 'Plastik - 20 kg', date: '6 Mei 2026', price: 'Rp 40.000' }
            ].map((trx, idx) => (
              <div key={idx} className="flex justify-between items-center bg-[#F5EFE6] p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-gray-100">
                <div><p className="font-bold text-[#0B4D1E]">{trx.type}</p><p className="text-xs text-gray-500 mt-1">{trx.date}</p></div>
                <div className="font-extrabold text-[#0B4D1E]">{trx.price}</div>
              </div>
            ))}
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
            <div className="relative pl-8">
              <div className="absolute -left-[19px] top-0 w-9 h-9 bg-green-100 text-green-600 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </div>
              <p className="font-bold text-[#0B4D1E] text-sm">Transaksi plastik ditambahkan</p>
              <p className="text-xs text-gray-500 mt-1">+25kg plastik dicatat</p>
              <p className="text-xs text-gray-400 mt-1">5 menit lalu</p>
            </div>
            <div className="relative pl-8">
              <div className="absolute -left-[19px] top-0 w-9 h-9 bg-yellow-100 text-[#F4A300] rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
              <p className="font-bold text-[#0B4D1E] text-sm">Saldo wilayah bertambah</p>
              <p className="text-xs text-gray-400 mt-1">2 jam lalu</p>
            </div>
          </div>
          {/* Link ke Aktivitas */}
          <Link to="/aktivitas" className="w-full mt-8 text-sm font-bold text-[#0B4D1E] hover:text-[#F4A300] flex items-center justify-center gap-2">
            Lihat Semua Aktivitas →
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;