import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

function AktivitasAdminPage() {
  // State untuk search & filter
  const [search, setSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterWaktu, setFilterWaktu] = useState('Semua Waktu');
  
  const filterOptions = ['Semua Waktu', 'Hari Ini', 'Kemarin', '7 Hari Terakhir', 'Bulan Ini'];

  return (
    <AdminLayout>
      {/* BANNER */}
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex items-center gap-5 text-white mt-2 mb-8 shadow-sm">
        <div className="bg-[#F4A300] p-4 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold mb-1">Semua Aktivitas Sistem</h2>
          <p className="text-green-100/80 font-medium">Timeline lengkap aktivitas dan event sistem</p>
        </div>
      </div>

      {/* FILTER CARD WRAPPER (Sama kayak BEM Wilayah) */}
      <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 flex gap-4 mb-8">
        {/* Searchbar */}
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari aktivitas..." 
            className="w-full h-12 bg-[#F5EFE6] px-14 rounded-xl border border-transparent focus:border-[#0B4D1E]/20 focus:outline-none focus:ring-0 font-medium text-[#0B4D1E] transition-all" 
          />
        </div>
        
        {/* DROPDOWN FILTER WAKTU */}
        <div className="relative min-w-[160px]">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)} 
            className="w-full h-12 bg-white px-6 rounded-xl border-2 border-[#0B4D1E] text-[#0B4D1E] font-extrabold hover:bg-[#F5EFE6] transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            {filterWaktu}
          </button>
          
          {isFilterOpen && (
            <div className="absolute top-full right-0 mt-3 w-56 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-50">
              {filterOptions.map(opt => (
                <div 
                  key={opt} 
                  onClick={() => { setFilterWaktu(opt); setIsFilterOpen(false); }} 
                  className={`px-5 py-3.5 cursor-pointer text-sm font-bold transition-colors ${filterWaktu === opt ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'text-[#0B4D1E] hover:bg-[#F5EFE6]'}`}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* LIST AKTIVITAS */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
        <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6 border-b border-gray-100 pb-4">Hari Ini</h3>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="bg-green-100 p-3 rounded-full text-green-600 h-12 w-12 flex items-center justify-center hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p className="font-bold text-[#0B4D1E]">Transaksi baru masuk</p>
              <p className="text-xs text-gray-500 font-medium">BEM FATETA - Plastik 25kg</p>
              <p className="text-[10px] text-gray-400 font-bold mt-1">5 menit lalu</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 h-12 w-12 flex items-center justify-center hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div>
              <p className="font-bold text-[#0B4D1E]">User baru ditambahkan</p>
              <p className="text-xs text-gray-500 font-medium">BEM FAPET berhasil didaftarkan</p>
              <p className="text-[10px] text-gray-400 font-bold mt-1">15 menit lalu</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AktivitasAdminPage;