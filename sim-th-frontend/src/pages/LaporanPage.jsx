import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

function LaporanPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Mei 2026');
  
  // State untuk Modal Export
  const [exportFormat, setExportFormat] = useState('PDF');
  const [exportPeriode, setExportPeriode] = useState('Mei 2026');
  const [isExportPeriodeOpen, setIsExportPeriodeOpen] = useState(false);
  
  const [exportData, setExportData] = useState({
    ringkasan: true,
    grafikIncome: true,
    grafikBreakdown: true,
    rincian: true
  });

  const bulanList = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  const periodeOptions = ['Semua Periode', 'Mei 2026', 'April 2026', 'Maret 2026'];

  const handleExport = () => {
    alert(`Laporan format ${exportFormat} untuk periode ${exportPeriode} sedang diunduh...`);
    setIsExportModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex items-center justify-between shadow-sm mt-2 mb-8 text-white">
        <div className="flex items-center gap-5">
          <div className="bg-[#F4A300] p-4 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mb-1">Laporan Lengkap</h2>
            <p className="text-green-100/80 font-medium">Statistik pengelolaan sampah komprehensif</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
              className="bg-white text-gray-700 px-6 py-3.5 rounded-2xl flex items-center gap-3 font-bold shadow-sm hover:bg-gray-50 transition-all border border-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {selectedMonth}
            </button>
            {isMonthPickerOpen && (
              <div className="absolute top-full mt-3 right-0 w-64 bg-white p-4 rounded-[2rem] shadow-2xl border border-gray-100 z-50 grid grid-cols-3 gap-2">
                {bulanList.map(bln => (
                  <button key={bln} onClick={() => { setSelectedMonth(`${bln} 2026`); setIsMonthPickerOpen(false); }} className="py-2 rounded-xl text-xs font-bold bg-[#F5EFE6] text-[#0B4D1E] hover:bg-[#F4A300] hover:text-white transition-all">
                    {bln}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => setIsExportModalOpen(true)} className="bg-[#F4A300] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#d68e00] transition-all shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export Laporan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Sampah', val: '520 kg', badge: '+12% dari bln lalu' },
          { title: 'Nilai Ekonomi', val: 'Rp 1.25jt', badge: '+8% dari bln lalu' },
          { title: 'Total Transaksi', val: '128', badge: '+15% dari bln lalu' },
          { title: 'Saldo Tabungan', val: 'Rp 270rb', badge: '+28% bulan ini' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <p className="text-gray-500 font-medium text-sm mb-1">{item.title}</p>
            <h3 className="text-3xl font-extrabold text-[#0B4D1E] mb-2">{item.val}</h3>
            <p className="text-xs font-bold text-green-600">{item.badge}</p>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="font-extrabold text-2xl text-[#0B4D1E] mb-8">Nilai Ekonomi & Pemasukan Bulanan</h3>
          <div className="w-full h-80 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 flex items-center justify-center text-gray-400 font-bold">Grafik Pemasukan Bulanan</div>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="font-extrabold text-2xl text-[#0B4D1E] mb-8">Breakdown Kategori per Bulan</h3>
          <div className="w-full h-80 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 flex items-center justify-center text-gray-400 font-bold">Grafik Bar Kategori</div>
        </div>
      </div>

      {/* FLOATING MODAL EXPORT LAPORAN */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative animate-fade-in-up border border-gray-100">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="bg-[#FDF6EA] p-3 rounded-2xl text-[#F4A300] border border-[#F4A300]/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-2xl font-extrabold text-[#0B4D1E]">Export Laporan</h3>
              </div>
              <button onClick={() => setIsExportModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-8">
              
              {/* DROPDOWN PERIODE AKTIF */}
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-3">Pilih Periode</label>
                <div className="relative">
                  <div onClick={() => setIsExportPeriodeOpen(!isExportPeriodeOpen)} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-bold text-[#0B4D1E] flex justify-between items-center cursor-pointer transition-all hover:bg-[#EAE5DA]">
                    {exportPeriode} 
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-[#0B4D1E] transition-transform duration-300 ${isExportPeriodeOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  
                  {isExportPeriodeOpen && (
                    <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden z-50">
                      {periodeOptions.map((opt) => (
                        <div key={opt} onClick={() => { setExportPeriode(opt); setIsExportPeriodeOpen(false); }} className="px-5 py-4 hover:bg-[#F5EFE6] cursor-pointer text-sm font-bold text-[#0B4D1E] transition-colors">
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* CHECKBOXES */}
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-3">Data yang Diexport</label>
                <div className="bg-[#F5EFE6] p-6 rounded-[2rem] space-y-5">
                  {Object.keys(exportData).map((key) => (
                    <label key={key} className="flex items-center gap-4 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={exportData[key]} 
                        onChange={(e) => setExportData({...exportData, [key]: e.target.value === 'true' ? false : true})} 
                        onClick={() => setExportData({...exportData, [key]: !exportData[key]})}
                        className="w-6 h-6 text-[#0A8895] bg-white border-gray-300 rounded focus:ring-[#0A8895] cursor-pointer accent-[#0A8895]" 
                      />
                      <span className="text-sm font-bold text-[#0B4D1E] capitalize group-hover:text-[#F4A300] transition-colors">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* TOGGLE EXCEL / PDF */}
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-3">Format File</label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setExportFormat('PDF')} 
                    className={`flex-1 py-4 rounded-2xl font-bold transition-all duration-300 ${exportFormat === 'PDF' ? 'bg-[#F4A300] text-white shadow-md' : 'bg-[#F5EFE6] text-gray-500 hover:bg-[#EAE5DA]'}`}
                  >
                    PDF
                  </button>
                  <button 
                    onClick={() => setExportFormat('Excel')} 
                    className={`flex-1 py-4 rounded-2xl font-bold transition-all duration-300 ${exportFormat === 'Excel' ? 'bg-[#F4A300] text-white shadow-md' : 'bg-[#F5EFE6] text-gray-500 hover:bg-[#EAE5DA]'}`}
                  >
                    Excel
                  </button>
                </div>
              </div>
            </div>

            {/* BUTTON SUBMIT */}
            <button onClick={handleExport} className="w-full bg-[#0B4D1E] text-white py-5 rounded-2xl font-bold mt-10 hover:bg-[#083a16] hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export {exportFormat} Sekarang
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default LaporanPage;