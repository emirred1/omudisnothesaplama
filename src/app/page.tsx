'use client';

import { useState, useEffect } from 'react';

// ==========================================
// 1. AYARLAR VE MÜFREDAT
// ==========================================

const UNI_NAME_LINE1 = "Ondokuz Mayıs Üniversitesi"; 
const UNI_NAME_LINE2 = "Diş Hekimliği Fakültesi";
const BASLIK_ALT = "ORTALAMA HESAPLAMA"; 

const GECME_NOTU = 60; 
const FINAL_BARAJI = 50; 

// --- 1. SINIF DERSLERİ ---
const GUZ_DERSLERI_1 = [
  { id: 1, name: 'Anatomi', credit: 2, score: '' },
  { id: 2, name: 'Fizyoloji', credit: 2, score: '' },
  { id: 3, name: 'Histoloji', credit: 2, score: '' },
  { id: 4, name: 'Organik Kimya', credit: 2, score: '' },
  { id: 5, name: 'Diş Anatomisi ve Fizyolojisi I', credit: 1, score: '' },
  { id: 6, name: 'Dental Materyaller I', credit: 1, score: '' },
  { id: 7, name: 'Tıbbi Biyokimya', credit: 2, score: '' },
  { id: 8, name: 'Tıbbi Biyoloji ve Genetik', credit: 2, score: '' },
  { id: 9, name: 'Öğrenci Oryantasyonu ve Diş Hekimliği Tarihi', credit: 1, score: '' },
  { id: 10, name: 'Anatomi Pratik', credit: 1, score: '' },
  { id: 11, name: 'Histoloji Pratik', credit: 0.5, score: '' },
];

const BAHAR_DERSLERI_1 = [
  { id: 101, name: 'Anatomi', credit: 2, score: '' },
  { id: 102, name: 'Fizyoloji', credit: 2, score: '' },
  { id: 103, name: 'Histoloji', credit: 2, score: '' },
  { id: 104, name: 'Biyoistatistik', credit: 1, score: '' },
  { id: 105, name: 'Diş Anatomisi ve Fizyolojisi', credit: 1, score: '' },
  { id: 106, name: 'Dental Materyaller', credit: 1, score: '' },
  { id: 107, name: 'Biyofizik', credit: 2, score: '' },
  { id: 108, name: 'Mikrobiyoloji', credit: 1, score: '' },
  { id: 110, name: 'Anatomi Pratik', credit: 1, score: '' },
  { id: 111, name: 'Histoloji Pratik', credit: 0.5, score: '' },
];

// --- 2. SINIF DERSLERİ ---
const GUZ_DERSLERI_2 = [
  { id: 201, name: 'Protetik Diş Tedavisi', credit: 2, score: '' },
  { id: 202, name: 'Restoratif Diş Tedavisi', credit: 2, score: '' },
  { id: 203, name: 'Endodonti', credit: 2, score: '' },
  { id: 204, name: 'Patoloji', credit: 1, score: '' },
  { id: 205, name: 'Mikrobiyoloji', credit: 1, score: '' },
  { id: 206, name: 'Periodontoloji', credit: 1, score: '' },
  { id: 207, name: 'Pedodonti', credit: 1, score: '' },
  { id: 208, name: 'Farmakoloji', credit: 1, score: '' },
];

const BAHAR_DERSLERI_2 = [
  { id: 301, name: 'Protetik Diş Tedavisi', credit: 2, score: '' },
  { id: 302, name: 'Restoratif Diş Tedavisi', credit: 2, score: '' },
  { id: 303, name: 'Endodonti', credit: 2, score: '' },
  { id: 304, name: 'Ağız Diş ve Çene Radyolojisi', credit: 1, score: '' },
  { id: 305, name: 'Ağız Diş ve Çene Cerrahisi', credit: 2, score: '' },
  { id: 306, name: 'Periodontoloji', credit: 1, score: '' },
  { id: 307, name: 'Kariyer Planlama', credit: 1, score: '' },
];

// ==========================================
// KODUN GERİ KALANI
// ==========================================

