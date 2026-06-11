import React, { useState, useEffect } from 'react';
import DuiLayout from '../../components/DuiLayout';

function DuiMonitoringPage() {
  // State untuk Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWilayah, setFilterWilayah] = useState('Semua Wilayah');
  const [filterBulan, setFilterBulan] = useState('Semua Bulan');
  const [filterTahun, setFilterTahun] = useState('2026');
  const [filterStatus, setFilterStatus] = useState('Semua Status');

  // State untuk Toggle Custom Dropdown
  const [isWilayahOpen, setIsWilayahOpen] = useState(false);
  const [isBulanOpen, setIsBulanOpen] = useState(false);
  const [isTahunOpen, setIsTahunOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // State untuk Modal Detail
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedWilayah, setSelectedWilayah] = useState(null);

  // Function buat nutup dropdown lain pas satu dibuka
  const closeAllDropdowns = () => {
    setIsWilayahOpen(false);
    setIsBulanOpen(false);
    setIsTahunOpen(false);
    setIsStatusOpen(false);
  };

  const [monitoringData, setMonitoringData] = useState([]);
  const [breakdownKategori, setBreakdownKategori] = useState([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    const fetchMonitoring = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return;

        const [lbRes, wilRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/dashboard/leaderboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${import.meta.env.VITE_API_URL}/wilayah`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        
        const lbData = await lbRes.json();
        const wilData = await wilRes.json();

        // Create a map of wilayah status
        const statusMap = {};
        if (wilData.status === 'sukses' && wilData.data) {
          wilData.data.forEach(w => {
            statusMap[w.id] = w.status === 'aktif' ? 'Aktif' : 'Nonaktif';
          });
        }

        if (lbData.status === 'sukses') {
          const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
          const mappedData = lbData.data.map(item => ({
            id: item.wilayah_id,
            rank: `#${item.peringkat}`,
            wilayah: item.nama_wilayah,
            kontribusi: (item.total_berat_gram / 1000).toString(),
            transaksi: item.jumlah_transaksi,
            nilai: formatRp(item.total_rupiah),
            kpi: item.poin_kpi,
            status: statusMap[item.wilayah_id] || 'Aktif'
          }));
          setMonitoringData(mappedData);
        }
      } catch (error) {
        console.error("Gagal mengambil data monitoring:", error);
      }
    };
    fetchMonitoring();
  }, []);

  // Logic Filter Berfungsi
  const filteredData = monitoringData.filter(d => {
    const matchSearch = d.wilayah.toLowerCase().includes(searchTerm.toLowerCase());
    const matchWilayah = filterWilayah === 'Semua Wilayah' || d.wilayah === filterWilayah;
    const matchStatus = filterStatus === 'Semua Status' || d.status === filterStatus;
    return matchSearch && matchWilayah && matchStatus;
  });

  const handleViewDetail = async (data) => {
    setSelectedWilayah(data);
    setIsDetailOpen(true);
    setIsLoadingDetail(true);
    setBreakdownKategori([]);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/dashboard/${data.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resData = await response.json();

      if (resData.status === 'sukses' && resData.breakdown_kategori) {
        const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
        const mappedBreakdown = resData.breakdown_kategori.map(k => ({
          name: k.kategori,
          berat: `${k.total_berat / 1000} kg`,
          nilai: formatRp(k.total_nilai)
        }));
        setBreakdownKategori(mappedBreakdown);
      }
    } catch (error) {
      console.error("Gagal mengambil detail breakdown wilayah:", error);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  return (
    <DuiLayout>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* BANNER UTAMA */}
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex items-center gap-5 text-white mt-2 mb-8 shadow-sm">
        <div className="bg-[#F4A300] p-4 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold mb-1">Monitoring Wilayah</h2>
          <p className="text-green-100/80 font-medium">Monitor kinerja dan kontribusi seluruh wilayah</p>
        </div>
      </div>

      {/* FILTER & SEARCHBAR KONSISTEN */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
        {/* Input Search */}
        <div className="relative mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Cari wilayah..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-all" />
        </div>

        {/* Dropdown Filters (Custom UI) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Wilayah */}
          <div className="relative">
            <div onClick={() => { closeAllDropdowns(); setIsWilayahOpen(!isWilayahOpen); }} className="bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl cursor-pointer flex justify-between items-center hover:bg-[#EAE5DA] transition-colors h-[56px]">
              <span className="truncate">{filterWilayah}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
            {isWilayahOpen && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden py-1 max-h-48 overflow-y-auto custom-scrollbar">
                {['Semua Wilayah', 'BEM FATETA', 'BEM FAPET', 'BEM FEM', 'BEM FAHUTAN', 'BEM FPIK', 'BEM FMIPA', 'BEM FEMA', 'BEM FESB'].map(opt => (
                  <div key={opt} onClick={() => { setFilterWilayah(opt); setIsWilayahOpen(false); }} className={`px-5 py-2.5 cursor-pointer text-sm font-medium transition-colors ${filterWilayah === opt ? 'bg-[#0B4D1E] text-white' : 'text-[#0B4D1E] hover:bg-gray-100'}`}>
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bulan */}
          <div className="relative">
            <div onClick={() => { closeAllDropdowns(); setIsBulanOpen(!isBulanOpen); }} className="bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl cursor-pointer flex justify-between items-center hover:bg-[#EAE5DA] transition-colors h-[56px]">
              <span className="truncate">{filterBulan}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
            {isBulanOpen && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden py-1 max-h-48 overflow-y-auto custom-scrollbar">
                {['Semua Bulan', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'].map(opt => (
                  <div key={opt} onClick={() => { setFilterBulan(opt); setIsBulanOpen(false); }} className={`px-5 py-2.5 cursor-pointer text-sm font-medium transition-colors ${filterBulan === opt ? 'bg-[#0B4D1E] text-white' : 'text-[#0B4D1E] hover:bg-gray-100'}`}>
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tahun */}
          <div className="relative">
            <div onClick={() => { closeAllDropdowns(); setIsTahunOpen(!isTahunOpen); }} className="bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl cursor-pointer flex justify-between items-center hover:bg-[#EAE5DA] transition-colors h-[56px]">
              <span className="truncate">{filterTahun}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
            {isTahunOpen && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden py-1">
                {['2026', '2025'].map(opt => (
                  <div key={opt} onClick={() => { setFilterTahun(opt); setIsTahunOpen(false); }} className={`px-5 py-2.5 cursor-pointer text-sm font-medium transition-colors ${filterTahun === opt ? 'bg-[#0B4D1E] text-white' : 'text-[#0B4D1E] hover:bg-gray-100'}`}>
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="relative">
            <div onClick={() => { closeAllDropdowns(); setIsStatusOpen(!isStatusOpen); }} className="bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl cursor-pointer flex justify-between items-center hover:bg-[#EAE5DA] transition-colors h-[56px]">
              <span className="truncate">{filterStatus}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
            {isStatusOpen && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden py-1">
                {['Semua Status', 'Aktif', 'Nonaktif'].map(opt => (
                  <div key={opt} onClick={() => { setFilterStatus(opt); setIsStatusOpen(false); }} className={`px-5 py-2.5 cursor-pointer text-sm font-medium transition-colors ${filterStatus === opt ? 'bg-[#0B4D1E] text-white' : 'text-[#0B4D1E] hover:bg-gray-100'}`}>
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F5EFE6] text-[#0B4D1E]">
              <tr>
                <th className="px-8 py-5 font-bold">Ranking</th>
                <th className="px-8 py-5 font-bold">Wilayah</th>
                <th className="px-8 py-5 font-bold">Total Kontribusi</th>
                <th className="px-8 py-5 font-bold">Total Transaksi</th>
                <th className="px-8 py-5 font-bold">Nilai Ekonomi</th>
                <th className="px-8 py-5 font-bold">KPI</th>
                <th className="px-8 py-5 font-bold">Status</th>
                <th className="px-8 py-5 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 font-extrabold text-[#F4A300]">{w.rank}</td>
                  <td className="px-8 py-5 font-bold text-[#0B4D1E]">{w.wilayah}</td>
                  <td className="px-8 py-5 font-bold text-[#0B4D1E]">{w.kontribusi} kg</td>
                  <td className="px-8 py-5 font-medium text-gray-500">{w.transaksi}</td>
                  <td className="px-8 py-5 font-extrabold text-green-600">{w.nilai}</td>
                  <td className="px-8 py-5 font-extrabold text-[#F4A300]">{w.kpi}</td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${w.status === 'Aktif' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFEBEE] text-[#C62828]'}`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 flex justify-center">
                    {/* REVISI: Ikon button aksi tanpa background bulet, hover rounded-lg krem */}
                    <button onClick={() => handleViewDetail(w)} className="p-2 text-gray-400 hover:text-[#0B4D1E] hover:bg-[#EAE5DA] rounded-lg transition-all" title="Detail Wilayah">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUMMARY CARDS BAWAH */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm font-medium mb-1">Total Wilayah</p>
          <h3 className="text-3xl font-extrabold text-[#0B4D1E]">{monitoringData.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm font-medium mb-1">Wilayah Aktif</p>
          <h3 className="text-3xl font-extrabold text-[#2E7D32]">{monitoringData.filter(d => d.status === 'Aktif').length}</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm font-medium mb-1">Total Sampah</p>
          <h3 className="text-3xl font-extrabold text-[#0B4D1E]">{monitoringData.reduce((acc, curr) => acc + parseFloat(curr.kontribusi || 0), 0)} kg</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm font-medium mb-1">KPI Rata-rata</p>
          <h3 className="text-3xl font-extrabold text-[#F4A300]">
            {monitoringData.length > 0 ? Math.round(monitoringData.reduce((acc, curr) => acc + curr.kpi, 0) / monitoringData.length) : 0}
          </h3>
        </div>
      </div>

      {/* MODAL DETAIL WILAYAH (SESUAI GAMBAR) */}
      {isDetailOpen && selectedWilayah && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative animate-fade-in-up border border-gray-100 flex flex-col max-h-[90vh]">
            
            {/* Scrollable Content Container */}
            <div className="overflow-y-auto custom-scrollbar pr-2 flex-1">
              
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4 pt-2">
                <span className="text-gray-400 font-medium">Nama Wilayah</span>
                <span className="font-extrabold text-[#0B4D1E] text-lg">{selectedWilayah.wilayah}</span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center bg-[#F5EFE6] p-4 rounded-2xl">
                  <span className="text-[#0B4D1E] font-bold text-sm">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedWilayah.status === 'Aktif' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFEBEE] text-[#C62828]'}`}>
                    {selectedWilayah.status}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-[#F5EFE6] p-4 rounded-2xl">
                  <span className="text-[#0B4D1E] font-bold text-sm">Poin KPI</span>
                  <span className="font-extrabold text-[#0B4D1E] text-lg">{selectedWilayah.kpi}</span>
                </div>
                <div className="flex justify-between items-center bg-[#F5EFE6] p-4 rounded-2xl">
                  <span className="text-[#0B4D1E] font-bold text-sm">Jumlah Transaksi</span>
                  <span className="font-extrabold text-[#0B4D1E] text-lg">{selectedWilayah.transaksi}x</span>
                </div>
              </div>

              {isLoadingDetail ? (
                <div className="text-center py-6 text-gray-500 font-medium animate-pulse">Memuat data breakdown...</div>
              ) : (
                <>
                  <div className="bg-[#125B2A] text-white p-5 rounded-2xl mb-6 shadow-inner">
                    <p className="text-green-100 text-xs font-bold uppercase tracking-wider mb-1">Total Nilai Ekonomi</p>
                    <h2 className="text-3xl font-extrabold">{selectedWilayah.nilai}</h2>
                    <p className="text-green-100/80 text-xs mt-2 text-right">Dari total {selectedWilayah.kontribusi} kg sampah</p>
                  </div>
                  
                  <div className="bg-[#F5EFE6] p-6 rounded-3xl mb-6">
                    <h4 className="font-extrabold text-[#0B4D1E] mb-3">Breakdown per Kategori</h4>
                    <div className="space-y-2">
                      {breakdownKategori.length > 0 ? breakdownKategori.map((k, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 group">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#F4A300]"></div>
                            <span className="text-gray-500 font-medium text-sm group-hover:text-[#0B4D1E] transition-colors">{k.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[#0B4D1E] font-bold text-sm block">{k.nilai}</span>
                            <span className="text-[10px] font-bold text-gray-400">{k.berat}</span>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-4 text-gray-500 text-sm">Belum ada rincian kategori.</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Tombol Kembali Tetap di Bawah (Tidak Ikut Terscroll) */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => setIsDetailOpen(false)} className="w-full bg-[#125B2A] text-white py-4 rounded-full font-bold hover:bg-[#0B4D1E] transition-all shadow-md">
                Kembali
              </button>
            </div>

          </div>
        </div>
      )}

    </DuiLayout>
  );
}

export default DuiMonitoringPage;