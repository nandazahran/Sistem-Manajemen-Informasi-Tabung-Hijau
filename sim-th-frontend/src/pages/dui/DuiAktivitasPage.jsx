import React, { useState } from 'react';
import DuiLayout from '../../components/DuiLayout';

function DuiAktivitasPage() {
  // State untuk Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWaktu, setFilterWaktu] = useState('Semua Waktu');
  const [isWaktuOpen, setIsWaktuOpen] = useState(false);

  return (
    <DuiLayout>
      {/* BANNER UTAMA */}
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex items-center gap-5 text-white mt-2 mb-8 shadow-sm">
        <div className="bg-[#F4A300] p-4 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold mb-1">Semua Aktivitas Sistem</h2>
          <p className="text-green-100/80 font-medium">Timeline lengkap aktivitas dan event sistem</p>
        </div>
      </div>

      {/* FILTER & SEARCHBAR KONSISTEN (CARD TERPISAH) */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Cari aktivitas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow" 
          />
        </div>
        
        {/* Custom Dropdown Filter Waktu */}
        <div className="relative w-full md:w-64">
          <div 
            onClick={() => setIsWaktuOpen(!isWaktuOpen)} 
            className="bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl cursor-pointer flex justify-between items-center hover:bg-[#EAE5DA] transition-colors h-[56px]"
          >
            <span className="truncate">{filterWaktu}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
          {isWaktuOpen && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden py-1">
              {['Semua Waktu', 'Hari Ini', 'Kemarin', '7 Hari Terakhir', 'Bulan Ini'].map(opt => (
                <div 
                  key={opt} 
                  onClick={() => { setFilterWaktu(opt); setIsWaktuOpen(false); }} 
                  className={`px-5 py-2.5 cursor-pointer text-sm font-bold transition-colors ${filterWaktu === opt ? 'bg-[#0B4D1E] text-white' : 'text-[#0B4D1E] hover:bg-[#0B4D1E] hover:text-white'}`}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TIMELINE AKTIVITAS (CARD TERPISAH) */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
        <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6 border-b border-gray-100 pb-4">Hari Ini</h3>
        
        <div className="space-y-6">
          <div className="flex gap-4 group">
            <div className="bg-green-100 p-3 rounded-full text-green-600 h-12 w-12 flex items-center justify-center group-hover:scale-110 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
            <div>
              <p className="font-bold text-[#0B4D1E]">Transaksi baru masuk</p>
              <p className="text-xs text-gray-500">BEM FATETA - Plastik 25kg</p>
              <p className="text-[10px] text-gray-400 font-bold mt-1">5 menit lalu</p>
            </div>
          </div>
          
          <div className="flex gap-4 group">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 h-12 w-12 flex items-center justify-center group-hover:scale-110 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>
            <div>
              <p className="font-bold text-[#0B4D1E]">User baru ditambahkan</p>
              <p className="text-xs text-gray-500">BEM FAPET berhasil didaftarkan</p>
              <p className="text-[10px] text-gray-400 font-bold mt-1">15 menit lalu</p>
            </div>
          </div>
          
          <div className="flex gap-4 group">
            <div className="bg-yellow-100 p-3 rounded-full text-yellow-600 h-12 w-12 flex items-center justify-center group-hover:scale-110 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div>
            <div>
              <p className="font-bold text-[#0B4D1E]">Kategori harga diperbarui</p>
              <p className="text-xs text-gray-500">Plastik: Rp 4.500/kg</p>
              <p className="text-[10px] text-gray-400 font-bold mt-1">1 jam lalu</p>
            </div>
          </div>
        </div>
      </div>
    </DuiLayout>
  );
}

export default DuiAktivitasPage;