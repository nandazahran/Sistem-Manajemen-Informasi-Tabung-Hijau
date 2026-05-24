import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

function LaporanPage() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false); // STATE BARU BUAT EXPORT
  const [selectedRow, setSelectedRow] = useState(null);
  const [exportFormat, setExportFormat] = useState('XLSX');

  const rekapData = [
    { id: 1, wilayah: 'BEM FATETA', totalTx: 124, berat: '385 kg', nilai: 'Rp 1.250k', kpi: 925 },
    { id: 2, wilayah: 'BEM FAPET', totalTx: 118, berat: '360 kg', nilai: 'Rp 1.180k', kpi: 890 },
  ];

  const handleRowClick = (row) => { setSelectedRow(row); setIsDetailOpen(true); };

  return (
    <AdminLayout>
      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* BANNER */}
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm mt-2 mb-8">
        <div className="flex items-center gap-5 text-white mb-6 md:mb-0">
          <div className="bg-[#F4A300] p-4 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mb-1">Laporan Sistem</h2>
            <p className="text-green-100/80 font-medium">Dashboard analitik dan pelaporan komprehensif</p>
          </div>
        </div>
        <button onClick={() => setIsExportOpen(true)} className="bg-[#F4A300] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#d68e00] transition-all shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Export Laporan
        </button>
      </div>

      {/* FILTER SEARCH COMBOBOX */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <select className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer">
             <option>Semua Wilayah</option><option>BEM FATETA</option><option>BEM FAPET</option><option>BEM FEM</option><option>BEM FAHUTAN</option>
             <option disabled>--- Cari lainnya ---</option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </div>
        <div className="flex gap-4">
          <div className="relative w-40">
            <select className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl text-[#0B4D1E] font-bold outline-none cursor-pointer appearance-none"><option>Mei 2026</option></select>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </div>
          <div className="relative w-32">
            <select className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl text-[#0B4D1E] font-bold outline-none cursor-pointer appearance-none"><option>2026</option></select>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </div>
        </div>
      </div>

      {/* SUMMARY INFO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { t: 'Total Transaksi', v: '1,284', b: '+12% dari bulan lalu' },
          { t: 'Total Sampah', v: '1,890 kg', b: '+8% dari bulan lalu' },
          { t: 'Nilai Ekonomi', v: 'Rp 6,1jt', b: '+15% dari bulan lalu', c: 'text-green-600' },
          { t: 'Wilayah Aktif', v: '8', b: 'dari 8 total' }
        ].map((c,i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"><p className="text-gray-400 text-sm font-medium mb-1">{c.t}</p><h3 className={`text-3xl font-extrabold ${c.c || 'text-[#0B4D1E]'}`}>{c.v}</h3><p className="text-[10px] text-green-500 font-bold mt-1">{c.b}</p></div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100"><h3 className="font-extrabold text-lg text-[#0B4D1E] mb-6">Tren Sampah per Kategori</h3><div className="h-48 bg-gray-50 flex items-center justify-center rounded-xl border border-dashed border-gray-200 text-gray-400 font-bold">LineChart.js Placeholder</div></div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100"><h3 className="font-extrabold text-lg text-[#0B4D1E] mb-6">Nilai Ekonomi per Wilayah</h3><div className="h-48 bg-gray-50 flex items-center justify-center rounded-xl border border-dashed border-gray-200 text-gray-400 font-bold">BarChart.js Placeholder</div></div>
      </div>
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8 h-80 flex flex-col">
        <h3 className="font-extrabold text-lg text-[#0B4D1E] mb-6">Kontribusi Wilayah (kg)</h3>
        <div className="flex-1 bg-gray-50 flex items-center justify-center rounded-xl border border-dashed border-gray-200 text-gray-400 font-bold">PieChart.js Placeholder</div>
      </div>

      {/* REKAP TABEL */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-10 p-2">
        <h3 className="font-extrabold text-xl text-[#0B4D1E] m-6">Rekap Transaksi</h3>
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#F5EFE6] text-[#0B4D1E]">
            <tr><th className="px-8 py-5 font-bold rounded-l-xl">Wilayah</th><th className="px-8 py-5 font-bold">Total Transaksi</th><th className="px-8 py-5 font-bold">Total Berat</th><th className="px-8 py-5 font-bold">Nilai Ekonomi</th><th className="px-8 py-5 font-bold rounded-r-xl">KPI</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rekapData.map((r) => (
              <tr key={r.id} onClick={() => handleRowClick(r)} className="hover:bg-[#FDF6EA] transition-colors cursor-pointer group">
                <td className="px-8 py-5 font-extrabold text-[#0B4D1E] group-hover:text-[#F4A300] transition-colors">{r.wilayah}</td>
                <td className="px-8 py-5 font-medium text-gray-500">{r.totalTx}</td>
                <td className="px-8 py-5 font-bold text-[#0B4D1E]">{r.berat}</td>
                <td className="px-8 py-5 font-extrabold text-green-600">{r.nilai}</td>
                <td className="px-8 py-5 font-extrabold text-[#F4A300]">{r.kpi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: EXPORT DATA */}
      {isExportOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative animate-fade-in-up border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-[#FDF6EA] p-3 rounded-2xl text-[#F4A300]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </div>
                <h3 className="text-2xl font-extrabold text-[#0B4D1E]">Export Laporan</h3>
              </div>
              <button onClick={() => setIsExportOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsExportOpen(false); alert('Laporan berhasil didownload!'); }} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Periode Laporan</label>
                <div className="relative">
                  <select className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-bold text-[#0B4D1E] appearance-none outline-none focus:ring-2 focus:ring-[#F4A300] cursor-pointer">
                    <option>Mei 2026</option><option>April 2026</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0B4D1E] pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Format File</label>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setExportFormat('XLSX')} className={`flex-1 py-4 rounded-2xl font-bold transition-all ${exportFormat === 'XLSX' ? 'bg-[#125B2A] text-white' : 'bg-[#F5EFE6] text-gray-500 hover:bg-[#EAE5DA]'}`}>XLSX (Excel)</button>
                  <button type="button" onClick={() => setExportFormat('PDF')} className={`flex-1 py-4 rounded-2xl font-bold transition-all ${exportFormat === 'PDF' ? 'bg-[#125B2A] text-white' : 'bg-[#F5EFE6] text-gray-500 hover:bg-[#EAE5DA]'}`}>PDF</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-3">Pilih Data yang akan diexport</label>
                <div className="bg-[#F5EFE6] p-5 rounded-2xl space-y-4">
                  {['Tren Sampah per Kategori', 'Nilai Ekonomi per Wilayah', 'Kontribusi Wilayah', 'Rekap Transaksi'].map((item) => (
                    <label key={item} className="flex items-center gap-4 cursor-pointer group">
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-[#0A8895] bg-white border-gray-300 rounded focus:ring-[#0A8895] cursor-pointer accent-[#0A8895]" />
                      <span className="text-sm font-bold text-[#0B4D1E] group-hover:text-[#F4A300] transition-colors">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-2">
                <button type="button" onClick={() => setIsExportOpen(false)} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
                <button type="submit" className="flex-1 bg-[#0B4D1E] text-white py-4 flex items-center justify-center gap-2 rounded-2xl font-bold hover:bg-[#083a16] shadow-md hover:-translate-y-1 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Download
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DETAIL REKAP */}
      {isDetailOpen && selectedRow && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl relative animate-fade-in-up border border-gray-100">
             <button onClick={() => setIsDetailOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
             <h3 className="text-2xl font-extrabold text-[#0B4D1E] mb-6 border-b border-gray-100 pb-4">{selectedRow.wilayah}</h3>
             <div className="space-y-4">
               <div className="flex justify-between"><span className="text-gray-500 text-sm">Total Transaksi:</span><strong className="text-[#0B4D1E]">{selectedRow.totalTx}</strong></div>
               <div className="flex justify-between"><span className="text-gray-500 text-sm">Total Berat:</span><strong className="text-[#0B4D1E]">{selectedRow.berat}</strong></div>
               <div className="flex justify-between"><span className="text-gray-500 text-sm">Nilai Ekonomi:</span><strong className="text-green-600">{selectedRow.nilai}</strong></div>
               <div className="flex justify-between pt-2 border-t border-gray-100"><span className="text-gray-500 text-sm font-bold">KPI Score:</span><strong className="text-[#F4A300] text-xl">{selectedRow.kpi}</strong></div>
             </div>
             <button onClick={() => setIsDetailOpen(false)} className="w-full bg-[#0B4D1E] text-white py-3.5 rounded-2xl font-bold mt-8 hover:bg-[#083a16] transition-all">Tutup Detail</button>
           </div>
         </div>
      )}
    </AdminLayout>
  );
}

export default LaporanPage;