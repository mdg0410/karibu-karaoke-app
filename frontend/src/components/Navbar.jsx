import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="flex justify-between items-center py-6 border-b-4 border-primary mb-8 relative after:content-[''] after:absolute after:h-px after:w-full after:bg-white/10 after:-bottom-[10px] after:left-0">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 bg-primary/20"></div>
        <h2 className="text-white text-2xl font-extrabold -tracking-tight uppercase relative before:content-['K'] before:absolute before:text-5xl before:opacity-20 before:-left-4 before:-top-4 before:font-black before:-z-10 before:text-secondary">
          {t('navbar.title')}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSelector />
        <button className="bg-primary text-white px-6 py-3 text-base font-bold rounded-none shadow-brutal relative overflow-hidden hover:bg-[#ff6a3c] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0_rgba(0,0,0,0.8)] transition-all">
          {t('navbar.getStarted')}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
