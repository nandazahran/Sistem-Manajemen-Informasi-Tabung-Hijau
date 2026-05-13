import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

function RiwayatTransaksiPage() {
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterBulan, setFilterBulan] = useState('');
  const [filterTahun, setFilterTahun] = useState(2026);
  const [selectedTrx, setSelectedTrx] = useState(null); 
  
  // State untuk buka-tutup custom picker bulan
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const bulanList = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

  const [riwayatData, setRiwayatData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRiwayat = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/transaksi`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resData = await response.json();
        if (resData.status === 'sukses') {
          setRiwayatData(resData.data.sort((a, b) => b.id - a.id));
        }
      } catch (error) {
        console.error("Gagal mengambil riwayat transaksi", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRiwayat();
  }, []);

  const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

  // Filter data
  const filteredData = riwayatData.filter(item => {
    const matchSearch = search === '' || 
                        item.nama_kategori.toLowerCase().includes(search.toLowerCase()) || 
                        (item.catatan && item.catatan.toLowerCase().includes(search.toLowerCase()));
    const matchKategori = filterKategori === '' || item.nama_kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  const totalTransaksi = filteredData.length;
  const totalBerat = filteredData.reduce((sum, item) => sum + item.berat, 0) / 1000;
  const totalNilai = filteredData.reduce((sum, item) => sum + item.total_nilai, 0);

  return (
    <DashboardLayout>
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex items-center gap-5 text-white shadow-sm mt-2 mb-8">
        <div className="bg-[#F4A300] p-4 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold mb-1">Riwayat Transaksi</h2>
          <p className="text-green-100/80 font-medium">Semua transaksi sampah wilayah Anda</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
        <label className="block text-sm font-bold text-[#0B4D1E] mb-3">Pencarian</label>
        <div className="relative mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Cari kategori, tanggal, catatan... (contoh: plastik, 7 Mei)" className="w-full bg-[#F5EFE6] border-none px-14 py-4 rounded-2xl focus:ring-2 focus:ring-[#0B4D1E] font-medium outline-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kategori dengan Panah */}
          <div>
            <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Kategori</label>
            <div className="relative">
              <select value={filterKategori} onChange={(e)=>setFilterKategori(e.target.value)} className="w-full bg-[#F5EFE6] border-none px-5 py-4 pr-12 rounded-2xl font-bold text-[#0B4D1E] appearance-none cursor-pointer outline-none">
                <option value="">Semua Kategori</option>
                <option value="Plastik">Plastik</option>
                <option value="Kertas">Kertas</option>
                <option value="Logam">Logam</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#0B4D1E]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          {/* Bulan (Custom Grid 4x3) */}
          <div>
            <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Bulan</label>
            <div className="relative">
              <div onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)} className="w-full bg-[#F5EFE6] border-none px-5 py-4 rounded-2xl font-bold text-[#0B4D1E] cursor-pointer flex justify-between items-center">
                {filterBulan || '-------- ----'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0B4D1E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              {isMonthPickerOpen && (
                <div className="absolute top-full mt-2 left-0 w-full bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-20 grid grid-cols-4 gap-2">
                  {bulanList.map((bln) => (
                    <button key={bln} onClick={() => { setFilterBulan(bln); setIsMonthPickerOpen(false); }} className={`py-2 rounded-xl text-sm font-bold transition-colors ${filterBulan === bln ? 'bg-[#0B4D1E] text-white' : 'bg-[#F5EFE6] text-[#0B4D1E] hover:bg-[#F4A300] hover:text-white'}`}>
                      {bln}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tahun (Custom Arrow Up/Down) */}
          <div>
            <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Tahun</label>
            <div className="w-full bg-[#F5EFE6] border-none px-5 py-2.5 rounded-2xl flex justify-between items-center">
              <span className="font-bold text-[#0B4D1E] text-lg">{filterTahun}</span>
              <div className="flex flex-col">
                <button onClick={() => setFilterTahun(filterTahun + 1)} className="text-gray-400 hover:text-[#0B4D1E] p-0.5"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg></button>
                <button onClick={() => setFilterTahun(filterTahun - 1)} className="text-gray-400 hover:text-[#0B4D1E] p-0.5"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
        <table className="w-full text-left">
          <thead className="bg-[#F5EFE6] text-[#0B4D1E]">
            <tr>
              <th className="px-8 py-5 font-bold">Wilayah & Petugas</th>
              <th className="px-8 py-5 font-bold">Kategori</th>
              <th className="px-8 py-5 font-bold">Berat (kg)</th>
              <th className="px-8 py-5 font-bold">Nilai (Rp)</th>
              <th className="px-8 py-5 font-bold">Status</th>
              <th className="px-8 py-5 font-bold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? <tr><td colSpan="6" className="text-center py-8 text-gray-500 font-bold">Memuat data...</td></tr> : 
             filteredData.length === 0 ? <tr><td colSpan="6" className="text-center py-8 text-gray-500 font-bold">Tidak ada transaksi ditemukan</td></tr> :
             filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-5 text-gray-600 font-medium">
                  <div className="font-bold text-[#0B4D1E]">{item.nama_wilayah}</div>
                  <div className="text-xs text-gray-400">Oleh: {item.nama_petugas}</div>
                </td>
                <td className="px-8 py-5"><span className="bg-[#EAE5DA] text-[#0B4D1E] px-4 py-1.5 rounded-full font-bold text-xs">{item.nama_kategori}</span></td>
                <td className="px-8 py-5 font-extrabold text-[#0B4D1E]">{item.berat / 1000}</td>
                <td className="px-8 py-5 font-extrabold text-[#0B4D1E]">{formatRp(item.total_nilai)}</td>
                <td className="px-8 py-5"><span className="text-green-600 bg-green-100 px-3 py-1.5 rounded-full font-bold text-xs">{item.status}</span></td>
                <td className="px-8 py-5 text-center">
                  <button onClick={() => setSelectedTrx(item)} className="text-[#0B4D1E] font-bold hover:text-[#F4A300] transition-colors text-sm underline">Lihat Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Kartu Ringkasan (Tambah Efek Hover) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <p className="text-gray-400 font-medium text-sm mb-1">Total Transaksi</p>
          <h3 className="text-4xl font-extrabold text-[#0B4D1E]">{totalTransaksi}</h3>
          <p className="text-xs text-gray-400 mt-2">Semua data</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <p className="text-gray-400 font-medium text-sm mb-1">Total Berat</p>
          <h3 className="text-4xl font-extrabold text-[#0B4D1E]">{totalBerat} kg</h3>
          <p className="text-xs text-gray-400 mt-2">Semua data</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <p className="text-gray-400 font-medium text-sm mb-1">Total Nilai</p>
          <h3 className="text-4xl font-extrabold text-[#0B4D1E]">{formatRp(totalNilai)}</h3>
          <p className="text-xs text-gray-400 mt-2">Semua data</p>
        </div>
      </div>

      {/* FLOATING MODAL DETAIL TRANSAKSI */}
      {selectedTrx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">
          <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl relative animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-[#EAE5DA] p-2.5 rounded-full text-[#0B4D1E]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
                <h3 className="text-2xl font-extrabold text-[#0B4D1E]">Detail Transaksi</h3>
              </div>
              <button onClick={() => setSelectedTrx(null)} className="text-gray-400 hover:text-[#0B4D1E] transition-colors p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <p className="text-gray-500 font-medium text-sm">Wilayah Asal</p>
                <p className="font-bold text-[#0B4D1E]">{selectedTrx.nama_wilayah}</p>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <p className="text-gray-500 font-medium text-sm">Kategori Sampah</p>
                <span className="bg-[#F5EFE6] text-[#0B4D1E] px-4 py-1.5 rounded-full font-bold text-xs">{selectedTrx.nama_kategori}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <p className="text-gray-500 font-medium text-sm">Berat Sampah</p>
                <p className="font-extrabold text-[#0B4D1E] text-lg">{selectedTrx.berat / 1000} kg</p>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <p className="text-gray-500 font-medium text-sm">Nilai Ekonomi</p>
                <p className="font-extrabold text-[#0B4D1E] text-lg">{formatRp(selectedTrx.total_nilai)}</p>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <p className="text-gray-500 font-medium text-sm">Status</p>
                <span className="text-green-600 bg-green-100 px-3 py-1.5 rounded-full font-bold text-xs">{selectedTrx.status}</span>
              </div>
              
              <div className="pt-2">
                <p className="text-gray-500 font-medium text-sm mb-3">Catatan</p>
                <div className="w-full bg-[#F5EFE6] p-5 rounded-2xl text-[#0B4D1E] font-medium text-sm border border-gray-100">
                  {selectedTrx.catatan || 'Tidak ada catatan.'}
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedTrx(null)} className="w-full bg-[#0B4D1E] text-white py-4 rounded-2xl font-bold mt-8 hover:bg-[#083a16] hover:shadow-lg hover:-translate-y-1 transition-all">
              Tutup
            </button>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

export default RiwayatTransaksiPage;