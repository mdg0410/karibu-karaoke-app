import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Componentes
import Navbar from './components/Navbar';
import OptionsGrid from './components/OptionsGrid';
import Toast from './components/Toast';
import ClienteDashboard from './pages/Cliente/ClienteDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import StaffDashboard from './pages/Staff/StaffDashboard';

// Contexto de autenticación
import { AuthProvider } from './context/AuthContext';

function App() {
  const { t } = useTranslation();
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleApiResponse = ({ message, type }) => {
    setToast({ message, type });
  };

  const clearToast = () => {
    setToast({ message: '', type: 'success' });
  };

  return (
    <AuthProvider>
      <Router>
        <div className="max-w-7xl mx-auto p-4 sm:p-6 overflow-hidden">
          <Routes>
            <Route 
              path="/" 
              element={
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
                      <OptionsGrid onApiResponse={handleApiResponse} />
                    </div>
                  </main>
                </>
              } 
            />
            <Route path="/client/*" element={<ClienteDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/staff/*" element={<StaffDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={clearToast} 
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;