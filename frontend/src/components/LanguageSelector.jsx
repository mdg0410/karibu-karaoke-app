import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSelector() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={() => changeLanguage('en')} 
        className={`px-2 py-1 text-xs ${i18n.language === 'en' ? 'bg-white text-dark font-bold' : 'bg-transparent text-white/70 hover:text-white'}`}
      >
        EN
      </button>
      <span className="text-white/30">|</span>
      <button 
        onClick={() => changeLanguage('es')} 
        className={`px-2 py-1 text-xs ${i18n.language === 'es' ? 'bg-white text-dark font-bold' : 'bg-transparent text-white/70 hover:text-white'}`}
      >
        ES
      </button>
    </div>
  );
}

export default LanguageSelector;
