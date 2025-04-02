import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

function Navbar() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="flex flex-col md:flex-row justify-between items-center py-6 border-b-4 border-primary mb-8 relative after:content-[''] after:absolute after:h-px after:w-full after:bg-white/10 after:-bottom-[10px] after:left-0">
      <div className="flex w-full md:w-auto justify-between items-center px-4 md:px-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-primary/20"></div>
          <h2 className="text-white text-2xl font-extrabold -tracking-tight uppercase relative before:content-['K'] before:absolute before:text-5xl before:opacity-20 before:-left-4 before:-top-4 before:font-black before:-z-10 before:text-secondary">
            {t('navbar.title')}
          </h2>
        </div>
        
        {/* Botón de menú para móviles */}
        <button 
          className="md:hidden text-white"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Menú para versión desktop y móvil */}
      <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center gap-4 w-full md:w-auto mt-4 md:mt-0`}>
        <LanguageSelector />
        <button className="w-full md:w-auto bg-primary text-white px-6 py-3 text-base font-bold rounded-none shadow-brutal relative overflow-hidden hover:bg-[#ff6a3c] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0_rgba(0,0,0,0.8)] transition-all mt-2 md:mt-0">
          {t('navbar.getStarted')}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
