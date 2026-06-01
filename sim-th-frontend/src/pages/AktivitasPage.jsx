import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

function AktivitasPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterWaktu, setFilterWaktu] = useState('Filter');
  const [aktivitasData, setAktivitasData] = useState([]);
  
  const filterOptions = ['Semua Waktu', 'Hari Ini', 'Kemarin', '7 Hari Terakhir', 'Bulan Ini'];

  useEffect(() => {
    const fetchAktivitas = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/transaksi`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resData = await response.json();
        
        if (resData.status === 'sukses') {
          setAktivitasData(resData.data.sort((a, b) => b.id - a.id));
        }
      } catch (error) {
        console.error("Gagal mengambil data aktivitas:", error);
      }
    };

    fetchAktivitas();
  }, []);

  const formatTanggalWaktu = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardLayout>
      <div className="bg-[#0B4D1E] rounded-3xl p-10 flex items-center gap-4 text-white shadow-sm mt-2 mb-8">
        <div className="bg-[#F4A300] p-3 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold mb-1">Aktivitas Terbaru</h2>
          <p className="text-green-100/80 font-medium">Timeline aktivitas dan riwayat sistem wilayah Anda</p>
        </div>
      </div>

      {/* FILTER CARD WRAPPER (Sesuai Gambar 1) */}
      <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 flex gap-4 mb-8">
        {/* Searchbar */}
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
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

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-6">
        <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-8">Semua Aktivitas</h3>
        <div className="relative border-l-2 border-gray-100 ml-6 space-y-10">
          {aktivitasData.map((akt, idx) => (
            <div key={akt.id} className="relative pl-8 group">
              <div className={`absolute -left-[19px] top-0 w-9 h-9 rounded-full border-4 border-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${idx % 2 === 0 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-[#F4A300]'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-[#0B4D1E] text-base group-hover:text-[#F4A300] transition-colors">Transaksi {akt.nama_kategori} berhasil dicatat</p>
                  <p className="text-sm text-gray-500 font-medium mt-1">+{akt.berat / 1000}kg ditambahkan oleh {akt.nama_petugas}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatTanggalWaktu(akt.tanggal)} • Wilayah {akt.nama_wilayah}</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          ))}
          {aktivitasData.length === 0 && <p className="text-gray-500 font-bold">Belum ada aktivitas di sistem ini.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AktivitasPage;