export default function Home() {
  const [allCourses, setAllCourses] = useState({
    sinif1: { guz: GUZ_DERSLERI_1, bahar: BAHAR_DERSLERI_1 },
    sinif2: { guz: GUZ_DERSLERI_2, bahar: BAHAR_DERSLERI_2 }
  });
  
  const [activeClass, setActiveClass] = useState('sinif1');
  const [activeTab, setActiveTab] = useState('guz');
  
  const [results, setResults] = useState({
    guzAvg: 0, baharAvg: 0, vizeAvg: 0, neededFinal: 0
  });

  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('uni_theme_v8');
    const savedData = localStorage.getItem('uni_data_v8');
    const savedClass = localStorage.getItem('uni_class_v8');

    if (savedTheme === 'dark') setDarkMode(true);
    if (savedData) setAllCourses(JSON.parse(savedData));
    if (savedClass) setActiveClass(savedClass);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('uni_theme_v8', darkMode ? 'dark' : 'light');
      localStorage.setItem('uni_data_v8', JSON.stringify(allCourses));
      localStorage.setItem('uni_class_v8', activeClass);
    }
    calculateAll();
  }, [allCourses, activeClass, darkMode, isLoaded]);

  // --- HESAPLAMA ---
  const getAverageOfList = (list: any[]) => {
    let totalWeightedScore = 0;
    let totalCredits = 0;
    list.forEach(course => {
      if (course.score !== '' && course.credit) {
        const scoreVal = parseFloat(course.score.toString());
        const creditVal = parseFloat(course.credit.toString());
        totalWeightedScore += scoreVal * creditVal;
        totalCredits += creditVal;
      }
    });
    if (totalCredits === 0) return 0;
    return totalWeightedScore / totalCredits;
  };

  const calculateAll = () => {
    const currentClassData = allCourses[activeClass as 'sinif1' | 'sinif2'];
    let guz = Math.round(getAverageOfList(currentClassData.guz));
    let bahar = Math.round(getAverageOfList(currentClassData.bahar));
    let vize = Math.round((guz + bahar) / 2);

    const currentPoints = vize * 0.5;
    let needed = (GECME_NOTU - currentPoints) / 0.5;

    if (needed < FINAL_BARAJI) needed = FINAL_BARAJI;

    setResults({ guzAvg: guz, baharAvg: bahar, vizeAvg: vize, neededFinal: needed });
  };

  const updateScore = (id: number, value: string) => {
    if (Number(value) > 100) return;
    if (Number(value) < 0) return;

    setAllCourses(prev => ({
      ...prev,
      [activeClass]: {
        ...prev[activeClass as 'sinif1' | 'sinif2'],
        [activeTab]: prev[activeClass as 'sinif1' | 'sinif2'][activeTab as 'guz' | 'bahar'].map(c => c.id === id ? { ...c, score: value } : c)
      }
    }));
  };

  const resetCurrentScores = () => {
    const defaultList = activeClass === 'sinif1' 
      ? (activeTab === 'guz' ? GUZ_DERSLERI_1 : BAHAR_DERSLERI_1)
      : (activeTab === 'guz' ? GUZ_DERSLERI_2 : BAHAR_DERSLERI_2);

    const cleanList = defaultList.map(c => ({...c, score: ''}));
    setAllCourses(prev => ({
      ...prev,
      [activeClass]: {
        ...prev[activeClass as 'sinif1' | 'sinif2'],
        [activeTab]: cleanList
      }
    }));
  };

  if (!isLoaded) return null;

  const displayCourses = allCourses[activeClass as 'sinif1' | 'sinif2'][activeTab as 'guz' | 'bahar'];

  return (
    <main className={`min-h-screen transition-all duration-700 flex flex-col items-center justify-center p-6 text-[13px] ${darkMode ? 'bg-black text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      
      {/* Özel CSS Animasyonu */}
      <style jsx global>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide {
          animation: slideIn 0.4s ease-out forwards;
        }
      `}</style>

      {/* Sağ Üst Kontroller */}
      <div className="fixed top-6 right-6 flex items-center gap-2 z-50">
        <button onClick={resetCurrentScores} title="Temizle" className={`p-3 rounded-full transition-all active:scale-90 ${darkMode ? 'bg-zinc-900 text-zinc-500 border border-zinc-800' : 'bg-white shadow-sm text-zinc-400 border border-zinc-100'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </button>
        <button onClick={() => setDarkMode(!darkMode)} className={`p-3 rounded-full transition-all active:scale-90 ${darkMode ? 'bg-zinc-900 text-zinc-400 border border-zinc-800' : 'bg-white shadow-sm text-zinc-600 border border-zinc-100'}`}>
          {darkMode ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> : 
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          }
        </button>
      </div>

      <div className={`w-full max-w-md flex-grow flex flex-col justify-center py-10`}>
        <header className="mb-8 text-center">
          <h1 className={`text-3xl font-light tracking-tight ${darkMode ? 'text-white' : 'text-zinc-800'}`}>
            {UNI_NAME_LINE1}
            <span className="block mt-1 font-medium">{UNI_NAME_LINE2}</span>
          </h1>
          <p className="text-zinc-500 text-[10px] mt-3 font-medium uppercase tracking-[0.3em]">{BASLIK_ALT}</p>
        
          {/* KAYAN SWITCH KUTUSU */}
          <div className={`mt-8 inline-flex flex-col p-1.5 rounded-[20px] transition-all w-64 ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-zinc-100/80 border border-zinc-200'}`}>
            
            {/* ÜST SATIR SWITCH: DÖNEM 1 / DÖNEM 2 */}
            <div className="relative flex w-full mb-1 bg-transparent h-10 items-center">
              {/* Kayan Arkaplan Pill */}
              <div className={`absolute top-0 bottom-0 w-[50%] rounded-xl shadow-sm transition-all duration-300 ease-out 
                 ${activeClass === 'sinif1' ? 'translate-x-0' : 'translate-x-full'} 
                 ${darkMode ? 'bg-zinc-800' : 'bg-white'}`} 
              />
              
              <button onClick={() => setActiveClass('sinif1')} className={`flex-1 z-10 text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${activeClass === 'sinif1' ? (darkMode ? 'text-white' : 'text-zinc-900') : 'text-zinc-500 hover:text-zinc-400'}`}>
                  DÖNEM 1
              </button>
              <button onClick={() => setActiveClass('sinif2')} className={`flex-1 z-10 text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${activeClass === 'sinif2' ? (darkMode ? 'text-white' : 'text-zinc-900') : 'text-zinc-500 hover:text-zinc-400'}`}>
                  DÖNEM 2
              </button>
            </div>

            {/* ALT SATIR SWITCH: GÜZ / BAHAR */}
            <div className="relative flex w-full bg-transparent h-10 items-center">
               {/* Kayan Arkaplan Pill */}
               <div className={`absolute top-0 bottom-0 w-[50%] rounded-xl shadow-sm transition-all duration-300 ease-out 
                 ${activeTab === 'guz' ? 'translate-x-0' : 'translate-x-full'} 
                 ${darkMode ? 'bg-zinc-800' : 'bg-white'}`} 
               />

              <button onClick={() => setActiveTab('guz')} className={`flex-1 z-10 text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${activeTab === 'guz' ? (darkMode ? 'text-white' : 'text-zinc-900') : 'text-zinc-500 hover:text-zinc-400'}`}>
                GÜZ
              </button>
              <button onClick={() => setActiveTab('bahar')} className={`flex-1 z-10 text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${activeTab === 'bahar' ? (darkMode ? 'text-white' : 'text-zinc-900') : 'text-zinc-500 hover:text-zinc-400'}`}>
                BAHAR
              </button>
            </div>
          </div>
        </header>

        {/* Ders Listesi - Animasyonlu */}
        {/* KEY prop'u değişince React bu div'i baştan oluşturur ve animasyon çalışır */}
        <div key={`${activeClass}-${activeTab}`} className="space-y-3 mb-6 animate-slide">
          {displayCourses.map((course) => (
            <div key={course.id} className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${darkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-100 shadow-sm'}`}>
              <input type="text" value={course.name} readOnly={true} className={`flex-grow bg-transparent border-none outline-none text-sm font-medium cursor-default ${darkMode ? 'text-zinc-400' : 'text-zinc-700'}`} />
              <div className="flex flex-col items-center w-12">
                <label className="text-[8px] font-bold text-zinc-500 uppercase">KREDİ</label>
                <input type="number" value={course.credit} readOnly={true} className={`w-full text-center bg-transparent border-none outline-none font-bold cursor-default ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
              </div>
              <div className="flex flex-col items-center w-16">
                 <label className="text-[8px] font-bold text-zinc-500 uppercase">PUAN</label>
                 <input type="number" value={course.score} placeholder="-" min="0" max="100" onChange={(e) => updateScore(course.id, e.target.value)} className={`w-full bg-transparent text-center font-bold outline-none text-lg ${darkMode ? 'text-emerald-400 placeholder:text-zinc-800' : 'text-emerald-600 placeholder:text-zinc-200'}`} />
              </div>
            </div>
          ))}
        </div>

        {/* --- SONUÇ ALANI --- */}
        <div className={`mt-2 rounded-[32px] p-6 transition-all duration-500 flex flex-col gap-6 ${darkMode ? 'bg-zinc-900/80 text-white border border-zinc-700 shadow-2xl' : 'bg-white text-zinc-900 shadow-xl border border-zinc-50'}`}>
          
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl text-center ${darkMode ? 'bg-zinc-800/50' : 'bg-zinc-50'}`}>
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Güz Ort.</p>
              <p className="text-2xl font-bold">{results.guzAvg.toFixed(0)}</p>
            </div>
            <div className={`p-4 rounded-2xl text-center ${darkMode ? 'bg-zinc-800/50' : 'bg-zinc-50'}`}>
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Bahar Ort.</p>
              <p className="text-2xl font-bold">{results.baharAvg.toFixed(0)}</p>
            </div>
          </div>

          <div className="text-center">
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-1">GENEL VİZE ORTALAMASI</p>
             <p className={`text-5xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-zinc-800'}`}>
               {results.vizeAvg.toFixed(0)}
             </p>
             <p className="text-[9px] text-zinc-400 mt-1">(%50 Etkili)</p>
          </div>

          <div className={`p-6 rounded-2xl text-center border-2 border-dashed transition-all ${
             results.neededFinal > 100 
               ? (darkMode ? 'border-red-900/50 bg-red-900/10' : 'border-red-200 bg-red-50') 
               : (results.neededFinal <= 0 ? (darkMode ? 'border-emerald-900/50 bg-emerald-900/10' : 'border-emerald-200 bg-emerald-50') : (darkMode ? 'border-zinc-700 bg-zinc-800/50' : 'border-zinc-200 bg-zinc-50'))
          }`}>
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">FİNALDEN ALMAN GEREKEN</p>
             
             {results.neededFinal > 100 ? (
               <div>
                 <p className="text-3xl font-black text-red-500">GEÇMİŞ OLSUN</p>
                 <p className="text-[10px] text-red-400 mt-1">({results.neededFinal.toFixed(0)} gerekiyor)</p>
               </div>
             ) : results.neededFinal <= 0 ? (
               <div>
                 <p className="text-3xl font-black text-emerald-500">GEÇTİNİZ! 🎉</p>
               </div>
             ) : (
               <p className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                 {results.neededFinal.toFixed(0)}
               </p>
             )}
          </div>
        </div>
      </div>
      
      <footer className="w-full max-w-md mt-10 mb-6 flex items-center justify-center gap-4">
        <div className={`h-[1px] flex-grow ${darkMode ? 'bg-zinc-900' : 'bg-zinc-200'}`}></div>
        <p className={`text-[9px] font-bold uppercase tracking-[0.2em] ${darkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Made by Emir with AI
        </p>
        <div className={`h-[1px] flex-grow ${darkMode ? 'bg-zinc-900' : 'bg-zinc-200'}`}></div>
      </footer>
    </main>
  );
}