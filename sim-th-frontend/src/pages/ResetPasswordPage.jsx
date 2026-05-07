import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const emailTerdeteksi = location.state?.emailDikirim || ''

  // STATE BARU: Untuk melacak user ada di langkah ke berapa
  const [step, setStep] = useState(1) // 1 = Input OTP, 2 = Input Password Baru

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [passwordBaru, setPasswordBaru] = useState('')
  const [konfirmPassword, setKonfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pesan, setPesan] = useState({ tipe: '', teks: '' })

  const inputRefs = useRef([])

  useEffect(() => {
    if (!emailTerdeteksi) {
      navigate('/forgot-password')
    }
  }, [emailTerdeteksi, navigate])

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false

    const newOtp = [...otp]
    newOtp[index] = element.value
    setOtp(newOtp)

    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  // Fungsi Transisi: Pindah dari Step 1 ke Step 2 (Hanya di Frontend)
  const handleLanjutKePassword = (e) => {
    e.preventDefault()
    const kodeOtpLengkap = otp.join('')
    
    if (kodeOtpLengkap.length < 6) {
      setPesan({ tipe: 'error', teks: 'Masukkan 6 digit kode OTP dengan lengkap!' })
      return
    }
    
    setPesan({ tipe: '', teks: '' })
    setStep(2) // Ubah UI ke mode input password
  }

  // Fungsi Final: Tembak Backend Nanda (Kirim OTP + Password barengan)
  const handleSubmitFinal = async (e) => {
    e.preventDefault()
    
    if (passwordBaru !== konfirmPassword) {
      setPesan({ tipe: 'error', teks: 'Konfirmasi password tidak cocok!' })
      return
    }

    setIsLoading(true)
    setPesan({ tipe: '', teks: '' })

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailTerdeteksi,
          otp: otp.join(''), // Ambil OTP dari state sebelumnya
          password_baru: passwordBaru
        })
      })

      const data = await response.json()

      if (response.status === 200) {
        alert("Password berhasil diubah! Silakan login kembali.")
        navigate('/login')
      } else {
        // Kalau error (misal OTP salah/kadaluarsa), kembalikan user ke Step 1
        setPesan({ tipe: 'error', teks: data.pesan || 'Gagal meriset password' })
        setStep(1) 
      }
    } catch (error) {
      setPesan({ tipe: 'error', teks: 'Koneksi gagal. Cek backend Nanda.' })
      setStep(1)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout 
        title={step === 1 ? "Verifikasi OTP" : "Buat Password Baru"} 
        subtitle={step === 1 ? `Masukkan kode OTP yang dikirim ke ${emailTerdeteksi}` : "Pastikan password baru Anda kuat dan aman"}
    >
      
      {pesan.teks && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm border ${
          pesan.tipe === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'
        }`}>
          {pesan.teks}
        </div>
      )}

      {/* TAMPILAN STEP 1: HANYA MUNCULKAN KOTAK OTP */}
      {step === 1 && (
        <form onSubmit={handleLanjutKePassword} className="flex flex-col gap-6">
          <div>
            <div className="flex justify-between gap-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="w-12 h-14 bg-[#F5F5F5] text-center text-xl font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] transition-all"
                />
              ))}
            </div>
          </div>
          <button type="submit" className="w-full bg-[#0A391D] text-white py-3.5 rounded-xl font-bold hover:bg-[#072a15] transition-all shadow-md">
            Lanjut
          </button>
        </form>
      )}

      {/* TAMPILAN STEP 2: HANYA MUNCULKAN KOTAK PASSWORD BARU */}
      {step === 2 && (
        <form onSubmit={handleSubmitFinal} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Password Baru</label>
            <input 
              type="password" 
              value={passwordBaru}
              onChange={(e) => setPasswordBaru(e.target.value)}
              required
              className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm"
              placeholder="Minimal 8 karakter"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
            <input 
              type="password" 
              value={konfirmPassword}
              onChange={(e) => setKonfirmPassword(e.target.value)}
              required
              className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm"
              placeholder="Ulangi password baru"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full text-white py-3.5 rounded-xl font-bold transition-all shadow-md ${isLoading ? 'bg-gray-400' : 'bg-[#0A391D] hover:bg-[#072a15]'}`}
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Password Baru'}
          </button>
          
          {/* Tombol back kalau user mau ngecek OTP-nya lagi */}
          <button 
            type="button" 
            onClick={() => setStep(1)}
            className="text-sm font-bold text-gray-500 hover:text-gray-700 mt-2"
          >
            ← Kembali ke OTP
          </button>
        </form>
      )}

    </AuthLayout>
  )
}

export default ResetPasswordPage