'use client';

import { useState, useEffect } from 'react';

export default function GamePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenGamePopup');
    if (!hasSeenPopup) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenGamePopup', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
        
        {/* Kapat Butonu */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          aria-label="Kapat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* İçerik */}
        <div className="text-center mt-2">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl shadow-lg flex items-center justify-center rotate-3 hover:rotate-6 transition-transform">
            <span className="text-3xl" role="img" aria-label="gamepad">🎮</span>
          </div>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-2 tracking-tight">
            Yeni Oyunumu Deneyin!
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm leading-relaxed">
            Eğlenceli ve yepyeni oyunumuz &quot;Sıcak Soğuk&quot; yayında. Hemen oynamak için aşağıdaki butona tıklayın!
          </p>
          
          {/* Aksiyon Butonları */}
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button 
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl font-semibold bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 transition-all w-full sm:w-auto order-2 sm:order-1"
            >
              İlgilenmiyorum
            </button>
            <a 
              href="https://sicaksogukoyna.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center gap-2"
            >
              Oyna
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
