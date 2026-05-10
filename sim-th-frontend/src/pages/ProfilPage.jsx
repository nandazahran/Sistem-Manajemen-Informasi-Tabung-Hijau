import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

function ProfilPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nama: 'BEM FATETA',
    email: 'bem.fateta@apps.ipb.ac.id',
    telepon: '0812-3456-7890',
    alamat: 'Fakultas Teknologi Pertanian, IPB University'
  });

  return (
    <DashboardLayout>
      <div className="bg-[#0B4D1E] rounded-[2.5rem] p-12 flex items-center gap-8 text-white shadow-sm mt-2 relative overflow-hidden">
        {/* Dekorasi BG */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        
        {/* Editable Avatar */}
        <div className="relative group cursor-pointer z-10">
          <div className="w-28 h-28 bg-[#F4A300] rounded-3xl flex items-center justify-center text-4xl font-extrabold shadow-lg">
            BF
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
        </div>

        <div className="z-10">
          <h2 className="text-4xl font-extrabold mb-2">Profil Wilayah</h2>
          <p className="text-green-100/80 font-medium mb-4">Kelola informasi akun Anda</p>
          <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm border border-white/30">BEM Wilayah</span>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-extrabold text-2xl text-[#0B4D1E]">Informasi Akun</h3>
          <button onClick={() => setIsEditing(!isEditing)} className="bg-[#EAE5DA] text-[#0B4D1E] px-6 py-2.5 rounded-full font-bold hover:bg-[#d8d1c1] transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            {isEditing ? 'Simpan Profil' : 'Edit Profil'}
          </button>
        </div>

        <div className="space-y-6">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-2 capitalize">
                {key === 'telepon' ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> : null}
                {key === 'email' ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> : null}
                {key === 'alamat' ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> : null}
                {key === 'nama' ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> : null}
                {key} {key === 'nama' ? 'Wilayah' : ''}
              </label>
              <input 
                type="text" 
                value={formData[key]} 
                onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                readOnly={!isEditing}
                className={`w-full px-5 py-4 rounded-2xl font-bold transition-all outline-none ${isEditing ? 'bg-white border-2 border-[#F4A300] text-[#0B4D1E]' : 'bg-[#F5EFE6] border-2 border-transparent text-[#0B4D1E]'}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 mt-8">
        <h3 className="font-extrabold text-2xl text-[#0B4D1E] mb-6">Keamanan</h3>
        <button className="w-full bg-[#F5EFE6] hover:bg-[#EAE5DA] px-6 py-5 rounded-2xl flex items-center justify-between transition-colors group">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-xl shadow-sm group-hover:text-[#0B4D1E]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <div className="text-left">
              <p className="font-bold text-[#0B4D1E]">Ubah Password</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Terakhir diubah 30 hari lalu</p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#0B4D1E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <button className="w-full mt-8 bg-[#FFF5F5] hover:bg-[#FFEBEB] text-red-600 border border-red-100 py-5 rounded-2rem font-bold flex items-center justify-center gap-3 transition-colors shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        Logout dari Akun
      </button>
    </DashboardLayout>
  );
}

export default ProfilPage;