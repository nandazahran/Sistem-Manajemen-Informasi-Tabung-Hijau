import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DashboardPage from './pages/DashboardPage'
import InputTransaksiPage from './pages/InputTransaksiPage'
import RiwayatTransaksiPage from './pages/RiwayatTransaksiPage'
import BukuTabunganPage from './pages/BukuTabunganPage'
import LeaderboardPage from './pages/LeaderboardPage'
import LaporanPage from './pages/LaporanPage'
import ProfilPage from './pages/ProfilPage'
import NotifikasiPage from './pages/NotifikasiPage';
import AktivitasPage from './pages/AktivitasPage';
import OtpPage from './pages/OtpPage';
import ResetPasswordAuthPage from './pages/ResetPasswordAuthPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/input-transaksi" element={<InputTransaksiPage />} />
        <Route path="/riwayat" element={<RiwayatTransaksiPage />} />
        <Route path="/tabungan" element={<BukuTabunganPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/laporan" element={<LaporanPage />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/notifikasi" element={<NotifikasiPage />} />
        <Route path="/aktivitas" element={<AktivitasPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/reset-password-auth" element={<ResetPasswordAuthPage />} />
      </Routes>
    </Router>
  )
}

export default App