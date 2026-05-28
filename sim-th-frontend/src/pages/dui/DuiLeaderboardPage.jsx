import React, { useState } from 'react';
import DuiLayout from '../../components/DuiLayout';

function DuiLeaderboardPage() {
  const [isExpanded, setIsExpanded] = useState(false);

  const leaderboardData = [
    { rank: 1, wilayah: 'BEM FATETA', kpi: 925, input: '385 kg', nilai: 'Rp 1.250k', trend: 'up' },
    { rank: 2, wilayah: 'BEM FAPET', kpi: 890, input: '360 kg', nilai: 'Rp 1.180k', trend: 'up' },
    { rank: 3, wilayah: 'BEM FEM', kpi: 875, input: '340 kg', nilai: 'Rp 1.100k', trend: 'flat' },
    { rank: 4, wilayah: 'BEM FAHUTAN', kpi: 820, input: '310 kg', nilai: 'Rp 950k', trend: 'down' },
    { rank: 5, wilayah: 'BEM FPIK', kpi: 780, input: '285 kg', nilai: 'Rp 850k', trend: 'flat' },
    { rank: 6, wilayah: 'BEM FMIPA', kpi: 750, input: '260 kg', nilai: 'Rp 780k', trend: 'up' },
    { rank: 7, wilayah: 'BEM FEMA', kpi: 720, input: '240 kg', nilai: 'Rp 720k', trend: 'down' },
    { rank: 8, wilayah: 'BEM FESB', kpi: 680, input: '210 kg', nilai: 'Rp 650k', trend: 'flat' },
  ];

  const visibleData = isExpanded ? leaderboardData.slice(3) : leaderboardData.slice(3, 5); 

  return (
    <DuiLayout>
      {/* BANNER */}
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm mt-2 mb-8">
        <div className="flex items-center gap-5 text-white mb-6 md:mb-0">
          <div className="bg-[#F4A300] p-4 rounded-2xl"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg></div>
          <div><h2 className="text-3xl font-extrabold mb-1">Leaderboard KPI Wilayah</h2><p className="text-green-100/80 font-medium">Peringkat kinerja wilayah berdasarkan KPI</p></div>
        </div>
        <select className="bg-[#F4A300] text-white px-6 py-3.5 rounded-xl font-bold outline-none cursor-pointer"><option>Mei 2026</option><option>April 2026</option></select>
      </div>

      {/* TOP 3 PODIUM */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
        <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-8">Top 3 Wilayah</h3>
        <div className="flex flex-col md:flex-row justify-center items-end gap-4 h-72 px-4 mb-10">
          {/* #2 Rank (Silver) */}
          <div className="w-full md:w-1/3 bg-[#E2E8F0] rounded-t-3xl h-[75%] flex flex-col items-center justify-center text-[#0B4D1E] relative shadow-lg">
            <div className="absolute -top-6 bg-white p-2 rounded-full shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg></div>
            <h2 className="text-4xl font-extrabold mb-1">#2</h2><p className="font-bold text-lg">{leaderboardData[1].wilayah}</p><p className="text-sm font-medium opacity-90 mt-1">KPI: {leaderboardData[1].kpi}</p>
          </div>
          {/* #1 Rank (Emas) */}
          <div className="w-full md:w-1/3 bg-[#F4A300] rounded-t-3xl h-full flex flex-col items-center justify-center text-white relative shadow-2xl z-10">
            <div className="absolute -top-8 bg-white p-3 rounded-full shadow-md"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#F4A300]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" /></svg></div>
            <h2 className="text-5xl font-extrabold mb-1">#1</h2><p className="font-bold text-xl">{leaderboardData[0].wilayah}</p><p className="text-sm font-medium opacity-90 mt-1">KPI: {leaderboardData[0].kpi}</p>
          </div>
          {/* #3 Rank (Bronze) */}
          <div className="w-full md:w-1/3 bg-[#CD7F32] rounded-t-3xl h-[60%] flex flex-col items-center justify-center text-white relative shadow-lg">
            <div className="absolute -top-6 bg-white p-2 rounded-full shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#CD7F32]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg></div>
            <h2 className="text-4xl font-extrabold mb-1">#3</h2><p className="font-bold text-lg">{leaderboardData[2].wilayah}</p><p className="text-sm font-medium opacity-90 mt-1">KPI: {leaderboardData[2].kpi}</p>
          </div>
        </div>
      </div>

      {/* RANKING LENGKAP TABLE */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-6 p-2">
        <h3 className="font-extrabold text-xl text-[#0B4D1E] m-6">Ranking Lengkap</h3>
        <table className="w-full text-left border-collapse">
          <thead className="bg-transparent text-[#0B4D1E]">
            <tr><th className="px-8 py-5 font-bold">Rank</th><th className="px-8 py-5 font-bold">Wilayah</th><th className="px-8 py-5 font-bold">KPI</th><th className="px-8 py-5 font-bold">Total Input (kg)</th><th className="px-8 py-5 font-bold">Nilai Ekonomi</th><th className="px-8 py-5 font-bold text-center">Trend</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visibleData.map((w) => (
              <tr key={w.rank} className="hover:bg-gray-50">
                <td className="px-8 py-5"><div className="w-8 h-8 bg-[#F5EFE6] rounded-full flex items-center justify-center font-extrabold text-[#0B4D1E]">{w.rank}</div></td>
                <td className="px-8 py-5 font-extrabold text-[#0B4D1E]">{w.wilayah}</td><td className="px-8 py-5 font-extrabold text-[#F4A300]">{w.kpi}</td><td className="px-8 py-5 font-bold text-[#0B4D1E]">{w.input}</td><td className="px-8 py-5 font-extrabold text-green-600">{w.nilai}</td>
                <td className="px-8 py-5 flex justify-center">
                  {w.trend === 'up' && <div className="p-1.5 bg-green-100 text-green-600 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></div>}
                  {w.trend === 'down' && <div className="p-1.5 bg-red-100 text-red-600 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg></div>}
                  {w.trend === 'flat' && <div className="p-1.5 bg-gray-100 text-gray-500 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg></div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* EXPAND BUTTON */}
        {!isExpanded && (
           <div className="text-center p-4 border-t border-gray-100">
             <button onClick={() => setIsExpanded(true)} className="text-[#0B4D1E] font-bold text-sm hover:underline flex items-center justify-center gap-2 w-full mt-2">
               Tampilkan Lebih Banyak 
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
             </button>
           </div>
        )}
      </div>

    </DuiLayout>
  );
}

export default DuiLeaderboardPage;