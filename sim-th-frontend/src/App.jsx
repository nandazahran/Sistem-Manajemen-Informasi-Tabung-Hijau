import React from 'react'

function App() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 w-full font-sans">
      
      {/* Card Utama */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-8 border-[#2D5A27] mx-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-[#2D5A27]">GreenPoint</h1>
          <p className="text-gray-400 mt-2">Sistem Manajemen Tabung Hijau</p>
        </div>

        <form className="space-y-6">
          {/* Input Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email IPB</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
              placeholder="ananta_sakha@apps.ipb.ac.id"
            />
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
              placeholder="••••••••"
            />
            <div className="text-right mt-2">
              <a href="#" className="text-xs text-[#2D5A27] hover:underline font-bold">Lupa Password?</a>
            </div>
          </div>

          {/* Tombol Login */}
          <button className="w-full bg-[#2D5A27] text-white py-3.5 rounded-xl font-bold hover:bg-[#244a20] transform hover:scale-[1.02] transition-all shadow-lg">
            Masuk Sekarang
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Belum punya akun? <a href="#" className="text-[#2D5A27] font-extrabold hover:underline">Daftar di sini</a>
        </p>
      </div>
    </div>
  )
}

export default App