import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

function ForgotPasswordPage() {
  // 1. Siapkan state untuk input email, loading, dan pesan
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pesan, setPesan] = useState({ tipe: '', teks: '' })
  
  const navigate = useNavigate()

  // 2. Fungsi untuk nembak API backend
  const handleRequestOTP = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setPesan({ tipe: '', teks: '' })

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/lupa-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      })

      const data = await response.json()

      // Kalau sukses ngirim email (Status 200 dari Rust)
      if (response.status === 200) {
        setPesan({ tipe: 'sukses', teks: data.pesan })
        
        // Tunggu 2 detik biar user baca suksesnya, lalu lempar ke halaman Reset
        setTimeout(() => {
          // Bawa data email ke halaman selanjutnya biar user gak usah ngetik ulang
          navigate('/reset-password', { state: { emailDikirim: email } }) 
        }, 2000)
      } else {
        // Kalau email gak ketemu / error
        setPesan({ tipe: 'error', teks: data.pesan || 'Gagal mengirim OTP' })
      }
    } catch (error) {
      setPesan({ tipe: 'error', teks: 'Koneksi gagal. Pastikan backend menyala.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Lupa Password" subtitle="Kami akan mengirimkan 6 digit OTP ke email Anda">
      <form onSubmit={handleRequestOTP} className="flex flex-col gap-6">
        
        {/* Kotak Pesan Error / Sukses */}
        {pesan.teks && (
          <div className={`px-4 py-3 rounded-xl text-sm border ${
            pesan.tipe === 'sukses' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'
          }`}>
            {pesan.teks}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Email IPB</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Tangkap ketikan user
              required
              className="w-full bg-[#F5F5F5] pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4D1E] text-sm transition-all"
              placeholder="nama@apps.ipb.ac.id"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full text-white py-3.5 rounded-xl font-bold transition-all shadow-md mt-2 ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0B4D1E] hover:bg-[#072a15]'
          }`}
        >
          {isLoading ? 'Mengirim...' : 'Kirim Kode OTP'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Sudah ingat passwordnya? <Link to="/login" className="text-[#0B4D1E] font-extrabold hover:underline">Masuk di sini</Link>
      </p>
    </AuthLayout>
  )
}

export default ForgotPasswordPage