import React from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

function LoginPage() {
  return (
    <AuthLayout title="Masuk" subtitle="Masuk untuk mengakses dashboard">
      <form className="flex flex-col gap-5">
        
        {/* Input Email */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
          <input 
            type="email" 
            className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm transition-all"
            placeholder="nama@email.com"
          />
        </div>

        {/* Input Password */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
          <input 
            type="password" 
            className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm transition-all"
            placeholder="Masukkan password"
          />
        </div>

        {/* Dropdown Role Wilayah BEM */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Role</label>
          <select className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm cursor-pointer transition-all">
            <option value="" disabled selected>Pilih Wilayah BEM</option>
            <option value="bem_km">BEM KM IPB</option>
            <option value="bem_fpik">BEM FPIK</option>
            <option value="bem_fk">BEM FK</option>
            <option value="bem_fmipa">BEM FMIPA</option>
            <option value="bem_fateta">BEM FATETA</option>
          </select>
        </div>

        {/* Link Lupa Password */}
        <div className="text-right">
          <Link to="/reset-password" className="text-sm font-bold text-[#F7941D] hover:underline">Lupa password?</Link>
        </div>

        {/* Tombol Masuk */}
        <button className="w-full bg-[#0A391D] text-white py-3.5 rounded-xl font-bold hover:bg-[#072a15] transition-all shadow-md mt-2">
          Masuk
        </button>
      </form>

      {/* Link ke Register */}
      <p className="mt-8 text-center text-sm text-gray-600">
        Belum punya akun? <Link to="/register" className="text-[#0A391D] font-extrabold hover:underline">Daftar di sini</Link>
      </p>
    </AuthLayout>
  )
}

export default LoginPage