import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function BukuTabunganPage() {
  const navigate = useNavigate();
  
  // State Modal Detail
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPemasukan, setSelectedPemasukan] = useState(null);

  // State Data Real
  const [saldo, setSaldo] = useState(0);
  const [namaWilayah, setNamaWilayah] = useState('Memuat...');
  const [riwayatPemasukan, setRiwayatPemasukan] = useState([]);
  const [pemasukanBulanIni, setPemasukanBulanIni] = useState(0);
  const [rataRataTrx, setRataRataTrx] = useState(0);
  
  // State Tambahan untuk Hitung Grafik & Tren
  const [grafikSaldo, setGrafikSaldo] = useState([]);
  const [trenPertumbuhan, setTrenPertumbuhan] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Ambil Data Tabungan, Transaksi, dan Wilayah Aktif secara paralel
        const [resTabungan, resTrx, resWil] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/tabungan`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/transaksi`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/wilayah/aktif`, { headers })
        ]);

        const dataTabungan = await resTabungan.json();
        const dataTrx = await resTrx.json();
        const dataWil = await resWil.json();

        // Extract activeWilayahId dari JWT token
        let activeWilayahId = null;
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            activeWilayahId = payload.wilayah_id;
          } catch (e) {
            console.error("Gagal parse token:", e);
          }
        }

        // Set nama default berdasarkan activeWilayahId fallback dari API aktif
        let myWilayah = 'BEM KM / Pusat';
        if (activeWilayahId && dataWil.status === 'sukses' && Array.isArray(dataWil.data)) {
          const matchedWil = dataWil.data.find(w => w.id === activeWilayahId);
          if (matchedWil) {
            myWilayah = matchedWil.nama;
            setNamaWilayah(myWilayah);
          }
        }

        if (dataTrx.status === 'sukses' && Array.isArray(dataTrx.data) && dataTrx.data.length > 0) {
          const allTrx = dataTrx.data;
          // Sortir transaksi dari yang terbaru ke terlama
          const sortedTrx = [...allTrx].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
          
          setRiwayatPemasukan(sortedTrx.slice(0, 5)); // Ambil 5 terbaru untuk list riwayat
          
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

          // Filter untuk hitung bulan ini & rata-rata
          let totalBulanIni = 0;
          let totalBulanLalu = 0;
          let totalAll = 0;

          sortedTrx.forEach(t => {
            const trxDate = new Date(t.tanggal);
            totalAll += t.total_nilai;
            if (trxDate.getMonth() === currentMonth && trxDate.getFullYear() === currentYear) {
              totalBulanIni += t.total_nilai;
            }
            if (trxDate.getMonth() === lastMonth && trxDate.getFullYear() === lastMonthYear) {
              totalBulanLalu += t.total_nilai;
            }
          });

          setPemasukanBulanIni(totalBulanIni);
          setRataRataTrx(sortedTrx.length > 0 ? totalAll / sortedTrx.length : 0);

          // LOGIKA HITUNG TREN PERTUMBUHAN
          if (totalBulanLalu > 0) {
             const selisih = totalBulanIni - totalBulanLalu;
             const persen = (selisih / totalBulanLalu) * 100;
             setTrenPertumbuhan(persen);
          } else if (totalBulanIni > 0) {
             setTrenPertumbuhan(100); 
          } else {
             setTrenPertumbuhan(0);
          }
        }

        if (dataTabungan.status === 'sukses' && Array.isArray(dataTabungan.data)) {
          // Cari dompet tabungan berdasarkan wilayah_id yang akurat
          const myDompet = dataTabungan.data.find(t => t.wilayah_id === activeWilayahId);
          if (myDompet) {
             setSaldo(myDompet.saldo);
             setNamaWilayah(myDompet.nama_wilayah);
             
             // Ambil riwayat grafik histori asli dari API Rust
             try {
                const resHistori = await fetch(`${import.meta.env.VITE_API_URL}/tabungan/histori?wilayah_id=${myDompet.wilayah_id}`, { headers });
                const dataHistori = await resHistori.json();
                if (dataHistori.status === 'sukses' && Array.isArray(dataHistori.data) && dataHistori.data.length > 0) {
                   const formatGrafik = dataHistori.data.map(d => ({
                      name: d.bulan,
                      Pemasukan: d.pemasukan,
                      Penarikan: d.penarikan
                   }));
                   setGrafikSaldo(formatGrafik);
                }
             } catch (err) {
                console.error("Gagal mengambil histori:", err);
             }
          }
        }
      } catch (err) {
        console.error("Gagal menarik data tabungan:", err);
      }
    };
    fetchData();
  }, []);

  const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  
  const formatTanggal = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const openDetail = (item) => {
    setSelectedPemasukan(item);
    setIsDetailOpen(true);
  };

  return (
    <DashboardLayout>
      <style>{`@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      
      {/* BANNER 1: TITLE */}
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex items-center justify-between shadow-sm mt-2 mb-6 text-white">
        <div className="flex items-center gap-5">
          <div className="bg-[#F4A300] p-4 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mb-1">Buku Tabungan</h2>
            <p className="text-green-100/80 font-medium">Rekap pendapatan dari sampah wilayah</p>
          </div>
        </div>
      </div>

      {/* BANNER 2: SALDO */}
      <div className="bg-gradient-to-r from-[#0B4D1E] to-[#146b2d] p-10 rounded-[2rem] text-white shadow-sm mb-6 flex justify-between items-center relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="z-10">
          <p className="text-green-100 font-medium mb-1">Total Saldo Tabungan</p>
          <h3 className="text-5xl font-extrabold mb-2">{formatRp(saldo)}</h3>
          <p className="text-sm text-green-200">Wilayah: {namaWilayah} • Otomatis sinkron</p>
        </div>
        <div className={`bg-white/20 px-5 py-2.5 rounded-full font-bold backdrop-blur-sm border border-white/30 flex items-center gap-2 z-10 ${trenPertumbuhan < 0 ? 'text-red-200' : 'text-white'}`}>
          {trenPertumbuhan >= 0 ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" /></svg>
          )}
          {trenPertumbuhan > 0 ? '+' : ''}{trenPertumbuhan.toFixed(1)}% bulan ini
        </div>
      </div>

      {/* GRAFIK PERKEMBANGAN SALDO (FIXED) */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-6 hover:-translate-y-1 transition-all duration-300">
        <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">Grafik Pendapatan</h3>
        
        {/* REVISI FIX: Flexbox dilepas dari div utama agar chart dapat merender width 100% */}
        <div className="w-full h-72 bg-white rounded-2xl pt-4 pr-4">
          {grafikSaldo && grafikSaldo.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={grafikSaldo} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} width={80} tickFormatter={(val) => `Rp ${val/1000}k`} />
                 <Tooltip cursor={{stroke: '#E5E7EB', strokeWidth: 2}} contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} formatter={(value, name) => [`${formatRp(value)}`, name]} />
                 <Line type="monotone" dataKey="Pemasukan" stroke="#125B2A" strokeWidth={4} dot={{r: 5, fill: '#125B2A'}} activeDot={{r: 8}} isAnimationActive={false} />
                 <Line type="monotone" dataKey="Penarikan" stroke="#EF4444" strokeWidth={4} dot={{r: 5, fill: '#EF4444'}} activeDot={{r: 8}} isAnimationActive={false} />
               </LineChart>
             </ResponsiveContainer>
          ) : (
             /* Flexbox diaktifkan khusus di blok kondisi kosong ini agar teks presisi di tengah */
             <div className="w-full h-full flex items-center justify-center">
               <p className="text-gray-400 font-medium">Belum ada data transaksi yang cukup untuk membuat grafik wilayah.</p>
             </div>
          )}
        </div>
      </div>

      {/* INFORMASI SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-all duration-300">
          <p className="text-gray-500 font-medium text-sm mb-1">Pemasukan Bulan Ini</p>
          <h3 className="text-3xl font-extrabold text-green-600">{formatRp(pemasukanBulanIni)}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-all duration-300">
          <p className="text-gray-500 font-medium text-sm mb-1">Rata-rata per Transaksi</p>
          <h3 className="text-3xl font-extrabold text-[#0B4D1E]">{formatRp(rataRataTrx)}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-all duration-300">
          <p className="text-gray-500 font-medium text-sm mb-1">Tren Bulan ke Bulan</p>
          <h3 className={`text-3xl font-extrabold ${trenPertumbuhan >= 0 ? 'text-[#0B4D1E]' : 'text-red-500'}`}>
            {trenPertumbuhan > 0 ? '+' : ''}{trenPertumbuhan.toFixed(1)}%
          </h3>
        </div>
      </div>

      {/* RIWAYAT PEMASUKAN */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-6 hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-extrabold text-xl text-[#0B4D1E]">Riwayat Pemasukan Terakhir</h3>
          <button onClick={() => navigate('/riwayat')} className="text-sm font-bold text-[#0B4D1E] hover:text-[#F4A300] transition-colors">Lihat Semua →</button>
        </div>
        <div className="space-y-4">
          {riwayatPemasukan.map((item, idx) => (
            <div key={idx} onClick={() => openDetail(item)} className="flex justify-between items-center bg-[#F5EFE6] p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-gray-200 group">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-2.5 rounded-xl text-[#125B2A] group-hover:bg-[#125B2A] group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19L19 5M19 5v10M19 5H9" /></svg>
                </div>
                <div>
                  <p className="font-bold text-[#0B4D1E] group-hover:text-[#F4A300] transition-colors">Setoran {item.nama_kategori}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatTanggal(item.tanggal)}</p>
                </div>
              </div>
              <div className="font-extrabold text-green-600">+ {formatRp(item.total_nilai)}</div>
            </div>
          ))}
          {riwayatPemasukan.length === 0 && <p className="text-center text-sm font-bold text-gray-400 py-4">Belum ada pemasukan tabungan.</p>}
        </div>
      </div>

      {/* MODAL DETAIL PEMASUKAN */}
      {isDetailOpen && selectedPemasukan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-fade-in-up border border-gray-100">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full text-[#125B2A]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19L19 5M19 5v10M19 5H9" /></svg>
                </div>
                <h3 className="text-2xl font-extrabold text-[#0B4D1E]">Detail Pemasukan</h3>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* List Detail */}
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <p className="text-gray-500 font-medium text-sm">Tanggal Setoran</p>
                <p className="font-extrabold text-[#0B4D1E]">{formatTanggal(selectedPemasukan.tanggal)}</p>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <p className="text-gray-500 font-medium text-sm">Kategori Sampah</p>
                <span className="bg-[#EAE5DA] text-[#0B4D1E] px-4 py-1.5 rounded-full font-bold text-xs">{selectedPemasukan.nama_kategori}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <p className="text-gray-500 font-medium text-sm">Berat Sampah</p>
                <p className="font-extrabold text-[#0B4D1E] text-base">{(selectedPemasukan.berat || selectedPemasukan.berat_gram || 0) / 1000} kg</p>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <p className="text-gray-500 font-medium text-sm">Saldo Bertambah</p>
                <p className="font-extrabold text-green-600 text-lg">+ {formatRp(selectedPemasukan.total_nilai)}</p>
              </div>
              
              <div className="pt-2 pb-2">
                <p className="text-gray-500 font-medium text-sm mb-3">Catatan Transaksi</p>
                <div className="bg-[#F5EFE6] p-5 rounded-2xl">
                  <p className="font-bold text-[#0B4D1E] text-sm leading-relaxed">{selectedPemasukan.catatan || 'Tidak ada catatan untuk setoran ini.'}</p>
                </div>
              </div>
            </div>

            {/* Tombol Tutup */}
            <button onClick={() => setIsDetailOpen(false)} className="w-full bg-[#125B2A] text-white py-4 rounded-2xl font-bold mt-6 hover:bg-[#0B4D1E] shadow-md transition-all">
              Tutup
            </button>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

export default BukuTabunganPage;