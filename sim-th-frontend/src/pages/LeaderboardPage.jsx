import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

function LeaderboardPage() {
  const [filterBulan, setFilterBulan] = useState('2026-05');
  const [isExpanded, setIsExpanded] = useState(false); // State buat buka-tutup 5 peringkat

  // Dummy Data Lengkap
  const fullLeaderboard = [
    { rank: 1, name: 'BEM FAPET', poin: 925, berat: '580 kg', nilai: 'Rp 1.450.000', change: '↑ 2' },
    { rank: 2, name: 'BEM FEM', poin: 890, berat: '550 kg', nilai: 'Rp 1.350.000', change: '- 0' },
    { rank: 3, name: 'BEM FATETA', poin: 875, berat: '520 kg', nilai: 'Rp 1.250.000', change: '↑ 1' },
    { rank: 4, name: 'BEM FAHUTAN', poin: 820, berat: '480 kg', nilai: 'Rp 1.100.000', change: '↓ 1' },
    { rank: 5, name: 'BEM FPIK', poin: 780, berat: '450 kg', nilai: 'Rp 980.000', change: '↑ 2' },
    { rank: 6, name: 'BEM FEMA', poin: 745, berat: '420 kg', nilai: 'Rp 890.000', change: '↓ 1' },
    { rank: 7, name: 'BEM FMIPA', poin: 720, berat: '400 kg', nilai: 'Rp 850.000', change: '- 0' },
    { rank: 8, name: 'Ormawa Eksekutif PPKU', poin: 685, berat: '370 kg', nilai: 'Rp 780.000', change: '↑ 1' },
    { rank: 9, name: 'DUI', poin: 650, berat: '300 kg', nilai: 'Rp 650.000', change: '↓ 2' },
    { rank: 10, name: 'BEM KM IPB', poin: 600, berat: '280 kg', nilai: 'Rp 600.000', change: '- 0' },
  ];

  // Logic: Kalau 'isExpanded' true, tampilin semua. Kalau false, potong cuma 5 teratas.
  const displayedLeaderboard = isExpanded ? fullLeaderboard : fullLeaderboard.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="bg-[#0B4D1E] rounded-3xl p-10 flex items-center justify-between shadow-sm mt-2 mb-8">
        <div className="flex items-center gap-4 text-white">
          <div className="bg-[#F4A300] p-3 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mb-1">Leaderboard KPI</h2>
            <p className="text-green-100/80 font-medium">Peringkat wilayah berdasarkan kinerja pengelolaan sampah</p>
          </div>
        </div>
        <div className="bg-[#F4A300] px-4 py-2 rounded-xl flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <input type="month" value={filterBulan} onChange={(e)=>setFilterBulan(e.target.value)} className="bg-transparent border-none text-white font-bold outline-none cursor-pointer" />
        </div>
      </div>

      {/* TOP 3 PODIUM */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 text-center">
        <h3 className="font-extrabold text-[#0B4D1E] text-xl mb-8 flex items-center justify-center gap-2">
          <span className="w-4 h-4 bg-[#0B4D1E] rounded-sm"></span> Top 3 Wilayah Terbaik <span className="w-4 h-4 bg-[#0B4D1E] rounded-sm"></span>
        </h3>
        <div className="flex justify-center items-end gap-6 h-64">
          {/* Posisi 2 */}
          <div className="w-48 bg-[#F5EFE6] border-2 border-gray-200 rounded-t-3xl h-48 relative flex flex-col items-center justify-end pb-6">
            <div className="absolute -top-6 bg-gray-400 p-2 rounded-full border-4 border-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg></div>
            <h4 className="text-3xl font-extrabold text-[#0B4D1E]">2</h4>
            <p className="font-bold text-[#0B4D1E] mt-1">BEM FEM</p>
            <p className="text-2xl font-extrabold text-[#0B4D1E] mt-2">890 <span className="text-xs font-medium">poin</span></p>
          </div>
          {/* Posisi 1 */}
          <div className="w-56 bg-[#FDF6EA] border-4 border-[#F4A300] rounded-t-3xl h-56 relative flex flex-col items-center justify-end pb-6 shadow-lg z-10">
            <div className="absolute -top-10 bg-[#F4A300] p-4 rounded-xl border-4 border-white shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg></div>
            <h4 className="text-4xl font-extrabold text-[#F4A300]">1</h4>
            <p className="font-bold text-[#0B4D1E] mt-1">BEM FAPET</p>
            <p className="text-3xl font-extrabold text-[#0B4D1E] mt-2">925 <span className="text-xs font-medium">poin</span></p>
          </div>
          {/* Posisi 3 (YOU) */}
          <div className="w-48 bg-white border-4 border-[#F4A300] rounded-t-3xl h-44 relative flex flex-col items-center justify-end pb-6">
            <div className="absolute -top-6 bg-[#CD7F32] p-2 rounded-full border-4 border-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg></div>
            <h4 className="text-3xl font-extrabold text-[#F4A300]">3</h4>
            <p className="font-bold text-[#0B4D1E] mt-1">BEM FATETA</p>
            <span className="bg-[#F4A300] text-white text-[10px] px-2 py-0.5 rounded-full mb-1">Wilayah Anda</span>
            <p className="text-2xl font-extrabold text-[#0B4D1E]">875 <span className="text-xs font-medium">poin</span></p>
          </div>
        </div>
      </div>

      {/* SEMUA PERINGKAT DENGAN FITUR EXPAND (TAMPIL 5 AJA DEFAULT) */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-8 border-b border-gray-100">
          <h3 className="font-extrabold text-[#0B4D1E] text-xl">Semua Peringkat</h3>
          <p className="text-gray-500 text-sm">Periode: Mei 2026</p>
        </div>
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
              <tr key={item.rank} className={`${item.name === 'BEM FATETA' ? 'bg-orange-50/50' : 'hover:bg-gray-50'}`}>
                <td className="px-8 py-5">
                  {item.rank <= 3 ? (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${item.rank===1 ? 'bg-[#F4A300]' : item.rank===2 ? 'bg-gray-400' : 'bg-[#CD7F32]'}`}>
                      {item.rank === 1 ? '👑' : '🏅'}
                    </div>
                  ) : (
                    <span className="font-bold text-gray-500 ml-3">#{item.rank}</span>
                  )}
                </td>
                <td className="px-8 py-5 font-bold text-[#0B4D1E]">
                  {item.name} {item.name === 'BEM FATETA' && <span className="ml-2 bg-[#F4A300] text-white text-[10px] px-2 py-0.5 rounded-full">You</span>}
                </td>
                <td className="px-8 py-5 font-extrabold text-[#0B4D1E] text-xl">{item.poin}</td>
                <td className="px-8 py-5 text-gray-600 font-medium">{item.berat}</td>
                <td className="px-8 py-5 font-bold text-[#0B4D1E]">{item.nilai}</td>
                <td className="px-8 py-5">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.change.includes('↑') ? 'bg-green-100 text-green-700' : item.change.includes('↓') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                    {item.change}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* TOMBOL EXPAND / COLLAPSE */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="flex items-center justify-center gap-2 mx-auto text-[#0B4D1E] font-bold hover:text-[#F4A300] transition-colors py-2 px-4 rounded-full hover:bg-white"
          >
            {isExpanded ? (
              <>Tutup Sisa Peringkat <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></>
            ) : (
              <>Tampilkan Semua Peringkat <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></>
            )}
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