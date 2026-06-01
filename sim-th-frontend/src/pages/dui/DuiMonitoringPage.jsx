import React, { useState } from 'react';
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

  // Dummy Data Sesuai Gambar
  const monitoringData = [
    { id: 1, rank: '#1', wilayah: 'BEM FATETA', kontribusi: '385', transaksi: 124, nilai: 'Rp 1.250.000', kpi: 925, status: 'Aktif' },
    { id: 2, rank: '#2', wilayah: 'BEM FAPET', kontribusi: '360', transaksi: 118, nilai: 'Rp 1.180.000', kpi: 890, status: 'Aktif' },
    { id: 3, rank: '#3', wilayah: 'BEM FEM', kontribusi: '340', transaksi: 112, nilai: 'Rp 1.100.000', kpi: 875, status: 'Aktif' },
    { id: 4, rank: '#4', wilayah: 'BEM FAHUTAN', kontribusi: '310', transaksi: 98, nilai: 'Rp 950.000', kpi: 820, status: 'Aktif' },
    { id: 5, rank: '#5', wilayah: 'BEM FPIK', kontribusi: '285', transaksi: 89, nilai: 'Rp 850.000', kpi: 780, status: 'Aktif' },
    { id: 6, rank: '#6', wilayah: 'BEM FMIPA', kontribusi: '260', transaksi: 82, nilai: 'Rp 780.000', kpi: 750, status: 'Aktif' },
    { id: 7, rank: '#7', wilayah: 'BEM FEMA', kontribusi: '240', transaksi: 75, nilai: 'Rp 720.000', kpi: 720, status: 'Aktif' },
    { id: 8, rank: '#8', wilayah: 'BEM FESB', kontribusi: '210', transaksi: 65, nilai: 'Rp 650.000', kpi: 680, status: 'Nonaktif' },
  ];

  // Dummy Breakdown Kategori (Buat di Modal)
  const breakdownKategori = [
    { name: 'Plastik', berat: '120 kg', nilai: 'Rp 480.000' },
    { name: 'Kertas', berat: '80 kg', nilai: 'Rp 160.000' },
    { name: 'Logam', berat: '45 kg', nilai: 'Rp 225.000' },
    { name: 'Organik', berat: '140 kg', nilai: 'Rp 140.000' },
  ];

  // Logic Filter Berfungsi
  const filteredData = monitoringData.filter(d => {
    const matchSearch = d.wilayah.toLowerCase().includes(searchTerm.toLowerCase());
    const matchWilayah = filterWilayah === 'Semua Wilayah' || d.wilayah === filterWilayah;
    const matchStatus = filterStatus === 'Semua Status' || d.status === filterStatus;
    return matchSearch && matchWilayah && matchStatus;
  });

  const handleViewDetail = (data) => {
    setSelectedWilayah(data);
    setIsDetailOpen(true);
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
          <h3 className="text-3xl font-extrabold text-[#0B4D1E]">8</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm font-medium mb-1">Wilayah Aktif</p>
          <h3 className="text-3xl font-extrabold text-[#2E7D32]">7</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm font-medium mb-1">Total Sampah</p>
          <h3 className="text-3xl font-extrabold text-[#0B4D1E]">2390 kg</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm font-medium mb-1">KPI Rata-rata</p>
          <h3 className="text-3xl font-extrabold text-[#F4A300]">805</h3>
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
              
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                <span className="text-gray-400 font-medium">Ranking</span>
                <span className="font-extrabold text-[#F4A300] text-lg">{selectedWilayah.rank}</span>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400 font-medium">Total Kontribusi</span>
                <span className="font-extrabold text-[#0B4D1E] text-lg">{selectedWilayah.kontribusi} kg</span>
              </div>

              {/* Box Breakdown Kategori */}
              <div className="bg-[#F5EFE6] p-6 rounded-3xl mb-6">
                <p className="text-[#0B4D1E] font-bold text-sm mb-4">Breakdown Kategori:</p>
                <div className="space-y-4">
                  {breakdownKategori.map((kategori, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-bold text-[#0B4D1E] text-sm">{kategori.name}</span>
                      <div className="text-right">
                        <p className="font-extrabold text-[#0B4D1E] text-sm">{kategori.berat}</p>
                        <p className="text-green-600 text-[11px] font-bold">{kategori.nilai}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                <span className="text-gray-400 font-medium">Total Transaksi</span>
                <span className="font-extrabold text-[#0B4D1E] text-lg">{selectedWilayah.transaksi}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                <span className="text-gray-400 font-medium">Nilai Ekonomi</span>
                <span className="font-extrabold text-green-600 text-lg">{selectedWilayah.nilai}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                <span className="text-gray-400 font-medium">KPI Score</span>
                <span className="font-extrabold text-[#F4A300] text-lg">{selectedWilayah.kpi}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2">
                <span className="text-gray-400 font-medium">Status</span>
                <span className={`px-5 py-2 rounded-full text-sm font-bold ${selectedWilayah.status === 'Aktif' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFEBEE] text-[#C62828]'}`}>
                  {selectedWilayah.status}
                </span>
              </div>

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