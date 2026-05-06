import React from 'react'
import { Link } from 'react-router-dom'

function AuthLayout({ children, title, subtitle }) {
  return (
    // Background Cream Utama
    <div className="min-h-screen bg-[#FAF8F5] relative flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
      
      {/* Dekorasi Latar Belakang (Lingkaran Faint) */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#F2EDE4] rounded-full opacity-50"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-[#F2EDE4] rounded-full opacity-50"></div>

      {/* Tombol Kembali ke Beranda */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-[#0A391D] font-bold hover:underline z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Kembali ke Beranda
      </Link>

      {/* Logo Hijau Tengah */}
      <div className="bg-[#0A391D] p-4 rounded-2xl mb-8 z-10 shadow-lg">
        {/* Ikon Recycle Sederhana (Nanti bisa diganti SVG asli dari Figma) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>

      {/* Kotak Putih Utama */}
      <div className="bg-white w-full max-w-md rounded-[2rem] p-8 sm:p-10 shadow-xl z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#0A391D] mb-2">{title}</h1>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>

        {/* Area Form yang akan berganti-ganti (Login/Register) */}
        {children}

      </div>

      {/* Footer Kebijakan */}
      <p className="text-xs text-gray-400 mt-8 z-10 text-center max-w-sm">
        Dengan masuk, Anda menyetujui <span className="text-gray-600 font-semibold">Syarat & Ketentuan</span> dan <span className="text-gray-600 font-semibold">Kebijakan Privasi</span>
      </p>
    </div>
  )
}

export default AuthLayout