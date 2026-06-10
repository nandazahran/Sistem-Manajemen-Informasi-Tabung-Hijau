import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

function AktivitasAdminPage() {
  // State untuk search & filter
  const [search, setSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterWaktu, setFilterWaktu] = useState('Semua Waktu');
  const [aktivitasList, setAktivitasList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAktivitas = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${import.meta.env.VITE_API_URL}/transaksi`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resData = await response.json();

        if (resData.status === 'sukses') {
          // Format data transaksi menjadi aktivitas
          const mapped = resData.data.sort((a, b) => b.id - a.id).map(t => {
            const dateObj = new Date(t.tanggal);
            const timeStr = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            return {
              id: t.id,
              tipe: 'transaksi',
              judul: 'Transaksi baru dicatat',
              deskripsi: `${t.nama_wilayah} - ${t.nama_kategori} ${t.berat / 1000}kg senilai Rp ${t.total_nilai.toLocaleString('id-ID')}`,
              waktu: timeStr,
              tanggalAsli: t.tanggal,
              ikon: 'M5 13l4 4L19 7',
              warnaBg: 'bg-green-100',
              warnaTeks: 'text-green-600'
            };
          });
          setAktivitasList(mapped);
        }
      } catch (error) {
        console.error("Gagal mengambil data aktivitas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAktivitas();
  }, []);
  
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

      {/* FILTER CARD WRAPPER */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
        {/* Searchbar */}
        <div className="relative flex-1 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari aktivitas..." 
            className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow" 
          />
        </div>
        
        {/* DROPDOWN FILTER WAKTU (KONSISTEN) */}
        <div className="relative w-full md:w-64">
          <div 
            onClick={() => setIsFilterOpen(!isFilterOpen)} 
            className="bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl cursor-pointer flex justify-between items-center hover:bg-[#EAE5DA] transition-colors h-[56px]"
          >
            <span className="truncate">{filterWaktu}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
          
          {isFilterOpen && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden py-1">
              {filterOptions.map(opt => (
                <div 
                  key={opt} 
                  onClick={() => { setFilterWaktu(opt); setIsFilterOpen(false); }} 
                  className={`px-5 py-2.5 cursor-pointer text-sm font-bold transition-colors ${filterWaktu === opt ? 'bg-[#0B4D1E] text-white' : 'text-[#0B4D1E] hover:bg-[#0B4D1E] hover:text-white'}`}
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
        <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6 border-b border-gray-100 pb-4">Seluruh Aktivitas</h3>
        {isLoading ? (
          <div className="text-center text-gray-500 py-10 font-medium animate-pulse">Memuat riwayat aktivitas...</div>
        ) : (
          <div className="space-y-6">
            {aktivitasList.filter(a => {
               // 1. Text Search Filter
               const matchSearch = a.deskripsi.toLowerCase().includes(search.toLowerCase()) || a.judul.toLowerCase().includes(search.toLowerCase());
               if (!matchSearch) return false;

               // 2. Date Filter
               if (filterWaktu === 'Semua Waktu' || !a.tanggalAsli) return true;
               
               const d = new Date(a.tanggalAsli);
               const now = new Date();
               
               if (filterWaktu === 'Hari Ini') {
                  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
               }
               if (filterWaktu === 'Kemarin') {
                  const yesterday = new Date(now);
                  yesterday.setDate(now.getDate() - 1);
                  return d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth() && d.getFullYear() === yesterday.getFullYear();
               }
               if (filterWaktu === 'Bulan Ini') {
                  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
               }
               return true;
            }).map((item, idx) => (
              <div key={item.id || idx} className="flex gap-4">
                <div className={`${item.warnaBg} p-3 rounded-full ${item.warnaTeks} h-12 w-12 flex items-center justify-center hover:scale-110 transition-transform`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.ikon} /></svg>
                </div>
                <div>
                  <p className="font-bold text-[#0B4D1E]">{item.judul}</p>
                  <p className="text-xs text-gray-500 font-medium">{item.deskripsi}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">{item.waktu}</p>
                </div>
              </div>
            ))}
            {aktivitasList.length === 0 && <p className="text-center text-gray-500 text-sm py-4">Belum ada aktivitas terekam.</p>}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AktivitasAdminPage;