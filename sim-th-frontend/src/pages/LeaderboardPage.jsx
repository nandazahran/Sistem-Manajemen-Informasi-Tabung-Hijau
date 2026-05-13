import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

function LeaderboardPage() {
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const periodeList = [
    { label: 'Jan - Feb 2026', start: '2026-01-01', end: '2026-02-28' },
    { label: 'Mar - Apr 2026', start: '2026-03-01', end: '2026-04-30' },
    { label: 'Mei - Jun 2026', start: '2026-05-01', end: '2026-06-30' },
    { label: 'Jul - Ags 2026', start: '2026-07-01', end: '2026-08-31' },
    { label: 'Sep - Okt 2026', start: '2026-09-01', end: '2026-10-31' },
    { label: 'Nov - Des 2026', start: '2026-11-01', end: '2026-12-31' },
  ];

  const [filterPeriode, setFilterPeriode] = useState(periodeList[2]); // Default Mei-Jun
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/dashboard/leaderboard?tanggal_mulai=${filterPeriode.start}&tanggal_akhir=${filterPeriode.end}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resData = await response.json();
        if (resData.status === 'sukses') {
          setLeaderboardData(resData.data);
        }
      } catch (error) {
        console.error("Gagal mengambil leaderboard", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, [filterPeriode]);

  const displayedLeaderboard = isExpanded ? leaderboardData : leaderboardData.slice(0, 5);
  const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

  const juara1 = leaderboardData[0] || null;
  const juara2 = leaderboardData[1] || null;
  const juara3 = leaderboardData[2] || null;

  return (
    <DashboardLayout>
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex items-center justify-between shadow-sm mt-2 mb-8">
        <div className="flex items-center gap-4 text-white">
          <div className="bg-[#F4A300] p-3 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mb-1">Leaderboard KPI</h2>
            <p className="text-green-100/80 font-medium">Peringkat kinerja pengelolaan sampah wilayah</p>
          </div>
        </div>

        {/* FULL CLICKABLE BUTTON FILTER */}
        <div className="relative">
          <button 
            onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
            className="bg-[#F4A300] text-white px-6 py-3.5 rounded-2xl flex items-center gap-3 font-bold shadow-md hover:bg-[#d68e00] transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {filterPeriode.label}
          </button>
          
          {isMonthPickerOpen && (
            <div className="absolute top-full mt-3 right-0 w-80 bg-white p-4 rounded-[2rem] shadow-2xl border border-gray-100 z-50 grid grid-cols-2 gap-2">
              {periodeList.map((prd) => (
                <button 
                  key={prd.label} 
                  onClick={() => { setFilterPeriode(prd); setIsMonthPickerOpen(false); }}
                  className={`py-3 rounded-xl text-xs font-bold transition-all text-center ${filterPeriode.label === prd.label ? 'bg-[#0B4D1E] text-white' : 'bg-[#F5EFE6] text-[#0B4D1E] hover:bg-[#F4A300] hover:text-white'}`}
                >
                  {prd.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TOP 3 PODIUM DENGAN ANIMASI HOVER */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-center items-end gap-6 h-72">
          
          {/* Posisi 2 */}
          <div className="w-48 bg-[#F5EFE6] rounded-t-[2.5rem] h-52 relative flex flex-col items-center justify-end pb-8 border border-gray-200 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <div className="absolute -top-7 bg-gray-400 p-2.5 rounded-full border-4 border-white shadow-md group-hover:scale-110 transition-transform">
              <span className="text-xl">🥈</span>
            </div>
            <h4 className="text-4xl font-extrabold text-[#0B4D1E]">2</h4>
            <p className="font-bold text-[#0B4D1E] mt-1 text-center">{juara2 ? juara2.nama_wilayah : '-'}</p>
            <p className="text-2xl font-extrabold text-[#0B4D1E] mt-2">{juara2 ? juara2.poin_kpi : 0} <span className="text-xs font-medium">poin</span></p>
          </div>

          {/* Posisi 1 (Paling Tinggi) */}
          <div className="w-56 bg-[#FDF6EA] rounded-t-[2.5rem] h-64 relative flex flex-col items-center justify-end pb-10 border-2 border-[#F4A300] hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 group cursor-pointer z-10 shadow-lg">
            <div className="absolute -top-10 bg-[#F4A300] p-4 rounded-2xl border-4 border-white shadow-md group-hover:scale-110 transition-transform">
              <span className="text-3xl">🏆</span>
            </div>
            <h4 className="text-5xl font-extrabold text-[#F4A300]">1</h4>
            <p className="font-bold text-[#0B4D1E] text-lg mt-1 text-center">{juara1 ? juara1.nama_wilayah : '-'}</p>
            <p className="text-3xl font-extrabold text-[#0B4D1E] mt-2">{juara1 ? juara1.poin_kpi : 0} <span className="text-sm font-medium">poin</span></p>
          </div>

          {/* Posisi 3 (YOU) */}
          <div className="w-48 bg-white rounded-t-[2.5rem] h-44 relative flex flex-col items-center justify-end pb-8 border-2 border-[#F4A300] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <div className="absolute -top-7 bg-[#CD7F32] p-2.5 rounded-full border-4 border-white shadow-md group-hover:scale-110 transition-transform">
              <span className="text-xl">🥉</span>
            </div>
            <h4 className="text-4xl font-extrabold text-[#F4A300]">3</h4>
            <p className="font-bold text-[#0B4D1E] mt-1 text-center">{juara3 ? juara3.nama_wilayah : '-'}</p>
            <span className="bg-transparent text-transparent text-[10px] px-3 py-0.5 rounded-full mb-1 font-bold select-none">-</span>
            <p className="text-2xl font-extrabold text-[#0B4D1E]">{juara3 ? juara3.poin_kpi : 0} <span className="text-xs font-medium">poin</span></p>
          </div>
        </div>
      </div>

      {/* TABEL PERINGKAT */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
        <table className="w-full text-left">
          <thead className="bg-[#F5EFE6] text-[#0B4D1E]">
            <tr>
              <th className="px-8 py-5 font-bold">Peringkat</th>
              <th className="px-8 py-5 font-bold">Wilayah</th>
              <th className="px-8 py-5 font-bold">Poin KPI</th>
              <th className="px-8 py-5 font-bold">Total Berat</th>
              <th className="px-8 py-5 font-bold">Nilai Ekonomi</th>
              <th className="px-8 py-5 font-bold">Perubahan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayedLeaderboard.map((item) => (
              <tr key={item.peringkat} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-5 font-bold text-gray-500">#{item.peringkat}</td>
                <td className="px-8 py-5 font-bold text-[#0B4D1E]">{item.nama_wilayah}</td>
                <td className="px-8 py-5 font-extrabold text-[#0B4D1E] text-xl">{item.poin_kpi}</td>
                <td className="px-8 py-5 text-gray-600 font-medium">{item.total_berat_gram / 1000} kg</td>
                <td className="px-8 py-5 font-bold text-[#0B4D1E]">{formatRp(item.total_rupiah)}</td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                    -
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-[#0B4D1E] font-bold hover:text-[#F4A300] flex items-center gap-2 mx-auto">
             {isExpanded ? 'Tutup Peringkat ↑' : 'Lihat Semua Peringkat ↓'}
          </button>
        </div>
      </div>

      <div className="bg-[#EAE5DA] p-8 rounded-3xl mb-8 border border-[#0B4D1E]/10">
        <h3 className="font-extrabold text-[#0B4D1E] flex items-center gap-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> Cara Menghitung Poin KPI
        </h3>
        <ul className="text-sm text-[#0B4D1E]/80 space-y-2 font-medium">
          <li>• Total input berat sampah secara relatif (Maksimal 40 Poin)</li>
          <li>• Total nilai ekonomi/pendapatan secara relatif (Maksimal 30 Poin)</li>
          <li>• Kualitas pemilahan sampah: Bersih/Terpilah (Maksimal 30 Poin)</li>
        </ul>
      </div>
    </DashboardLayout>
  );
}

export default LeaderboardPage;