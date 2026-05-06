import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

function RegisterPage() {
  // 1. Siapin State untuk semua inputan form
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [konfirmPassword, setKonfirmPassword] = useState('')
  const [role, setRole] = useState('') // State untuk nyimpen pilihan BEM

  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  // 2. Fungsi hit API Register ke Backend Nanda
  const handleRegister = async (e) => {
    e.preventDefault()
    
    // Pengecekan sebelum dikirim: Pastikan password konfirmasi sama
    if (password !== konfirmPassword) {
      setErrorMsg('Password dan Konfirmasi Password tidak cocok!')
      return
    }
    
    // Pastikan user milih role, bukan ngebiarin kosong
    if (!role) {
      setErrorMsg('Pilih wilayah BEM terlebih dahulu!')
      return
    }

    setIsLoading(true)
    setErrorMsg('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: nama,
          email: email,
          // Bikin username otomatis ngambil dari kata di depan @ email
          username: email.split('@')[0], 
          password: password,
          role: role,
          wilayah_id: null // Opsional dari BE, kita set null dulu
        })
      })

      const data = await response.json()

      // 201 artinya data berhasil "Diciptakan" di database
      if (response.status === 201) {
        alert("Pendaftaran berhasil! Silakan login dengan akun Anda.")
        navigate('/login') // Lempar user ke halaman login
      } else {
        setErrorMsg(data.pesan || "Pendaftaran gagal. Email mungkin sudah terdaftar.")
      }
    } catch (error) {
      setErrorMsg("Koneksi gagal. Pastikan backend sudah menyala.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Daftar Akun" subtitle="Buat akun baru untuk memulai">
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        
        {/* Kotak Pesan Error */}
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
          <input 
            type="text" 
            value={nama} 
            onChange={(e) => setNama(e.target.value)} 
            required 
            className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm" 
            placeholder="Masukkan nama lengkap" 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Email IPB</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm" 
            placeholder="nama@apps.ipb.ac.id" 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm" 
            placeholder="Masukkan password" 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Konfirmasi Password</label>
          <input 
            type="password" 
            value={konfirmPassword} 
            onChange={(e) => setKonfirmPassword(e.target.value)} 
            required 
            className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm" 
            placeholder="Konfirmasi password" 
          />
        </div>

        {/* Dropdown Role BEM yang udah disamain dengan halaman Login */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            required 
            className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm cursor-pointer"
          >
            <option value="" disabled>Pilih Wilayah BEM</option>
            <option value="bem_km">BEM KM IPB</option>
            <option value="bem_faperta">BEM FAPERTA</option>
            <option value="bem_skhb">BEM SKHB</option>
            <option value="bem_fpik">BEM FPIK</option>
            <option value="bem_fapet">BEM FAPET</option>
            <option value="bem_fahutan">BEM FAHUTAN</option>
            <option value="bem_fateta">BEM FATETA</option>
            <option value="bem_fmipa">BEM FMIPA</option>
            <option value="bem_fem">BEM FEM</option>
            <option value="bem_fema">BEM FEMA</option>
            <option value="bem_vokasi">BEM VOKASI</option>
            <option value="bem_sb">BEM SB</option>
            <option value="bem_fk">BEM FK</option>
            <option value="bem_ssmi">BEM SSMI</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={isLoading} 
          className={`w-full text-white py-3.5 rounded-xl font-bold transition-all shadow-md mt-4 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0A391D] hover:bg-[#072a15]'}`}
        >
          {isLoading ? 'Memproses...' : 'Daftar'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Sudah punya akun? <Link to="/login" className="text-[#0A391D] font-extrabold hover:underline">Masuk di sini</Link>
      </p>
    </AuthLayout>
  )
}

export default RegisterPage