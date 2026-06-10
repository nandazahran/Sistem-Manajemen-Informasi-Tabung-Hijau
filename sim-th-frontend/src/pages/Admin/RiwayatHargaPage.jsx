import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

function RiwayatHargaPage() {
  const [riwayatData, setRiwayatData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRiwayat = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${import.meta.env.VITE_API_URL}/riwayat-harga`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resData = await response.json();

        if (resData.status === 'sukses') {
          const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
          const mappedData = resData.data.map(item => {
            const dateObj = new Date(item.tanggal_perubahan);
            const timeStr = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            
            let changePercent = 0;
            let isDrop = false;
            if (item.harga_lama > 0) {
              changePercent = ((item.harga_baru - item.harga_lama) / item.harga_lama) * 100;
              isDrop = changePercent < 0;
            }

            const changeText = changePercent > 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`;

            return {
              id: item.id,
              tgl: timeStr,
              kat: item.nama_kategori,
              old: formatRp(item.harga_lama),
              new: formatRp(item.harga_baru),
              change: changeText,
              drop: isDrop,
              admin: item.diubah_oleh || 'Sistem'
            };
          });
          setRiwayatData(mappedData);
        }
      } catch (error) {
        console.error("Gagal mengambil data riwayat harga:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRiwayat();
  }, []);

  return (
    <AdminLayout>
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex items-center gap-5 text-white mt-2 mb-8 shadow-sm">
        <div className="bg-[#F4A300] p-4 rounded-2xl"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
        <div>
          <h2 className="text-3xl font-extrabold mb-1">Riwayat Perubahan Harga</h2>
          <p className="text-green-100/80 font-medium">Semua perubahan harga kategori sampah</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-10">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#F5EFE6] text-[#0B4D1E]">
            <tr><th className="px-8 py-5 font-bold">Tanggal</th><th className="px-8 py-5 font-bold">Kategori</th><th className="px-8 py-5 font-bold">Harga Lama</th><th className="px-8 py-5 font-bold">Harga Baru</th><th className="px-8 py-5 font-bold">Perubahan</th><th className="px-8 py-5 font-bold">Admin</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500 font-medium animate-pulse">Memuat riwayat harga...</td>
              </tr>
            ) : riwayatData.length > 0 ? (
              riwayatData.map((r, i) => (
                <tr key={r.id || i} className="hover:bg-gray-50">
                  <td className="px-8 py-5 font-medium text-gray-500">{r.tgl}</td>
                  <td className="px-8 py-5 font-extrabold text-[#0B4D1E]">{r.kat}</td>
                  <td className="px-8 py-5 text-gray-400 font-medium">{r.old}</td>
                  <td className="px-8 py-5 font-extrabold text-green-600">{r.new}</td>
                  <td className={`px-8 py-5 font-bold ${r.drop ? 'text-red-500' : 'text-green-500'}`}>{r.change}</td>
                  <td className="px-8 py-5 text-gray-400 text-sm">{r.admin}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500 font-medium">Belum ada riwayat perubahan harga.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
export default RiwayatHargaPage;