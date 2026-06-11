import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // State Baru buat Fitur Mata dan Ingat Saya
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  // Auto-redirect jika sudah punya token (fitur Ingat Saya bekerja)
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (['admin', 'superadmin', 'bem_km'].includes(user.role)) {
          navigate('/admin/dashboard');
        } else if (user.role === 'dui') {
          navigate('/dui/dashboard');
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error("Gagal parsing data user", err);
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email.split('@')[0], password: password }) // BE Nanda pakai 'username'
      });

      const data = await response.json();

      if (response.status === 200) {
        if (data.status === 'butuh_otp') {
          // Navigate to OTP page
          navigate('/otp', { 
            state: { 
              username: email.split('@')[0], 
              preAuthToken: data.token, 
              role: data.role, 
              nama: data.nama, 
              rememberMe 
            } 
          });
          return;
        }

        // Logika Ingat Saya
        const userData = { role: data.role, nama: data.nama };
        if (rememberMe) {
          localStorage.setItem('token', data.token); // Nempel permanen
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          sessionStorage.setItem('token', data.token); // Hilang pas tab ditutup
          sessionStorage.setItem('user', JSON.stringify(userData));
        }
        alert("Berhasil masuk ke dashboard!");
        
        if (data.role === 'admin' || data.role === 'superadmin' || data.role === 'bem_km') {
          navigate('/admin/dashboard');
        } else if (data.role === 'dui') {
          navigate('/dui/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setErrorMsg(data.pesan || "Username atau password salah.");
      }
    } catch (error) {
      setErrorMsg("Koneksi gagal. Cek apakah backend sudah nyala.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Masuk" subtitle="Masuk untuk mengakses dashboard">
      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Email IPB</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm" placeholder="nama@apps.ipb.ac.id" />
        </div>

        {/* Input Password dengan Ikon Mata */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full bg-[#F5F5F5] px-4 py-3 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] text-sm" 
              placeholder="••••••••" 
            />
            {/* Tombol Toggle Mata */}
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#0A391D]"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Fitur Ingat Saya & Lupa Password */}
        <div className="flex justify-between items-center mt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 text-[#0A391D] rounded border-gray-300 focus:ring-[#0A391D]" />
            <span className="text-sm text-gray-600 font-medium">Ingat Saya</span>
          </label>
          <Link to="/reset-password" className="text-sm font-bold text-[#F7941D] hover:underline">Lupa password?</Link>
        </div>

        <button type="submit" disabled={isLoading} className={`w-full text-white py-3.5 rounded-xl font-bold transition-all shadow-md mt-2 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0A391D] hover:bg-[#072a15]'}`}>
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