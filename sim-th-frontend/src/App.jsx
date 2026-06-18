import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
// Rute Admin
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import AdminNotifikasiPage from "./pages/Admin/AdminNotifikasiPage"; // <--- IMPORT BARU ADMIN NOTIF
import AktivitasAdminPage from "./pages/Admin/AktivitasAdminPage";
import KelolaKategoriPage from "./pages/Admin/KelolaKategoriPage";
import KelolaTransaksiPage from "./pages/Admin/KelolaTransaksiPage";
import KelolaUserPage from "./pages/Admin/KelolaUserPage";
import KelolaWilayahPage from "./pages/Admin/KelolaWilayahPage";
import AdminLaporanPage from "./pages/Admin/LaporanPage";
import AdminLeaderboardPage from "./pages/Admin/LeaderboardPage";
import AdminProfilPage from "./pages/Admin/ProfilPage";
import RiwayatHargaPage from "./pages/Admin/RiwayatHargaPage";
import AdminRiwayatTransaksiPage from "./pages/Admin/RiwayatTransaksiPage";
import AktivitasPage from "./pages/AktivitasPage";
import BukuTabunganPage from "./pages/BukuTabunganPage";
// Rute BEM Wilayah
import DashboardPage from "./pages/DashboardPage";
import DuiAktivitasPage from "./pages/dui/DuiAktivitasPage";
// Rute DUI
import DuiDashboardPage from "./pages/dui/DuiDashboardPage";
import DuiLaporanPage from "./pages/dui/DuiLaporanPage";
import DuiLeaderboardPage from "./pages/dui/DuiLeaderboardPage";
import DuiMonitoringPage from "./pages/dui/DuiMonitoringPage";
import DuiNotifikasiPage from "./pages/dui/DuiNotifikasiPage";
import DuiProfilPage from "./pages/dui/DuiProfilPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import InputTransaksiPage from "./pages/InputTransaksiPage";
import LandingPage from "./pages/LandingPage";
import LaporanPage from "./pages/LaporanPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import LoginPage from "./pages/LoginPage";
import NotifikasiPage from "./pages/NotifikasiPage";
// Rute Auth
import OtpPage from "./pages/OtpPage";
import ProfilPage from "./pages/ProfilPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import RiwayatTransaksiPage from "./pages/RiwayatTransaksiPage";

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
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute allowedRoles={["bem_wilayah"]}>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/input-transaksi"
					element={
						<ProtectedRoute allowedRoles={["bem_wilayah"]}>
							<InputTransaksiPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/riwayat"
					element={
						<ProtectedRoute allowedRoles={["bem_wilayah"]}>
							<RiwayatTransaksiPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/tabungan"
					element={
						<ProtectedRoute allowedRoles={["bem_wilayah"]}>
							<BukuTabunganPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/leaderboard"
					element={
						<ProtectedRoute allowedRoles={["bem_wilayah"]}>
							<LeaderboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/laporan"
					element={
						<ProtectedRoute allowedRoles={["bem_wilayah"]}>
							<LaporanPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/profil"
					element={
						<ProtectedRoute allowedRoles={["bem_wilayah"]}>
							<ProfilPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/notifikasi"
					element={
						<ProtectedRoute allowedRoles={["bem_wilayah"]}>
							<NotifikasiPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/aktivitas"
					element={
						<ProtectedRoute allowedRoles={["bem_wilayah"]}>
							<AktivitasPage />
						</ProtectedRoute>
					}
				/>
				{/* Rute Auth */}
				<Route path="/otp" element={<OtpPage />} />
				{/* Rute Admin */}
				<Route
					path="/admin/dashboard"
					element={
						<ProtectedRoute allowedRoles={["admin", "superadmin", "bem_km"]}>
							<AdminDashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/kelola-transaksi"
					element={
						<ProtectedRoute allowedRoles={["admin", "superadmin", "bem_km"]}>
							<KelolaTransaksiPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/riwayat-transaksi"
					element={
						<ProtectedRoute allowedRoles={["admin", "superadmin", "bem_km"]}>
							<AdminRiwayatTransaksiPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/kelola-user"
					element={
						<ProtectedRoute allowedRoles={["admin", "superadmin", "bem_km"]}>
							<KelolaUserPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/kelola-wilayah"
					element={
						<ProtectedRoute allowedRoles={["admin", "superadmin", "bem_km"]}>
							<KelolaWilayahPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/kelola-kategori"
					element={
						<ProtectedRoute allowedRoles={["admin", "superadmin", "bem_km"]}>
							<KelolaKategoriPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/leaderboard"
					element={
						<ProtectedRoute allowedRoles={["admin", "superadmin", "bem_km"]}>
							<AdminLeaderboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/laporan"
					element={
						<ProtectedRoute allowedRoles={["admin", "superadmin", "bem_km"]}>
							<AdminLaporanPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/profil"
					element={
						<ProtectedRoute allowedRoles={["admin", "superadmin", "bem_km"]}>
							<AdminProfilPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/aktivitas"
					element={
						<ProtectedRoute allowedRoles={["admin", "superadmin", "bem_km"]}>
							<AktivitasAdminPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/riwayat-harga"
					element={
						<ProtectedRoute allowedRoles={["admin", "superadmin", "bem_km"]}>
							<RiwayatHargaPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/notifikasi"
					element={
						<ProtectedRoute allowedRoles={["admin", "superadmin", "bem_km"]}>
							<AdminNotifikasiPage />
						</ProtectedRoute>
					}
				/>{" "}
				{/* <--- RUTE BARU ADMIN NOTIF */}
				{/* Rute DUI */}
				<Route
					path="/dui/dashboard"
					element={
						<ProtectedRoute allowedRoles={["dui"]}>
							<DuiDashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dui/monitoring"
					element={
						<ProtectedRoute allowedRoles={["dui"]}>
							<DuiMonitoringPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dui/leaderboard"
					element={
						<ProtectedRoute allowedRoles={["dui"]}>
							<DuiLeaderboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dui/laporan"
					element={
						<ProtectedRoute allowedRoles={["dui"]}>
							<DuiLaporanPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dui/aktivitas"
					element={
						<ProtectedRoute allowedRoles={["dui"]}>
							<DuiAktivitasPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dui/profil"
					element={
						<ProtectedRoute allowedRoles={["dui"]}>
							<DuiProfilPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dui/notifikasi"
					element={
						<ProtectedRoute allowedRoles={["dui"]}>
							<DuiNotifikasiPage />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
