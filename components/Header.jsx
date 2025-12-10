import React from 'react';
import { Link, useLocation } from 'react-router';

function Header() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="glass-morphism sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="./assets/logo.webp" 
              alt="LuminarK Holdings" 
              className="w-12 h-12 rounded-full animate-pulse-glow"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#bb00ff] to-[#90b5ff] bg-clip-text text-transparent">
                LuminarK Holdings
              </h1>
              <p className="text-xs text-gray-400">Portfolio Manager</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-[#bb00ff] to-[#90b5ff] text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Beranda
            </Link>
            <Link 
              to="/portfolio" 
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/portfolio') 
                  ? 'bg-gradient-to-r from-[#bb00ff] to-[#90b5ff] text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Portofolio
            </Link>
            <Link 
              to="/statistics" 
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/statistics') 
                  ? 'bg-gradient-to-r from-[#bb00ff] to-[#90b5ff] text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Statistik
            </Link>
            <Link 
              to="/reports" 
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/reports') 
                  ? 'bg-gradient-to-r from-[#bb00ff] to-[#90b5ff] text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Laporan
            </Link>
          </nav>

          <button className="md:hidden p-2 rounded-lg hover:bg-white/10">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

window.Header = Header;