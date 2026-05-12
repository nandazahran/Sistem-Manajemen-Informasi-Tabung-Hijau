import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

function BukuTabunganPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  // State untuk Modal Export
  const [exportFormat, setExportFormat] = useState('PDF');
  const [exportData, setExportData] = useState({
    saldo: true,
    riwayat: true,
    grafik: true
  });
  
  // State Dropdown Periode dalam Modal
  const [exportPeriode, setExportPeriode] = useState('');
  const [isPeriodeOpen, setIsPeriodeOpen] = useState(false);
  const periodeOptions = ['Semua Periode', 'Mei 2026', 'April 2026', 'Maret 2026'];

  const handleExport = () => {
    alert(`File ${exportFormat} sedang diunduh...`);
    setIsExportModalOpen(false);
  };

  const riwayatPemasukan = [
    { jenis: 'Setoran Plastik', tanggal: '9 Mei 2026', nilai: '+ Rp 50.000' },
    { jenis: 'Setoran Kertas', tanggal: '8 Mei 2026', nilai: '+ Rp 25.000' },
    { jenis: 'Setoran Logam', tanggal: '7 Mei 2026', nilai: '+ Rp 75.000' },
    { jenis: 'Setoran Plastik', tanggal: '6 Mei 2026', nilai: '+ Rp 30.000' },
  ];

  return (
    <DashboardLayout>
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex items-center justify-between shadow-sm mt-2 mb-6 text-white">
        <div className="flex items-center gap-5">
          <div className="bg-[#F4A300] p-4 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mb-1">Buku Tabungan</h2>
            <p className="text-green-100/80 font-medium">Rekap pendapatan dari sampah wilayah</p>
          </div>
        </div>
        {/* Tombol pemicu Modal Export */}
        <button onClick={() => setIsExportModalOpen(true)} className="bg-[#F4A300] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#d68e00] hover:-translate-y-1 transition-all shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export Laporan
        </button>
      </div>

      <div className="bg-gradient-to-r from-[#0B4D1E] to-[#146b2d] p-10 rounded-[2rem] text-white shadow-sm mb-6 flex justify-between items-center relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="z-10">
          <p className="text-green-100 font-medium mb-1">Total Saldo Tabungan</p>
          <h3 className="text-5xl font-extrabold mb-2">Rp 270.000</h3>
          <p className="text-sm text-green-200">Wilayah: BEM FATETA • Terakhir diperbarui: 9 Mei 2026</p>
        </div>
        <div className="bg-white/20 px-5 py-2.5 rounded-full font-bold backdrop-blur-sm border border-white/30 flex items-center gap-2 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          +28% bulan ini
        </div>
      </div>

      {/* Bagian Bawah Singkat */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-6 hover:-translate-y-1 transition-all duration-300">
        <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">Perkembangan Saldo</h3>
        <div className="w-full h-64 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center">
          <p className="text-gray-400 font-medium">Grafik Line Chart Saldo</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-6 hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-extrabold text-xl text-[#0B4D1E]">Riwayat Pemasukan</h3>
          <button className="text-sm font-bold text-[#0B4D1E] hover:text-[#F4A300]">Lihat Semua →</button>
        </div>
        <div className="space-y-4">
          {riwayatPemasukan.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center bg-[#F5EFE6] p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-2.5 rounded-xl text-[#0B4D1E]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" /></svg>
                </div>
                <div><p className="font-bold text-[#0B4D1E]">{item.jenis}</p><p className="text-xs text-gray-500">{item.tanggal}</p></div>
              </div>
              <div className="font-extrabold text-[#0B4D1E]">{item.nilai}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-all duration-300">
          <p className="text-gray-500 font-medium text-sm mb-1">Pemasukan Bulan Ini</p>
          <h3 className="text-3xl font-extrabold text-[#0B4D1E]">Rp 60.000</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-all duration-300">
          <p className="text-gray-500 font-medium text-sm mb-1">Rata-rata per Transaksi</p>
          <h3 className="text-3xl font-extrabold text-[#0B4D1E]">Rp 44.000</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-all duration-300">
          <p className="text-gray-500 font-medium text-sm mb-1">Pertumbuhan</p>
          <h3 className="text-3xl font-extrabold text-[#0B4D1E]">+28%</h3>
        </div>
      </div>

      {/* FLOATING MODAL EXPORT LAPORAN */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">
          <div className="bg-white w-full max-w-[420px] rounded-[2rem] p-8 shadow-2xl relative animate-fade-in-up">
            
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-[#FDF6EA] border border-[#F4A300]/20 p-2.5 rounded-xl text-[#F4A300]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-xl font-extrabold text-[#0B4D1E]">Export Buku Tabungan</h3>
              </div>
              <button onClick={() => setIsExportModalOpen(false)} className="text-gray-400 hover:text-[#0B4D1E] transition-colors p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Combo Box Periode */}
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Pilih Periode</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={exportPeriode} 
                    onChange={(e) => { setExportPeriode(e.target.value); setIsPeriodeOpen(true); }}
                    onFocus={() => setIsPeriodeOpen(true)}
                    placeholder="Semua Periode" 
                    className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-bold text-[#0B4D1E] outline-none"
                  />
                  {/* Arrow Indicator */}
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#0B4D1E]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  {/* Dropdown Options */}
                  {isPeriodeOpen && (
                    <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-100 shadow-lg rounded-2xl overflow-hidden max-h-40 overflow-y-auto">
                      {periodeOptions.filter(o => o.toLowerCase().includes(exportPeriode.toLowerCase())).map((opt, i) => (
                        <li key={i} onClick={() => { setExportPeriode(opt); setIsPeriodeOpen(false); }} className="px-5 py-3 hover:bg-[#F5EFE6] cursor-pointer text-sm font-bold text-[#0B4D1E] transition-colors">
                          {opt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Data yang Diexport (Checkboxes) */}
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Data yang Diexport</label>
                <div className="bg-[#F5EFE6] p-5 rounded-2xl space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={exportData.saldo} onChange={(e) => setExportData({...exportData, saldo: e.target.checked})} className="w-5 h-5 text-[#0B4D1E] bg-white border-gray-300 rounded focus:ring-[#0B4D1E] cursor-pointer" />
                    <span className="text-sm font-bold text-[#0B4D1E] group-hover:text-[#F4A300] transition-colors">Saldo Tabungan</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={exportData.riwayat} onChange={(e) => setExportData({...exportData, riwayat: e.target.checked})} className="w-5 h-5 text-[#0B4D1E] bg-white border-gray-300 rounded focus:ring-[#0B4D1E] cursor-pointer" />
                    <span className="text-sm font-bold text-[#0B4D1E] group-hover:text-[#F4A300] transition-colors">Riwayat Pemasukan</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={exportData.grafik} onChange={(e) => setExportData({...exportData, grafik: e.target.checked})} className="w-5 h-5 text-[#0B4D1E] bg-white border-gray-300 rounded focus:ring-[#0B4D1E] cursor-pointer" />
                    <span className="text-sm font-bold text-[#0B4D1E] group-hover:text-[#F4A300] transition-colors">Grafik Perkembangan</span>
                  </label>
                </div>
              </div>

              {/* Format File Toggle */}
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Format File</label>
                <div className="flex gap-4">
                  <button onClick={() => setExportFormat('PDF')} className={`flex-1 py-3.5 rounded-2xl font-bold transition-all ${exportFormat === 'PDF' ? 'bg-[#F4A300] text-white shadow-md' : 'bg-[#F5EFE6] text-gray-500 hover:bg-[#EAE5DA]'}`}>
                    PDF
                  </button>
                  <button onClick={() => setExportFormat('Excel')} className={`flex-1 py-3.5 rounded-2xl font-bold transition-all ${exportFormat === 'Excel' ? 'bg-[#F4A300] text-white shadow-md' : 'bg-[#F5EFE6] text-gray-500 hover:bg-[#EAE5DA]'}`}>
                    Excel
                  </button>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button onClick={handleExport} className="w-full bg-[#0B4D1E] text-white py-4 rounded-2xl font-bold mt-8 flex items-center justify-center gap-2 hover:bg-[#083a16] hover:-translate-y-1 hover:shadow-lg transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export {exportFormat}
            </button>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

export default BukuTabunganPage;