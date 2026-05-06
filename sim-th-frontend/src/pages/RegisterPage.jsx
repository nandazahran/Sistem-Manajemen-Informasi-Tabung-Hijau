import React from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

function RegisterPage() {
  return (
    <AuthLayout title="Daftar Akun" subtitle="Buat akun baru untuk memulai">
      <form className="flex flex-col gap-4">
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
          <input type="text" className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm" placeholder="Masukkan nama lengkap" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
          <input type="email" className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm" placeholder="nama@email.com" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
          <input type="password" className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm" placeholder="Masukkan password" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Konfirmasi Password</label>
          <input type="password" className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm" placeholder="Konfirmasi password" />
        </div>

        {/* Dropdown Role */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
          <select className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm cursor-pointer">
            <option value="" disabled selected>Pilih Wilayah BEM</option>
            <option value="bem_km">BEM KM IPB</option>
            <option value="bem_fpik">BEM FPIK</option>
            <option value="bem_fk">BEM FK</option>
          </select>
        </div>

        <button className="w-full bg-[#0A391D] text-white py-3.5 rounded-xl font-bold hover:bg-[#072a15] transition-all shadow-md mt-4">
          Daftar
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Sudah punya akun? <Link to="/login" className="text-[#0A391D] font-extrabold hover:underline">Masuk di sini</Link>
      </p>
    </AuthLayout>
  )
}

export default RegisterPage