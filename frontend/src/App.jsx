import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Componentes
import Navbar from './components/Navbar';
import OptionsGrid from './components/OptionsGrid';
import Toast from './components/Toast';
import ClienteDashboard from './pages/Cliente/ClienteDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import StaffDashboard from './pages/Staff/StaffDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import MesaSelection from './pages/MesaSelection';
import AdminLogin from './pages/AdminLogin';
import StaffLogin from './pages/StaffLogin';

// Contexto de autenticación
import { AuthProvider, useAuth } from './context/AuthContext';

// Componente que verifica si el cliente ya está autenticado
const HomeRoute = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    // Verificar si hay datos de cliente en localStorage
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role === 'cliente' && userData.mesaId) {
        // Redirigir al dashboard de cliente con el ID de mesa
        navigate(`/client/${userData.mesaId}`, { replace: true });
        return;
      }
    }
    setChecking(false);
  }, [navigate]);
  
  if (checking) {
    return (
      <div className="flex justify-center items-center h-screen bg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <>
      <Navbar />
      <main className="text-center py-8 sm:py-12 md:py-16 px-0 relative">
        <div className="before:content-['KARIBU'] before:text-[20vw] before:absolute before:opacity-[0.03] before:top-0 before:left-1/2 before:-translate-x-1/2 before:font-extrabold before:-z-10 before:whitespace-nowrap">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4 uppercase leading-none tracking-tight relative inline-block after:content-[''] after:absolute after:h-2 sm:after:h-3 after:w-[70%] after:bg-primary after:bottom-[-5px] after:left-[15%] after:-z-10">
            {t('main.welcome')}
          </h1>
          <p className="text-lg sm:text-xl mb-8 sm:mb-12 text-white/70 max-w-2xl mx-auto px-4 sm:px-6 md:px-0">
            {t('main.choosePortal')}
          </p>
          <OptionsGrid onApiResponse={() => {}} />
        </div>
      </main>
    </>
  );
};

// Componente contenedor principal
const AppContent = () => {
  const { t } = useTranslation();
  const { useFallback } = useAuth();
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleApiResponse = ({ message, type }) => {
    setToast({ message, type });
  };

  const clearToast = () => {
    setToast({ message: '', type: 'success' });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 overflow-hidden">
      {useFallback && (
        <div className="bg-yellow-600 text-white p-2 text-center text-sm mb-4">
          ⚠️ Modo de contingencia activo: Usando datos simulados debido a problemas de conexión HTTPS con el servidor. Es posible que necesite aceptar el certificado del servidor.
        </div>
      )}
      
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/mesa-selection" element={<MesaSelection />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route 
          path="/client/:mesaId?" 
          element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <ClienteDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/staff/*" 
          element={
            <ProtectedRoute allowedRoles={['staff']}>
              <StaffDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={clearToast} 
      />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;