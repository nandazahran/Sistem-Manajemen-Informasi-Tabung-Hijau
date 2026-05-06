import React from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

function ForgotPasswordPage() {
  return (
    <AuthLayout title="Reset Password" subtitle="Kami akan mengirimkan link reset ke email Anda">
      <form className="flex flex-col gap-6">
        
        {/* Input Email Saja */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            {/* Ikon Amplop (SVG statis dari desain) */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input 
              type="email" 
              className="w-full bg-[#F5F5F5] pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm transition-all"
              placeholder="nama@email.com"
            />
          </div>
        </div>

        {/* Tombol Kirim Link Reset */}
        <button className="w-full bg-[#0A391D] text-white py-3.5 rounded-xl font-bold hover:bg-[#072a15] transition-all shadow-md mt-2">
          Kirim Link Reset
        </button>
      </form>

      {/* Link kembali ke halaman Login */}
      <p className="mt-8 text-center text-sm text-gray-600">
        Sudah punya akun? <Link to="/login" className="text-[#0A391D] font-extrabold hover:underline">Masuk di sini</Link>
      </p>
    </AuthLayout>
  )
}

export default ForgotPasswordPage