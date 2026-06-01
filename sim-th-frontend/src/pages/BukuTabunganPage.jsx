import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Ambil Data Tabungan dan Transaksi
        const [resTabungan, resTrx] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/tabungan`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/transaksi`, { headers })
        ]);

        const dataTabungan = await resTabungan.json();
        const dataTrx = await resTrx.json();

        let myWilayah = 'BEM KM / Pusat';
        if (dataTrx.status === 'sukses' && dataTrx.data.length > 0) {
          const myTrx = dataTrx.data.sort((a, b) => b.id - a.id);
          setRiwayatPemasukan(myTrx.slice(0, 5)); // Ambil 5 terbaru
          myWilayah = myTrx[0].nama_wilayah;
          setNamaWilayah(myWilayah);
          
          const totalNilai = myTrx.reduce((sum, t) => sum + t.total_nilai, 0);
          setPemasukanBulanIni(totalNilai);
          setRataRataTrx(myTrx.length > 0 ? totalNilai / myTrx.length : 0);
        }

        if (dataTabungan.status === 'sukses') {
          const myDompet = dataTabungan.data.find(t => t.nama_wilayah === myWilayah);
          if (myDompet) setSaldo(myDompet.saldo);
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
        <div className="bg-white/20 px-5 py-2.5 rounded-full font-bold backdrop-blur-sm border border-white/30 flex items-center gap-2 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          +28% bulan ini
        </div>
      </div>

      {/* GRAFIK PERKEMBANGAN SALDO */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-6 hover:-translate-y-1 transition-all duration-300">
        <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">Perkembangan Saldo</h3>
        <div className="w-full h-64 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center">
          <p className="text-gray-400 font-medium">Grafik Line Chart Saldo</p>
        </div>
      </div>

      {/* RIWAYAT PEMASUKAN */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-6 hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-extrabold text-xl text-[#0B4D1E]">Riwayat Pemasukan</h3>
          <button onClick={() => navigate('/riwayat-transaksi')} className="text-sm font-bold text-[#0B4D1E] hover:text-[#F4A300] transition-colors">Lihat Semua →</button>
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

      {/* INFORMASI SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-all duration-300">
          <p className="text-gray-500 font-medium text-sm mb-1">Pemasukan Bulan Ini</p>
          <h3 className="text-3xl font-extrabold text-green-600">{formatRp(pemasukanBulanIni)}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-all duration-300">
          <p className="text-gray-500 font-medium text-sm mb-1">Rata-rata per Transaksi</p>
          <h3 className="text-3xl font-extrabold text-[#0B4D1E]">{formatRp(rataRataTrx)}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-all duration-300">
          <p className="text-gray-500 font-medium text-sm mb-1">Pertumbuhan</p>
          <h3 className="text-3xl font-extrabold text-[#0B4D1E]">+28%</h3>
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