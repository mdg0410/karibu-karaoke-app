import React from 'react';

const HomeLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-karaoke-black text-white p-4 md:p-6 lg:p-8">
      <header className="py-4 md:py-6 px-4 md:px-8 flex justify-center items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-primary bg-karaoke-darkgray px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-neumorph-gold transition-all duration-300 hover:shadow-neumorph-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-opacity-50 focus-visible:ring-2">
          Karibu Karaoke
        </h1>
      </header>
      <main className="container mx-auto px-2 md:px-4 py-4 md:py-8 animate-fade-in">
        <div className="bg-karaoke-darkgray p-4 md:p-6 rounded-2xl shadow-neumorph transition-all duration-300 focus-within:shadow-neumorph-lg">
          {children}
        </div>
      </main>
      <footer className="py-4 px-4 md:px-6 text-center mt-4 md:mt-8">
        <p className="inline-block bg-karaoke-darkgray px-3 md:px-4 py-2 rounded-lg text-primary-light shadow-neumorph text-sm md:text-base">
          © 2025 Karibu Karaoke - Todos los derechos reservados
        </p>
      </footer>
    </div>
  );
};

export default HomeLayout;