'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const initialScores = {
    k1: '', k2: '', k2_pdo: '', k3: '', k3_pdo: '', k4: '', k4_pdo: '',
    dsbb: '', tdp: '', final: ''
  };

  const [scoresD1, setScoresD1] = useState(initialScores);
  const [scoresD2, setScoresD2] = useState(initialScores);
  const [activeTab, setActiveTab] = useState('d1'); 
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [shareMode, setShareMode] = useState(false);

  useEffect(() => {
    const savedScoresD1 = localStorage.getItem('akdeniz_tip_scores_d1');
    const savedScoresD2 = localStorage.getItem('akdeniz_tip_scores_d2');
    const savedTab = localStorage.getItem('akdeniz_tip_active_tab');
    const savedTheme = localStorage.getItem('akdeniz_tip_theme');

    if (savedScoresD1) setScoresD1(JSON.parse(savedScoresD1));
    if (savedScoresD2) setScoresD2(JSON.parse(savedScoresD2));
    if (savedTab) setActiveTab(savedTab);
    if (savedTheme === 'dark') setDarkMode(true);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('akdeniz_tip_scores_d1', JSON.stringify(scoresD1));
      localStorage.setItem('akdeniz_tip_scores_d2', JSON.stringify(scoresD2));
      localStorage.setItem('akdeniz_tip_active_tab', activeTab);
      localStorage.setItem('akdeniz_tip_theme', darkMode ? 'dark' : 'light');
    }
  }, [scoresD1, scoresD2, activeTab, darkMode, isLoaded]);

  const handleReset = () => {
    if (activeTab === 'd1') setScoresD1(initialScores);
    else setScoresD2(initialScores);
    setIsCalculating(true);
    setTimeout(() => setIsCalculating(false), 400);
  };

  const handleInputChange = (id: string, value: string) => {
    let num = Number(value);
    if (num > 100) num = 100;
    if (num < 0) num = 0;
    
    const valStr = value === '' ? '' : num.toString();
    if (activeTab === 'd1') setScoresD1(prev => ({ ...prev, [id]: valStr }));
    else setScoresD2(prev => ({ ...prev, [id]: valStr }));
    
    setIsCalculating(true);
    setTimeout(() => setIsCalculating(false), 400);
  };

  const calculateResults = (currentScores: typeof initialScores, tab: string) => {
    const { k1, k2, k2_pdo, k3, k3_pdo, k4, k4_pdo, dsbb, tdp, final } = currentScores;
    const allExamsEntered = [k1, k2, k2_pdo, k3, k3_pdo, k4, k4_pdo, dsbb, tdp].every(val => val !== '');
    if (!allExamsEntered) return { ready: false };

    const n = (val: string) => Number(val);
    const realK2 = (n(k2) * 0.85) + (n(k2_pdo) * 0.15);
    const realK3 = (n(k3) * 0.85) + (n(k3_pdo) * 0.15);
    const realK4 = (n(k4) * 0.85) + (n(k4_pdo) * 0.15);

    let yilIciAğırlıklı = 0;
    if (tab === 'd1') {
      yilIciAğırlıklı = (n(k1) * 0.22) + (realK2 * 0.18) + (realK3 * 0.30) + (realK4 * 0.16) + (n(dsbb) * 0.10) + (n(tdp) * 0.04);
    } else {
      yilIciAğırlıklı = (n(k1) * 0.14) + (realK2 * 0.22) + (realK3 * 0.32) + (realK4 * 0.18) + (n(dsbb) * 0.10) + (n(tdp) * 0.04);
    }

    const genelNot = (yilIciAğırlıklı * 0.6) + (n(final) * 0.4);
    let gerekenFinal = (59.5 - (yilIciAğırlıklı * 0.6)) / 0.4;
    const isImpossible = gerekenFinal > 100;
    if (gerekenFinal < 50) gerekenFinal = 50; 

    return { ready: true, genelNot: genelNot.toFixed(2), gerekenFinal: gerekenFinal.toFixed(1), isImpossible };
  };

  const activeScores = activeTab === 'd1' ? scoresD1 : scoresD2;
  const results = calculateResults(activeScores, activeTab);
  
  const currentWeights = activeTab === 'd1' 
    ? { k1: '%22', k2: '%18', k3: '%30', k4: '%16' }
    : { k1: '%14', k2: '%22', k3: '%32', k4: '%18' };

  if (!isLoaded) return null;

  const renderInputPanel = (s: typeof initialScores, isForD2: boolean) => {
    const panelWeights = !isForD2 
      ? { k1: '%22', k2: '%18', k3: '%30', k4: '%16' }
      : { k1: '%14', k2: '%22', k3: '%32', k4: '%18' };

    return (
      <div className="w-full flex-shrink-0 px-1 space-y-4 text-left">
        <div>
          <label className="block text-[9px] font-black text-zinc-500 uppercase mb-1 ml-1 tracking-widest">K1 Sınavı ({panelWeights.k1})</label>
          <input type="number" placeholder="0" value={s.k1} onChange={(e) => handleInputChange('k1', e.target.value)} className={`w-full border-none rounded-2xl p-4 text-lg font-medium outline-none transition-all placeholder:text-zinc-600 ${darkMode ? 'bg-zinc-900 text-white focus:ring-2 focus:ring-zinc-700' : 'bg-white shadow-sm focus:ring-2 focus:ring-zinc-200'}`} />
        </div>

        {[2, 3, 4].map(num => (
          <div key={num} className={`grid grid-cols-2 gap-3 p-3 rounded-2xl border transition-colors ${darkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-100 shadow-sm'}`}>
            <div>
              <label className="block text-[9px] font-black text-zinc-500 uppercase mb-1 ml-1">K{num} Sınav ({(panelWeights as any)[`k${num}`]})</label>
              <input type="number" placeholder="0" value={(s as any)[`k${num}`]} onChange={(e) => handleInputChange(`k${num}`, e.target.value)} className={`w-full border-none rounded-xl p-3 text-base font-semibold outline-none transition-all ${darkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-50'}`} />
            </div>
            <div>
              <label className="block text-[9px] font-black text-zinc-400 uppercase mb-1 ml-1 tracking-tighter">K{num} PDÖ</label>
              <input type="number" placeholder="0" value={(s as any)[`k${num}_pdo`]} onChange={(e) => handleInputChange(`k${num}_pdo`, e.target.value)} className={`w-full border-none rounded-xl p-3 text-base font-semibold outline-none transition-all ${darkMode ? 'bg-zinc-800/40 text-zinc-500' : 'bg-zinc-100/50 text-zinc-400'}`} />
            </div>
          </div>
        ))}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] font-black text-zinc-500 uppercase mb-1 ml-1 tracking-widest">DSBB (%10)</label>
            <input type="number" placeholder="0" value={s.dsbb} onChange={(e) => handleInputChange('dsbb', e.target.value)} className={`w-full border-none rounded-xl p-3 text-base font-medium outline-none transition-all ${darkMode ? 'bg-zinc-900 text-white' : 'bg-white shadow-sm'}`} />
          </div>
          <div>
            <label className="block text-[9px] font-black text-zinc-500 uppercase mb-1 ml-1 tracking-widest">TDP (%4)</label>
            <input type="number" placeholder="0" value={s.tdp} onChange={(e) => handleInputChange('tdp', e.target.value)} className={`w-full border-none rounded-xl p-3 text-base font-medium outline-none transition-all ${darkMode ? 'bg-zinc-900 text-white' : 'bg-white shadow-sm'}`} />
          </div>
        </div>

        <div className="pt-2">
          <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 ml-1 tracking-widest">Final Sınavı (%40)</label>
          <input type="number" placeholder="0" value={s.final} onChange={(e) => handleInputChange('final', e.target.value)} className={`w-full border-none rounded-3xl p-6 text-2xl font-bold outline-none transition-all ${darkMode ? 'bg-zinc-200 text-black focus:ring-8 focus:ring-zinc-200/20' : 'bg-zinc-700 text-white focus:ring-8 focus:ring-zinc-800/10'}`} />
        </div>
      </div>
    );
  };

  return (
    <main className={`min-h-screen transition-all duration-700 flex flex-col items-center justify-center p-6 text-[13px] ${darkMode ? 'bg-black text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      {!shareMode && (
        <div className="fixed top-6 right-6 flex items-center gap-2 z-50">
          <button onClick={handleReset} className={`p-3 rounded-full transition-all active:scale-90 ${darkMode ? 'bg-zinc-900 text-zinc-500 border border-zinc-800' : 'bg-white shadow-sm text-zinc-400 border border-zinc-100'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className={`p-3 rounded-full transition-all active:scale-90 ${darkMode ? 'bg-zinc-900 text-zinc-400 border border-zinc-800' : 'bg-white shadow-sm text-zinc-600 border border-zinc-100'}`}>
            {darkMode ? <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>}
          </button>
        </div>
      )}

      <div className={`w-full max-w-md flex-grow flex flex-col justify-center py-10 transition-all duration-500 ${shareMode ? 'scale-110' : 'scale-100'}`}>
        <header className="mb-10 text-center">
          <h1 className={`text-3xl font-light tracking-tight ${darkMode ? 'text-white' : 'text-zinc-800'}`}>
            Akdeniz <span className={`font-semibold ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Tıp D'1</span>
          </h1>
          <p className="text-zinc-500 text-[10px] mt-2 font-medium uppercase tracking-[0.3em]">Not Hesaplayıcı</p>

          {!shareMode && (
            <div className={`mt-8 inline-flex p-1 rounded-xl transition-all ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-zinc-200/50'}`}>
              <button onClick={() => setActiveTab('d1')} className={`px-6 py-2 rounded-lg text-[11px] font-bold transition-all duration-300 ${activeTab === 'd1' ? (darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-900 shadow-sm') : 'text-zinc-500'}`}>DÖNEM 1</button>
              <button onClick={() => setActiveTab('d2')} className={`px-6 py-2 rounded-lg text-[11px] font-bold transition-all duration-300 ${activeTab === 'd2' ? (darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-900 shadow-sm') : 'text-zinc-500'}`}>DÖNEM 1 TEKRARI</button>
            </div>
          )}
        </header>

        {!shareMode && (
          <div className="relative overflow-hidden w-full">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: activeTab === 'd1' ? 'translateX(0%)' : 'translateX(-100%)' }}>
              {renderInputPanel(scoresD1, false)}
              {renderInputPanel(scoresD2, true)}
            </div>
          </div>
        )}

        <div className={`mt-6 rounded-[32px] p-8 transition-all duration-500 min-h-[140px] flex flex-col items-center justify-center ${
          !results.ready ? (darkMode ? 'bg-zinc-900/30 border-2 border-dashed border-zinc-800' : 'bg-white border-2 border-dashed border-zinc-100 shadow-sm') :
          darkMode ? 'bg-zinc-900/80 text-white border border-zinc-700 shadow-2xl' : 'bg-white text-zinc-900 shadow-xl border border-zinc-50'
        }`}>
          {isCalculating ? (
            <div className="w-6 h-6 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></div>
          ) : !results.ready ? (
            <p className="text-zinc-500 font-medium text-center italic">Notlarınızın girilmesi gerekiyor...</p>
          ) : (
            <div className="flex justify-between items-end w-full">
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-zinc-500">Ortalama</p>
                <p className={`text-5xl font-black tracking-tighter transition-all duration-300 ${Number(results.genelNot) >= 59.5 ? 'text-emerald-500' : ''}`}>{results.genelNot}</p>
              </div>
              <div className="text-right flex flex-col items-end">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Gereken Final</p>
                <p className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${results.isImpossible ? 'text-red-500' : 'text-zinc-400'}`}>{results.gerekenFinal}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="w-full max-w-md mt-10 mb-6 flex items-center justify-center gap-4">
        <div className={`h-[1px] flex-grow ${darkMode ? 'bg-zinc-900' : 'bg-zinc-200'}`}></div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] opacity-50">🖤</span>
          <a href="https://www.instagram.com/efe.jsx" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 group">
            <p className={`text-[9px] font-medium uppercase tracking-[0.4em] whitespace-nowrap ${darkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>made by</p>
            <svg className={`${darkMode ? 'text-zinc-600' : 'text-zinc-400'} group-hover:text-zinc-100 transition-colors`} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            <p className={`text-[9px] font-bold ${darkMode ? 'text-zinc-500' : 'text-zinc-900'} group-hover:text-zinc-100 transition-colors uppercase tracking-[0.4em]`}>efe</p>
          </a>
        </div>
        <div className={`h-[1px] flex-grow ${darkMode ? 'bg-zinc-900' : 'bg-zinc-200'}`}></div>
      </footer>
    </main>
  );
}
