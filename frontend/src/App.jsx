import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import OptionsGrid from './components/OptionsGrid';

function App() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto p-6 overflow-hidden">
      <Navbar />
      <main className="text-center py-16 px-0 relative">
        <div className="before:content-['KARIBU'] before:text-[20vw] before:absolute before:opacity-[0.03] before:top-0 before:left-1/2 before:-translate-x-1/2 before:font-extrabold before:-z-10 before:whitespace-nowrap">
          <h1 className="text-5xl font-extrabold mb-4 uppercase leading-none tracking-tight relative inline-block after:content-[''] after:absolute after:h-3 after:w-[70%] after:bg-primary after:bottom-[-5px] after:left-[15%] after:-z-10">
            {t('main.welcome')}
          </h1>
          <p className="text-xl mb-12 text-white/70 max-w-2xl mx-auto">
            {t('main.choosePortal')}
          </p>
          <OptionsGrid />
        </div>
      </main>
    </div>
  );
}

export default App;