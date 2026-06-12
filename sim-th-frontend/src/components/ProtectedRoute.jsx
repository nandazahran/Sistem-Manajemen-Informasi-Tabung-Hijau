import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  const location = useLocation();

  // Jika tidak ada token, arahkan kembali ke login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Cek Role jika diberikan props allowedRoles
  if (allowedRoles && allowedRoles.length > 0 && userStr) {
    try {
      const user = JSON.parse(userStr);
      let hasAccess = allowedRoles.includes(user.role);
      
      // Jika allowedRoles mencakup 'bem_wilayah', izinkan semua role yang diawali 'bem_' atau 'ormawa_' kecuali 'bem_km'
      if (!hasAccess && allowedRoles.includes('bem_wilayah')) {
        if (user.role && (user.role.startsWith('bem_') || user.role.startsWith('ormawa_')) && user.role !== 'bem_km') {
          hasAccess = true;
        }
      }

      if (!hasAccess) {
        // Jika role tidak sesuai, arahkan ke dashboard masing-masing sesuai role
        if (['admin', 'superadmin', 'bem_km'].includes(user.role)) {
          return <Navigate to="/admin/dashboard" replace />;
        } else if (user.role === 'dui') {
          return <Navigate to="/dui/dashboard" replace />;
        } else {
          return <Navigate to="/dashboard" replace />;
        }
      }
    } catch (err) {
      console.error("Gagal membaca role user", err);
      // Fallback jika json parse gagal
      return <Navigate to="/login" replace />;
    }
  }

  // Jika lolos pengecekan, tampilkan komponen halamannya
  return children;
}

export default ProtectedRoute;
