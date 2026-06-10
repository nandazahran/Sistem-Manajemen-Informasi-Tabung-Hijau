import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

// Rute BEM Wilayah
import DashboardPage from './pages/DashboardPage'
import InputTransaksiPage from './pages/InputTransaksiPage'
import RiwayatTransaksiPage from './pages/RiwayatTransaksiPage'
import BukuTabunganPage from './pages/BukuTabunganPage'
import LeaderboardPage from './pages/LeaderboardPage'
import LaporanPage from './pages/LaporanPage'
import ProfilPage from './pages/ProfilPage'
import NotifikasiPage from './pages/NotifikasiPage'
import AktivitasPage from './pages/AktivitasPage'

// Rute Auth
import OtpPage from './pages/OtpPage'
import ResetPasswordAuthPage from './pages/ResetPasswordAuthPage'

// Rute Admin
import AdminDashboardPage from './pages/Admin/AdminDashboardPage'
import KelolaTransaksiPage from './pages/Admin/KelolaTransaksiPage'
import AdminRiwayatTransaksiPage from './pages/Admin/RiwayatTransaksiPage'
import KelolaUserPage from './pages/Admin/KelolaUserPage'
import KelolaWilayahPage from './pages/Admin/KelolaWilayahPage'
import KelolaKategoriPage from './pages/Admin/KelolaKategoriPage'
import AdminLeaderboardPage from './pages/Admin/LeaderboardPage'
import AdminLaporanPage from './pages/Admin/LaporanPage'
import AdminProfilPage from './pages/Admin/ProfilPage'
import AktivitasAdminPage from './pages/Admin/AktivitasAdminPage' 
import RiwayatHargaPage from './pages/Admin/RiwayatHargaPage' 
import AdminNotifikasiPage from './pages/Admin/AdminNotifikasiPage' // <--- IMPORT BARU ADMIN NOTIF

// Rute DUI
import DuiDashboardPage from './pages/dui/DuiDashboardPage'
import DuiMonitoringPage from './pages/dui/DuiMonitoringPage'
import DuiLeaderboardPage from './pages/dui/DuiLeaderboardPage'
import DuiLaporanPage from './pages/dui/DuiLaporanPage'
import DuiAktivitasPage from './pages/dui/DuiAktivitasPage'
import DuiProfilPage from './pages/dui/DuiProfilPage'
import DuiNotifikasiPage from './pages/dui/DuiNotifikasiPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Rute BEM Wilayah */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/input-transaksi" element={<InputTransaksiPage />} />
        <Route path="/riwayat" element={<RiwayatTransaksiPage />} />
        <Route path="/tabungan" element={<BukuTabunganPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/laporan" element={<LaporanPage />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/notifikasi" element={<NotifikasiPage />} />
        <Route path="/aktivitas" element={<AktivitasPage />} />
        
        {/* Rute Auth */}
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/reset-password-auth" element={<ResetPasswordAuthPage />} />
 
        {/* Rute Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/kelola-transaksi" element={<KelolaTransaksiPage />} />
        <Route path="/admin/riwayat-transaksi" element={<AdminRiwayatTransaksiPage />} />
        <Route path="/admin/kelola-user" element={<KelolaUserPage />} />
        <Route path="/admin/kelola-wilayah" element={<KelolaWilayahPage />} />
        <Route path="/admin/kelola-kategori" element={<KelolaKategoriPage />} />
        <Route path="/admin/leaderboard" element={<AdminLeaderboardPage />} /> 
        <Route path="/admin/laporan" element={<AdminLaporanPage />} />
        <Route path="/admin/profil" element={<AdminProfilPage />} />
        <Route path="/admin/aktivitas" element={<AktivitasAdminPage />} />
        <Route path="/admin/riwayat-harga" element={<RiwayatHargaPage />} />  
        <Route path="/admin/notifikasi" element={<AdminNotifikasiPage />} /> {/* <--- RUTE BARU ADMIN NOTIF */}

        {/* Rute DUI */}
        <Route path="/dui/dashboard" element={<DuiDashboardPage />} />
        <Route path="/dui/monitoring" element={<DuiMonitoringPage />} />
        <Route path="/dui/leaderboard" element={<DuiLeaderboardPage />} />
        <Route path="/dui/laporan" element={<DuiLaporanPage />} />
        <Route path="/dui/aktivitas" element={<DuiAktivitasPage />} />
        <Route path="/dui/profil" element={<DuiProfilPage />} />
        <Route path="/dui/notifikasi" element={<DuiNotifikasiPage />} />
        
      </Routes>
    </Router>
  )
}

export default App