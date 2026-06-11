import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AdminLayout from '../../components/AdminLayout';
import * as XLSX from "xlsx";

function LaporanPage() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // States Filter & Search Utama
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBulanUtama, setFilterBulanUtama] = useState('Semua Periode');
  const [filterTahunUtama, setFilterTahunUtama] = useState('2026');
  
  // State Toggle Dropdown
  const [isBulanUtamaOpen, setIsBulanUtamaOpen] = useState(false);

  // States Modal Export
  const [exportPeriode, setExportPeriode] = useState('Semua Periode');
  const [exportYear, setExportYear] = useState('2026');
  const [isExportPeriodeOpen, setIsExportPeriodeOpen] = useState(false);

  // Opsi Dropdown
  const periodeOptions = ['Semua Periode', 'Jan - Feb', 'Mar - Apr', 'Mei - Jun', 'Jul - Ags', 'Sep - Okt', 'Nov - Des'];

  // Data dari Backend
  const [dataTrx, setDataTrx] = useState([]);
  const [dataLb, setDataLb] = useState([]);
  const [wilAktifCount, setWilAktifCount] = useState(0);

  const getBulanPeriode = (isoString) => {
    if (!isoString) return '-';
    const m = new Date(isoString).getMonth();
    if (m <= 1) return `Jan - Feb`;
    if (m <= 3) return `Mar - Apr`;
    if (m <= 5) return `Mei - Jun`;
    if (m <= 7) return `Jul - Ags`;
    if (m <= 9) return `Sep - Okt`;
    return `Nov - Des`;
  };

  const getTahun = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).getFullYear().toString();
  };

  const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_API_URL;
        if (!baseUrl || !token) return;
        const headers = { 'Authorization': `Bearer ${token}` };

        const [resTrx, resLb, wilRes] = await Promise.all([
          fetch(`${baseUrl}/transaksi`, { headers }),
          fetch(`${baseUrl}/dashboard/leaderboard`, { headers }),
          fetch(`${baseUrl}/wilayah/aktif`, { headers })
        ]);

        const trx = await resTrx.json();
        const lb = await resLb.json();
        const wilData = await wilRes.json();

        if (trx.status === 'sukses' && Array.isArray(trx.data)) {
          setDataTrx(trx.data.sort((a, b) => b.id - a.id));
        } else {
          setDataTrx([]);
        }

        if (lb.status === 'sukses' && Array.isArray(lb.data)) {
          setDataLb(lb.data);
        } else {
          setDataLb([]);
        }

        if (wilData.status === 'sukses') {
          setWilAktifCount(wilData.data.length);
        }
      } catch (error) {
        console.error('Gagal fetch data laporan:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // LOGIKA FILTERING & AGREGASI DATA
  const filteredData = dataTrx.filter(t => {
    const matchBulan = filterBulanUtama === 'Semua Periode' || getBulanPeriode(t.tanggal) === filterBulanUtama;
    const matchTahun = getTahun(t.tanggal) === filterTahunUtama;
    const matchSearch = searchTerm === '' || t.nama_wilayah?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchBulan && matchTahun && matchSearch;
  });

  const totalTransaksi = filteredData.length;
  const totalBerat = filteredData.reduce((sum, t) => sum + (t.berat || t.berat_gram || 0), 0) / 1000;
  const totalNilai = filteredData.reduce((sum, t) => sum + (t.total_nilai || 0), 0);
  const activeWilayahSet = new Set(filteredData.filter(t => t.nama_wilayah).map(t => t.nama_wilayah));
  const activeWilayahCount = activeWilayahSet.size;

  const summaryCards = [
    { t: 'Total Transaksi', v: totalTransaksi.toLocaleString('id-ID'), b: 'Berdasarkan Filter' },
    { t: 'Total Sampah', v: `${totalBerat.toLocaleString('id-ID')} kg`, b: 'Berdasarkan Filter' },
    { t: 'Nilai Ekonomi', v: formatRp(totalNilai), b: 'Berdasarkan Filter', c: 'text-green-600' },
    { t: 'Wilayah Aktif', v: activeWilayahCount.toString(), b: `dari ${wilAktifCount} total wilayah` }
  ];

  const wilayahMap = {};
  filteredData.forEach(t => {
    const w = t.nama_wilayah || 'Unknown';
    if (!wilayahMap[w]) {
      wilayahMap[w] = { totalTx: 0, berat: 0, nilai: 0 };
    }
    wilayahMap[w].totalTx += 1;
    wilayahMap[w].berat += (t.berat || t.berat_gram || 0) / 1000;
    wilayahMap[w].nilai += (t.total_nilai || 0);
  });

  const filteredRekap = Object.keys(wilayahMap).map((w, idx) => {
    const lbItem = dataLb.find(l => l.nama_wilayah === w);
    return {
      id: idx,
      wilayah: w,
      totalTx: wilayahMap[w].totalTx,
      beratRaw: wilayahMap[w].berat,
      berat: `${wilayahMap[w].berat.toFixed(1)} kg`,
      nilaiRaw: wilayahMap[w].nilai,
      nilai: formatRp(wilayahMap[w].nilai),
      kpi: lbItem ? lbItem.poin_kpi : '-'
    };
  }).sort((a, b) => b.beratRaw - a.beratRaw);

  const barData = filteredRekap.slice(0, 6).map(r => ({
    name: r.wilayah.replace('BEM ', ''),
    nilai: r.nilaiRaw / 1000
  }));

  const pieMap = {};
  filteredData.forEach(t => {
     const kat = t.nama_kategori || 'Unknown';
     if (!pieMap[kat]) pieMap[kat] = 0;
     pieMap[kat] += (t.berat || t.berat_gram || 0) / 1000;
  });
  const pieData = Object.keys(pieMap).map(k => ({ name: k, value: pieMap[k] }));

  const generateLineChart = () => {
    if (filteredData.length === 0) return [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    let tempChart = {};

    let startMonth = 0; let endMonth = 11;
    if (filterBulanUtama !== 'Semua Periode') {
      if (filterBulanUtama.startsWith('Jan')) { startMonth = 0; endMonth = 1; }
      else if (filterBulanUtama.startsWith('Mar')) { startMonth = 2; endMonth = 3; }
      else if (filterBulanUtama.startsWith('Mei')) { startMonth = 4; endMonth = 5; }
      else if (filterBulanUtama.startsWith('Jul')) { startMonth = 6; endMonth = 7; }
      else if (filterBulanUtama.startsWith('Sep')) { startMonth = 8; endMonth = 9; }
      else if (filterBulanUtama.startsWith('Nov')) { startMonth = 10; endMonth = 11; }
    } else {
      endMonth = new Date().getMonth();
      startMonth = endMonth - 5;
      if (startMonth < 0) startMonth = 0;
    }

    for (let i = startMonth; i <= endMonth; i++) {
      tempChart[monthNames[i]] = { name: monthNames[i], berat: 0 };
    }

    filteredData.forEach(item => {
      const d = new Date(item.tanggal);
      const m = monthNames[d.getMonth()];
      if (tempChart[m]) {
        tempChart[m].berat += (item.berat || item.berat_gram || 0) / 1000;
      }
    });

    return Object.values(tempChart);
  };
  const lineData = generateLineChart();

  const handleRowClick = (row) => { setSelectedRow(row); setIsDetailOpen(true); };

  const COLORS = ['#125B2A', '#F4A300', '#8FA57A', '#517D3B', '#D1D5DB'];

  // Export handler
  const handleExport = async (e) => {
    e.preventDefault();
    try {
      let dataToExport = dataTrx.filter(t => getTahun(t.tanggal) === exportYear);
      
      if (exportPeriode !== 'Semua Periode') {
        dataToExport = dataToExport.filter(t => getBulanPeriode(t.tanggal) === exportPeriode);
      }

      if (dataToExport.length === 0) {
        alert("Tidak ada data untuk diexport pada periode ini.");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(t => ({
        "ID Transaksi": t.id,
        "Tanggal": new Date(t.tanggal).toLocaleDateString('id-ID'),
        "Wilayah": t.nama_wilayah,
        "Kategori": t.nama_kategori,
        "Berat (kg)": (t.berat || t.berat_gram || 0) / 1000,
        "Total Nilai (Rp)": t.total_nilai,
        "Petugas": t.nama_petugas,
        "Status": t.status
      })));
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Laporan");
      XLSX.writeFile(workbook, `Laporan_Admin_SIMTH_${exportPeriode.replace(/ /g, '')}_${exportYear}.xlsx`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Gagal mengexport laporan');
    }
    setIsExportOpen(false);
  };

  return (
    <AdminLayout>
      <style>{`@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      
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

      {/* FILTER SEARCH UTAMA */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Cari wilayah..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow" />
        </div>
        
        {/* Combo Box Filter Bulan */}
        <div className="relative w-full md:w-64">
          <div onClick={() => setIsBulanUtamaOpen(!isBulanUtamaOpen)} className="bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl cursor-pointer flex justify-between items-center hover:bg-[#EAE5DA] transition-colors h-[56px]">
            <span className="truncate">{filterBulanUtama}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
          {isBulanUtamaOpen && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden py-1">
              {periodeOptions.map(opt => (
                <div key={opt} onClick={() => { setFilterBulanUtama(opt); setIsBulanUtamaOpen(false); }} className={`px-5 py-2.5 cursor-pointer text-sm font-medium transition-colors ${filterBulanUtama === opt ? 'bg-[#0B4D1E] text-white' : 'text-[#0B4D1E] hover:bg-gray-100'}`}>
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Combo Box Filter Tahun */}
        <div className="relative w-full md:w-32">
          <div className="w-full bg-[#F5EFE6] border-none px-5 py-2.5 rounded-2xl flex justify-between items-center h-[56px]">
            <span className="font-extrabold text-[#0B4D1E] text-lg">{filterTahunUtama}</span>
            <div className="flex flex-col">
              <button onClick={() => setFilterTahunUtama((parseInt(filterTahunUtama) + 1).toString())} className="text-gray-400 hover:text-[#0B4D1E] p-0.5"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg></button>
              <button onClick={() => setFilterTahunUtama((parseInt(filterTahunUtama) - 1).toString())} className="text-gray-400 hover:text-[#0B4D1E] p-0.5"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg></button>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY INFO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((c,i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
            <p className="text-gray-400 text-sm font-medium mb-1">{c.t}</p>
            <h3 className={`text-3xl font-extrabold ${c.c || 'text-[#0B4D1E]'}`}>{c.v}</h3>
            <p className="text-[10px] text-green-500 font-bold mt-1">{c.b}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-bold text-lg">Memuat data laporan...</div>
      ) : (
        <>
          {/* CHARTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="font-extrabold text-lg text-[#0B4D1E] mb-6">Tren Sampah per Bulan (kg)</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} /><YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} width={40} /><Tooltip cursor={{stroke: '#E5E7EB', strokeWidth: 2}} contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} /><Line type="monotone" dataKey="berat" stroke="#125B2A" strokeWidth={3} dot={{r: 4, fill: '#125B2A'}} activeDot={{r: 6}} /></LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="font-extrabold text-lg text-[#0B4D1E] mb-6">Nilai Ekonomi per Wilayah (Rp ribu)</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} /><YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} width={40} /><Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} formatter={(val) => `Rp ${val}k`} /><Bar dataKey="nilai" fill="#125B2A" radius={[4, 4, 0, 0]} /></BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          {pieData.length > 0 && (
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8 h-80 flex flex-col">
            <h3 className="font-extrabold text-lg text-[#0B4D1E] mb-6">Kontribusi per Kategori (kg)</h3>
            <div className="flex-1 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Tooltip contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} /><Pie data={pieData} innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">{pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie></PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          )}

          {/* REKAP TABEL */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-10 p-2">
            <h3 className="font-extrabold text-xl text-[#0B4D1E] m-6">Rekap per Wilayah</h3>
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F5EFE6] text-[#0B4D1E]">
                <tr><th className="px-8 py-5 font-bold rounded-l-xl">Wilayah</th><th className="px-8 py-5 font-bold">Total Berat</th><th className="px-8 py-5 font-bold">Nilai Ekonomi</th><th className="px-8 py-5 font-bold rounded-r-xl">KPI</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRekap.map((r) => (
                  <tr key={r.id} onClick={() => handleRowClick(r)} className="hover:bg-[#FDF6EA] transition-colors cursor-pointer group">
                    <td className="px-8 py-5 font-extrabold text-[#0B4D1E] group-hover:text-[#F4A300] transition-colors">{r.wilayah}</td>
                    <td className="px-8 py-5 font-bold text-[#0B4D1E]">{r.berat}</td>
                    <td className="px-8 py-5 font-extrabold text-green-600">{r.nilai}</td>
                    <td className="px-8 py-5 font-extrabold text-[#F4A300]">{r.kpi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* MODAL EXPORT */}
      {isExportOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-[#FDF6EA] p-3 rounded-2xl text-[#F4A300]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </div>
                <h3 className="text-2xl font-extrabold text-[#0B4D1E]">Export Laporan</h3>
              </div>
              <button onClick={() => setIsExportOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleExport} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Periode Bulan</label>
                <div className="relative">
                  <div onClick={() => setIsExportPeriodeOpen(!isExportPeriodeOpen)} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-bold text-[#0B4D1E] cursor-pointer flex justify-between items-center hover:bg-[#EAE5DA] transition-colors">
                    <span className="truncate">{exportPeriode}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0B4D1E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  {isExportPeriodeOpen && (
                    <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden py-1">
                      {periodeOptions.map(opt => (
                        <div key={opt} onClick={() => { setExportPeriode(opt); setIsExportPeriodeOpen(false); }} className={`px-5 py-2.5 cursor-pointer text-sm font-bold transition-colors ${exportPeriode === opt ? 'bg-[#0B4D1E] text-white' : 'text-[#0B4D1E] hover:bg-gray-100'}`}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Tahun Laporan</label>
                <div className="w-full bg-[#F5EFE6] border-none px-5 py-2.5 rounded-2xl flex justify-between items-center h-[56px]">
                  <span className="font-extrabold text-[#0B4D1E] text-lg">{exportYear}</span>
                  <div className="flex flex-col">
                    <button type="button" onClick={() => setExportYear((parseInt(exportYear) + 1).toString())} className="text-gray-400 hover:text-[#0B4D1E] p-0.5"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg></button>
                    <button type="button" onClick={() => setExportYear((parseInt(exportYear) - 1).toString())} className="text-gray-400 hover:text-[#0B4D1E] p-0.5"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg></button>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-8 pt-2">
                <button type="button" onClick={() => setIsExportOpen(false)} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
                <button type="submit" className="flex-1 bg-[#125B2A] text-white py-4 rounded-2xl font-bold hover:bg-[#0B4D1E] shadow-md flex items-center justify-center gap-2 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Download
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETAIL REKAP */}
      {isDetailOpen && selectedRow && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl relative animate-fade-in-up border border-gray-100">
             <button onClick={() => setIsDetailOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
             <h3 className="text-2xl font-extrabold text-[#0B4D1E] mb-6 border-b border-gray-100 pb-4">{selectedRow.wilayah}</h3>
             <div className="space-y-4">
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