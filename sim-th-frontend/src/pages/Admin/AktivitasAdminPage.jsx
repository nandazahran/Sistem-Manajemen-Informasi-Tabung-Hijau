import React from 'react';
import AdminLayout from '../../components/AdminLayout';

function AktivitasAdminPage() {
  return (
    <AdminLayout>
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex items-center gap-5 text-white mt-2 mb-8 shadow-sm">
        <div className="bg-[#F4A300] p-4 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold mb-1">Semua Aktivitas Sistem</h2>
          <p className="text-green-100/80 font-medium">Timeline lengkap aktivitas dan event sistem</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
        <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6 border-b border-gray-100 pb-4">Hari Ini</h3>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="bg-green-100 p-3 rounded-full text-green-600 h-12 w-12 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
            <div><p className="font-bold text-[#0B4D1E]">Transaksi baru masuk</p><p className="text-xs text-gray-500">BEM FATETA - Plastik 25kg</p><p className="text-[10px] text-gray-400 font-bold mt-1">5 menit lalu</p></div>
          </div>
          <div className="flex gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 h-12 w-12 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>
            <div><p className="font-bold text-[#0B4D1E]">User baru ditambahkan</p><p className="text-xs text-gray-500">BEM FAPET berhasil didaftarkan</p><p className="text-[10px] text-gray-400 font-bold mt-1">15 menit lalu</p></div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
export default AktivitasAdminPage;