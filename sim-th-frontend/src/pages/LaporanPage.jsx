import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import * as XLSX from "xlsx"; // jsPDF & jspdf-autotable udah dihapus karena cuma butuh Excel

function LaporanPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Semua Periode');
  
  // State untuk Modal Export
  const [exportPeriode, setExportPeriode] = useState('Mei - Jun 2026');
  const [isExportPeriodeOpen, setIsExportPeriodeOpen] = useState(false);
  
  const [exportData, setExportData] = useState({
    ringkasan: true,
    grafikIncome: true,
    grafikBreakdown: true,
    rincian: true
  });

  // State untuk Data Riil
  const [dataTrx, setDataTrx] = useState([]);
  const [saldoTotal, setSaldoTotal] = useState(0);

  // Opsi Filter 2 Bulanan (Sesuai Gambar 2 & 6)
  const periodeOptions = [
    'Jan - Feb 2026', 'Mar - Apr 2026', 
    'Mei - Jun 2026', 'Jul - Ags 2026', 
    'Sep - Okt 2026', 'Nov - Des 2026'
  ];

  // Helper function buat konversi tanggal ke format 2 bulanan
  const getPeriode = (isoString) => {
    const d = new Date(isoString);
    const m = d.getMonth();
    const y = d.getFullYear();
    if (m <= 1) return `Jan - Feb ${y}`;
    if (m <= 3) return `Mar - Apr ${y}`;
    if (m <= 5) return `Mei - Jun ${y}`;
    if (m <= 7) return `Jul - Ags ${y}`;
    if (m <= 9) return `Sep - Okt ${y}`;
    return `Nov - Des ${y}`;
  };

  // Ambil Data dari Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [resTrx, resTab] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/transaksi`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/tabungan`, { headers })
        ]);

        const trx = await resTrx.json();
        const tab = await resTab.json();

        if (trx.status === 'sukses') setDataTrx(trx.data.sort((a, b) => b.id - a.id));
        if (tab.status === 'sukses') setSaldoTotal(tab.data.reduce((sum, item) => sum + item.saldo, 0));
      } catch (error) {
        console.error("Gagal mengambil data laporan:", error);
      }
    };
    fetchData();
  }, []);

  // Filter data sesuai periode 2 bulan yang dipilih
  const filteredData = dataTrx.filter(t => {
    if (selectedMonth === 'Semua Periode') return true;
    return getPeriode(t.tanggal) === selectedMonth;
  });

  const totalBerat = filteredData.reduce((sum, t) => sum + t.berat, 0) / 1000;
  const totalNilai = filteredData.reduce((sum, t) => sum + t.total_nilai, 0);
  const totalTransaksi = filteredData.length;

  const handleExport = () => {
    let dataToExport = dataTrx;
    if (exportPeriode !== 'Semua Periode') {
      dataToExport = dataTrx.filter(t => getPeriode(t.tanggal) === exportPeriode);
    }

    // Export hanya format Excel
    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(t => ({
      "ID Transaksi": t.id,
      "Tanggal": new Date(t.tanggal).toLocaleDateString('id-ID'),
      "Wilayah": t.nama_wilayah,
      "Kategori": t.nama_kategori,
      "Berat (kg)": t.berat / 1000,
      "Total Nilai (Rp)": t.total_nilai,
      "Petugas": t.nama_petugas,
      "Status": t.status
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Laporan");
    XLSX.writeFile(workbook, `Laporan_SIMTH_${exportPeriode.replace(/ /g, '')}.xlsx`);
    
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
          {/* Main Filter Dropdown (2 Bulanan) */}
          <div className="relative">
            <button 
              onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
              className="bg-white text-gray-700 px-6 py-3.5 rounded-2xl flex items-center gap-3 font-bold shadow-sm hover:bg-gray-50 transition-all border border-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {selectedMonth}
            </button>
            {isMonthPickerOpen && (
              <div className="absolute top-full mt-3 right-0 w-80 bg-white p-4 rounded-[2rem] shadow-2xl border border-gray-100 z-50 grid grid-cols-2 gap-3">
                <button onClick={() => { setSelectedMonth('Semua Periode'); setIsMonthPickerOpen(false); }} className="col-span-2 py-3 rounded-xl text-xs font-bold bg-[#0B4D1E] text-white hover:bg-[#083a16] transition-all mb-2">Semua Periode</button>
                {periodeOptions.map(opt => (
                  <button key={opt} onClick={() => { setSelectedMonth(opt); setIsMonthPickerOpen(false); }} className={`py-3 rounded-xl text-xs font-bold transition-all ${selectedMonth === opt ? 'bg-[#0B4D1E] text-white' : 'bg-[#F5EFE6] text-[#0B4D1E] hover:bg-[#F4A300] hover:text-white'}`}>
                    {opt}
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
          { title: 'Total Sampah', val: `${totalBerat.toLocaleString('id-ID')} kg`, badge: 'Berdasarkan Filter' },
          { title: 'Nilai Ekonomi', val: `Rp ${totalNilai.toLocaleString('id-ID')}`, badge: 'Berdasarkan Filter' },
          { title: 'Total Transaksi', val: totalTransaksi, badge: 'Berdasarkan Filter' },
          { title: 'Saldo Tabungan Global', val: `Rp ${saldoTotal.toLocaleString('id-ID')}`, badge: 'Total Keseluruhan' },
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
                      {['Semua Periode', ...periodeOptions].map((opt) => (
                        <div key={opt} onClick={() => { setExportPeriode(opt); setIsExportPeriodeOpen(false); }} className="px-5 py-4 hover:bg-[#F5EFE6] cursor-pointer text-sm font-bold text-[#0B4D1E] transition-colors">
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* CHECKBOXES DATA */}
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-3">Data yang Diexport</label>
                <div className="bg-[#F5EFE6] p-6 rounded-[2rem] space-y-5">
                  {Object.keys(exportData).map((key) => (
                    <label key={key} className="flex items-center gap-4 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={exportData[key]} 
                        onChange={() => setExportData({...exportData, [key]: !exportData[key]})}
                        className="w-5 h-5 text-[#125B2A] bg-white border-gray-300 rounded focus:ring-[#125B2A] cursor-pointer accent-[#125B2A]" 
                      />
                      <span className="text-sm font-bold text-[#0B4D1E] capitalize group-hover:text-[#F4A300] transition-colors">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* FORMAT FILE CUMA EXCEL SESUAI GAMBAR 6 */}
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-3">Format File</label>
                <div className="w-full bg-[#F4A300] text-white py-4 rounded-2xl font-bold flex justify-center shadow-sm cursor-default">
                  Excel
                </div>
              </div>
            </div>

            {/* BUTTON SUBMIT WARNA HIJAU */}
            <button onClick={handleExport} className="w-full bg-[#125B2A] text-white py-5 rounded-2xl font-bold mt-10 hover:bg-[#0B4D1E] hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export EXCEL
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default LaporanPage;