import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  
  const navigate = useNavigate()

  const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setErrorMsg('');

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: email, // Nanda minta username, tapi kita isi input email user
        password: password
      })
    });

    const data = await response.json();

    if (response.status === 200) {
      localStorage.setItem('token', data.token); // Simpan tiket masuk
      alert("Berhasil masuk ke dashboard!");
      // navigate('/dashboard');
    } else {
      setErrorMsg(data.pesan || "Username atau password salah.");
    }
  } catch (error) {
    setErrorMsg("Koneksi gagal. Cek apakah backend Nanda sudah nyala.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <AuthLayout title="Masuk" subtitle="Masuk untuk mengakses dashboard">
      {}
      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        
        {}
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
            {errorMsg}
          </div>
        )}

        {}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm transition-all"
            placeholder="nama@email.com"
          />
        </div>

        {}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Nangkep ketikan
            required
            className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm transition-all"
            placeholder="Masukkan password"
          />
        </div>

        {}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Role</label>
          <select className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm cursor-pointer transition-all">
            <option value="" disabled selected>Pilih Wilayah BEM</option>
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

        <div className="text-right">
          <Link to="/reset-password" className="text-sm font-bold text-[#F7941D] hover:underline">Lupa password?</Link>
        </div>

        {}
        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full text-white py-3.5 rounded-xl font-bold transition-all shadow-md mt-2 ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0A391D] hover:bg-[#072a15]'
          }`}
        >
          {isLoading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Belum punya akun? <Link to="/register" className="text-[#0A391D] font-extrabold hover:underline">Daftar di sini</Link>
      </p>
    </AuthLayout>
  )
}

export default LoginPage