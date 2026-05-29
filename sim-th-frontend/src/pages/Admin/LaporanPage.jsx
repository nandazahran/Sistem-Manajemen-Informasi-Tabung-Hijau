import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AdminLayout from '../../components/AdminLayout';

function LaporanPage() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [exportFormat, setExportFormat] = useState('XLSX');
  
  // States Filter & Search
  const [searchTerm, setSearchTerm] = useState('');

  const rekapData = [
    { id: 1, wilayah: 'BEM FATETA', totalTx: 124, berat: '385 kg', nilai: 'Rp 1.250k', kpi: 925 },
    { id: 2, wilayah: 'BEM FAPET', totalTx: 118, berat: '360 kg', nilai: 'Rp 1.180k', kpi: 890 },
    { id: 3, wilayah: 'BEM FEM', totalTx: 112, berat: '340 kg', nilai: 'Rp 1.100k', kpi: 875 },
    { id: 4, wilayah: 'BEM FAHUTAN', totalTx: 105, berat: '310 kg', nilai: 'Rp 950k', kpi: 820 },
  ];

  const filteredRekap = rekapData.filter(r => r.wilayah.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleRowClick = (row) => { setSelectedRow(row); setIsDetailOpen(true); };

  // Data Grafiks
  const lineData = [{ name: 'Jan', berat: 1200 }, { name: 'Feb', berat: 1350 }, { name: 'Mar', berat: 1580 }, { name: 'Apr', berat: 1720 }, { name: 'Mei', berat: 1890 }];
  const barData = [{ name: 'FATETA', nilai: 1250 }, { name: 'FAPET', nilai: 1180 }, { name: 'FEM', nilai: 1100 }, { name: 'FAHUTAN', nilai: 950 }];
  const pieData = [{ name: 'FATETA', value: 385 }, { name: 'FAPET', value: 360 }, { name: 'FEM', value: 340 }, { name: 'FAHUTAN', value: 310 }, { name: 'Lainnya', value: 495 }];
  const COLORS = ['#125B2A', '#F4A300', '#8FA57A', '#517D3B', '#D1D5DB'];

  return (
    <AdminLayout>
      {/* BANNER */}
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm mt-2 mb-8">
        <div className="flex items-center gap-5 text-white mb-6 md:mb-0">
          <div className="bg-[#F4A300] p-4 rounded-2xl"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
          <div><h2 className="text-3xl font-extrabold mb-1">Laporan Sistem</h2><p className="text-green-100/80 font-medium">Dashboard analitik dan pelaporan komprehensif</p></div>
        </div>
        <button onClick={() => setIsExportOpen(true)} className="bg-[#F4A300] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#d68e00] transition-all shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Export Laporan
        </button>
      </div>

      {/* FILTER SEARCH */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Cari wilayah..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]" />
        </div>
        <div className="flex gap-4">
          <select className="w-40 bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl outline-none cursor-pointer"><option>Mei 2026</option></select>
          <select className="w-32 bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl outline-none cursor-pointer"><option>2026</option></select>
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
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="font-extrabold text-lg text-[#0B4D1E] mb-6">Tren Sampah per Kategori</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} /><YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} width={40} /><Tooltip cursor={{stroke: '#E5E7EB', strokeWidth: 2}} contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} /><Line type="monotone" dataKey="berat" stroke="#125B2A" strokeWidth={3} dot={{r: 4, fill: '#125B2A'}} activeDot={{r: 6}} /></LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="font-extrabold text-lg text-[#0B4D1E] mb-6">Nilai Ekonomi per Wilayah</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} /><YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} width={40} /><Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} formatter={(val) => `Rp ${val}k`} /><Bar dataKey="nilai" fill="#125B2A" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8 h-80 flex flex-col">
        <h3 className="font-extrabold text-lg text-[#0B4D1E] mb-6">Kontribusi Wilayah (kg)</h3>
        <div className="flex-1 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart><Tooltip contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} /><Pie data={pieData} innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">{pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie></PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* REKAP TABEL */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-10 p-2">
        <h3 className="font-extrabold text-xl text-[#0B4D1E] m-6">Rekap Transaksi</h3>
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#F5EFE6] text-[#0B4D1E]">
            <tr><th className="px-8 py-5 font-bold rounded-l-xl">Wilayah</th><th className="px-8 py-5 font-bold">Total Transaksi</th><th className="px-8 py-5 font-bold">Total Berat</th><th className="px-8 py-5 font-bold">Nilai Ekonomi</th><th className="px-8 py-5 font-bold rounded-r-xl">KPI</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRekap.map((r) => (
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

      {/* MODAL 1: EXPORT DATA (SUDAH DI REVISI DESAIN OUTLINE) */}
      {isExportOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3"><div className="bg-[#FDF6EA] p-3 rounded-2xl text-[#F4A300]"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></div><h3 className="text-2xl font-extrabold text-[#0B4D1E]">Export Laporan</h3></div>
              <button onClick={() => setIsExportOpen(false)} className="text-gray-400 hover:text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setIsExportOpen(false); alert('Laporan berhasil didownload!'); }} className="space-y-6">
              <div><label className="block text-sm font-bold text-[#0B4D1E] mb-2">Periode Laporan</label><select className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-bold text-[#0B4D1E] outline-none cursor-pointer"><option>Mei 2026</option><option>April 2026</option></select></div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Format File</label>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setExportFormat('XLSX')} className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 rounded-2xl font-bold transition-all duration-300 ${exportFormat === 'XLSX' ? 'border-2 border-[#125B2A] text-[#125B2A] bg-white' : 'border border-gray-200 text-gray-500 bg-white hover:bg-gray-50'}`}>XLSX (Excel)</button>
                  <button type="button" onClick={() => setExportFormat('PDF')} className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 rounded-2xl font-bold transition-all duration-300 ${exportFormat === 'PDF' ? 'border-2 border-[#125B2A] text-[#125B2A] bg-white' : 'border border-gray-200 text-gray-500 bg-white hover:bg-gray-50'}`}>PDF</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-3">Pilih Data yang akan diexport</label>
                <div className="bg-[#F5EFE6] p-5 rounded-2xl space-y-4">
                  {['Tren Sampah per Kategori', 'Nilai Ekonomi per Wilayah', 'Kontribusi Wilayah', 'Rekap Transaksi'].map((item) => (
                    <label key={item} className="flex items-center gap-4 cursor-pointer group"><input type="checkbox" defaultChecked className="w-5 h-5 text-[#0A8895] bg-white border-gray-300 rounded cursor-pointer accent-[#0A8895]" /><span className="text-sm font-bold text-[#0B4D1E]">{item}</span></label>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 mt-8 pt-2">
                <button type="button" onClick={() => setIsExportOpen(false)} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA]">Batal</button>
                <button type="submit" className="flex-1 bg-[#0B4D1E] text-white py-4 rounded-2xl font-bold hover:bg-[#083a16] shadow-md flex items-center justify-center gap-2">Download</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DETAIL REKAP (KLIK BARIS) ... [Paste Modal detail rincian Laporan] */}
    </AdminLayout>
  );
}

export default LaporanPage;