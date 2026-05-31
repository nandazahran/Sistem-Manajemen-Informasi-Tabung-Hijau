import React from 'react';
import AdminLayout from '../../components/AdminLayout';

function RiwayatHargaPage() {
  const data = [
    { tgl: '8 Mei 2026', kat: 'Plastik', old: 'Rp 4.000', new: 'Rp 4.500', change: '+12.5%', admin: 'Admin SIM-TH' },
    { tgl: '7 Mei 2026', kat: 'Kertas', old: 'Rp 2.000', new: 'Rp 2.500', change: '+25%', admin: 'Admin SIM-TH' },
    { tgl: '5 Mei 2026', kat: 'Kaca', old: 'Rp 2.200', new: 'Rp 2.000', change: '-9.09%', admin: 'Admin SIM-TH', drop: true },
  ];

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
            {data.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-8 py-5 font-medium text-gray-500">{r.tgl}</td><td className="px-8 py-5 font-extrabold text-[#0B4D1E]">{r.kat}</td><td className="px-8 py-5 text-gray-400 font-medium">{r.old}</td><td className="px-8 py-5 font-extrabold text-green-600">{r.new}</td>
                <td className={`px-8 py-5 font-bold ${r.drop ? 'text-red-500' : 'text-green-500'}`}>{r.change}</td><td className="px-8 py-5 text-gray-400 text-sm">{r.admin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
export default RiwayatHargaPage;