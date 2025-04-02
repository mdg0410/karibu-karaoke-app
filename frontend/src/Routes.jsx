import { Routes, Route, Navigate } from 'react-router-dom';
import MesaSelection from './pages/MesaSelection';
import AdminLogin from './pages/AdminLogin';
import StaffLogin from './pages/StaffLogin';
import Home from './pages/Home'; // Tu página principal

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mesa-selection" element={<MesaSelection />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/staff-login" element={<StaffLogin />} />
      {/* Ruta para manejar URLs no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes; 