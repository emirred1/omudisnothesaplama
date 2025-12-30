'use client';

import { useState } from 'react';

export default function Home() {
  const [scores, setScores] = useState({
    k1: '', k2: '', k2_pdo: '', k3: '', k3_pdo: '', k4: '', k4_pdo: '',
    dsbb: '', tdp: '', final: ''
  });

  const handleInputChange = (id: string, value: string) => {
    let num = Number(value);
    if (num > 100) num = 100;
    if (num < 0) num = 0;
    
    setScores({ ...scores, [id]: value === '' ? '' : num.toString() });
  };

  const calculateResults = () => {
    const { k1, k2, k2_pdo, k3, k3_pdo, k4, k4_pdo, dsbb, tdp, final } = scores;
    
    const realK2 = (Number(k2) * 0.85) + (Number(k2_pdo) * 0.15);
    const realK3 = (Number(k3) * 0.85) + (Number(k3_pdo) * 0.15);
    const realK4 = (Number(k4) * 0.85) + (Number(k4_pdo) * 0.15);

    const yilIciAğırlıklı = 
      (Number(k1) * 0.22) + 
      (realK2 * 0.18) + 
      (realK3 * 0.30) + 
      (realK4 * 0.16) + 
      (Number(dsbb) * 0.10) + 
      (Number(tdp) * 0.04);
    
    const genelNot = (yilIciAğırlıklı * 0.6) + (Number(final) * 0.4);
    const gerekenFinal = (59.5 - (yilIciAğırlıklı * 0.6)) / 0.4;

    return {
      genelNot: genelNot.toFixed(2),
      gerekenFinal: gerekenFinal > 0 ? gerekenFinal.toFixed(1) : "0"
    };
  };

  const results = calculateResults();

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans antialiased flex flex-col items-center justify-center p-6 text-[13px]">
      <div className="w-full max-w-md flex-grow flex flex-col justify-center py-10">
        
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-light tracking-tight text-slate-800">
            Akdeniz <span className="font-semibold text-blue-600">Tıp</span>
          </h1>
          <p className="text-slate-400 text-[10px] mt-2 font-medium uppercase tracking-[0.3em]">Not Hesaplayıcı</p>
        </header>

        <div className="space-y-4">
          {/* K1 */}
          <div className="text-left">
            <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 ml-1 tracking-widest">K1 Sınavı (%22)</label>
            <input type="number" min="0" max="100" placeholder="0" 
              value={scores.k1}
              onChange={(e) => handleInputChange('k1', e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-lg font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300 text-left" />
          </div>

          {/* K2, K3, K4 */}
          {[2, 3, 4].map(num => (
            <div key={num} className="grid grid-cols-2 gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-50 text-left">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">K{num} Sınav</label>
                <input type="number" min="0" max="100" placeholder="0" 
                  value={scores[`k${num}` as keyof typeof scores]}
                  onChange={(e) => handleInputChange(`k${num}`, e.target.value)}
                  className="w-full bg-white border-none rounded-xl p-3 text-base font-semibold focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-left" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-blue-400 uppercase mb-1 ml-1">K{num} PDÖ</label>
                <input type="number" min="0" max="100" placeholder="0" 
                  value={scores[`k${num}_pdo` as keyof typeof scores]}
                  onChange={(e) => handleInputChange(`k${num}_pdo`, e.target.value)}
                  className="w-full bg-blue-50/30 border-none rounded-xl p-3 text-base font-semibold focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-left" />
              </div>
            </div>
          ))}

          {/* DSBB ve TDP */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 ml-1 tracking-widest">DSBB (%10)</label>
              <input type="number" min="0" max="100" placeholder="0" 
                value={scores.dsbb}
                onChange={(e) => handleInputChange('dsbb', e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl p-3 text-base font-medium focus:ring-2 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300 text-left" />
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 ml-1 tracking-widest">TDP (%4)</label>
              <input type="number" min="0" max="100" placeholder="0" 
                value={scores.tdp}
                onChange={(e) => handleInputChange('tdp', e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl p-3 text-base font-medium focus:ring-2 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300 text-left" />
            </div>
          </div>

          {/* Final */}
          <div className="pt-2 text-left">
            <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1 ml-1 tracking-widest">Final Sınavı (%40)</label>
            <input type="number" min="0" max="100" placeholder="0" 
              value={scores.final}
              onChange={(e) => handleInputChange('final', e.target.value)}
              className="w-full bg-blue-50 border-none rounded-3xl p-6 text-2xl font-bold text-blue-700 text-left focus:ring-8 focus:ring-blue-500/10 outline-none transition-all placeholder:text-blue-200"
            />
          </div>

          {/* Sonuç Kartı */}
          <div className={`mt-6 rounded-[32px] p-8 transition-all duration-500 ${Number(results.genelNot) >= 59.5 ? 'bg-emerald-50 text-emerald-900 shadow-lg shadow-emerald-100' : 'bg-slate-900 text-white shadow-2xl shadow-slate-200'}`}>
            <div className="flex justify-between items-end">
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1 text-blue-400">Ortalama</p>
                <p className="text-5xl font-black tracking-tighter">{results.genelNot}</p>
              </div>
              <div className="text-right flex flex-col items-end">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Gereken Final</p>
                <p className="text-2xl font-bold text-blue-400 tracking-tight">{results.gerekenFinal}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full max-w-md mt-10 mb-6 flex items-center justify-center gap-4">
        <div className="h-[1px] flex-grow bg-slate-100"></div>
        <p className="text-[9px] font-medium text-slate-300 uppercase tracking-[0.4em] whitespace-nowrap">
          made by efe with 💖
        </p>
        <div className="h-[1px] flex-grow bg-slate-100"></div>
      </footer>
    </main>
  );
}