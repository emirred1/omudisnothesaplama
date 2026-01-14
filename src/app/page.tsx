'use client';

import { useState, useEffect } from 'react';

// ==========================================
// 1. AYARLAR VE MÜFREDAT
// ==========================================

const UNI_NAME_LINE1 = "Ondokuz Mayıs Üniversitesi"; 
const UNI_NAME_LINE2 = "Diş Hekimliği Fakültesi";
const BASLIK_ALT = "ORTALAMA HESAPLAMA"; 

const GECME_NOTU = 59.5;

// --- GÜZ DÖNEMİ DERSLERİ ---
const GUZ_DERSLERI = [
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

// --- BAHAR DÖNEMİ DERSLERİ ---
const BAHAR_DERSLERI = [
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

// ==========================================
// KODUN GERİ KALANI
// ==========================================

export default function Home() {
  const [allCourses, setAllCourses] = useState({
    guz: GUZ_DERSLERI,
    bahar: BAHAR_DERSLERI
  });
  
  const [activeTab, setActiveTab] = useState('guz');
  const [results, setResults] = useState({
    guzAvg: 0,
    baharAvg: 0,
    vizeAvg: 0,
    neededFinal: 0
  });

  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Kayıtlı verileri yükle
  useEffect(() => {
    const savedTheme = localStorage.getItem('uni_theme_v5');
    const savedData = localStorage.getItem('uni_data_v5');

    if (savedTheme === 'dark') setDarkMode(true);
    if (savedData) setAllCourses(JSON.parse(savedData));
    setIsLoaded(true);
  }, []);

  // Değişiklikleri kaydet ve hesapla
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('uni_theme_v5', darkMode ? 'dark' : 'light');
      localStorage.setItem('uni_data_v5', JSON.stringify(allCourses));
    }
    calculateAll();
  }, [allCourses, darkMode, isLoaded]);

  // --- HESAPLAMA FONKSİYONLARI ---
  
  const getAverageOfList = (list: typeof GUZ_DERSLERI) => {
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
    const guz = getAverageOfList(allCourses.guz);
    const bahar = getAverageOfList(allCourses.bahar);
    
    // Güz (%25) + Bahar (%25) = Vize Ortalaması (Yıl içinin %50'si)
    // Aslında matematiksel olarak (Güz + Bahar) / 2 bize 100 üzerinden vize ortalamasını verir.
    const vize = (guz + bahar) / 2;

    // Hedef: (Güz * 0.25) + (Bahar * 0.25) + (Final * 0.50) >= 59.5
    // Yani: (Vize * 0.50) + (Final * 0.50) >= 59.5
    // Final * 0.50 >= 59.5 - (Vize * 0.50)
    // Final >= (59.5 - (Vize * 0.50)) / 0.50
    
    const currentPoints = vize * 0.5;
    let needed = (GECME_NOTU - currentPoints) / 0.5;

    // Eğer zaten geçtiyse (needed negatif çıkarsa) 0 gösterelim
    if (needed < 0) needed = 0;

    setResults({
      guzAvg: guz,
      baharAvg: bahar,
      vizeAvg: vize,
      neededFinal: needed
    });
  };

  const updateScore = (id: number, value: string) => {
    if (Number(value) > 100) return;
    if (Number(value) < 0) return;

    setAllCourses(prev => ({
      ...prev,
      [activeTab]: prev[activeTab as 'guz' | 'bahar'].map(c => c.id === id ? { ...c, score: value } : c)
    }));
  };

  const resetCurrentScores = () => {
    const cleanList = (activeTab === 'guz' ? GUZ_DERSLERI : BAHAR_DERSLERI).map(c => ({...c, score: ''}));
    setAllCourses(prev => ({
      ...prev,
      [activeTab]: cleanList
    }));
  };

  if (!isLoaded) return null;

  const displayCourses = activeTab === 'guz' ? allCourses.guz : allCourses.bahar;

  return (
    <main className={`min-h-screen transition-all duration-700 flex flex-col items-center justify-center p-6 text-[13px] ${darkMode ? 'bg-black text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      
      {/* Sağ Üst Kontroller */}
      <div className="fixed top-6 right-6 flex items-center gap-2 z-50">
        <button onClick={resetCurrentScores} title="Bu Dönemi Temizle" className={`p-3 rounded-full transition-all active:scale-90 ${darkMode ? 'bg-zinc-900 text-zinc-500 border border-zinc-800' : 'bg-white shadow-sm text-zinc-400 border border-zinc-100'}`}>
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
        {/* Başlık Alanı */}
        <header className="mb-8 text-center">
          <h1 className={`text-3xl font-light tracking-tight ${darkMode ? 'text-white' : 'text-zinc-800'}`}>
            {UNI_NAME_LINE1}
            <span className="block mt-1 font-medium">{UNI_NAME_LINE2}</span>
          </h1>
          <p className="text-zinc-500 text-[10px] mt-3 font-medium uppercase tracking-[0.3em]">{BASLIK_ALT}</p>
        
          {/* SEKME (TAB) */}
          <div className={`mt-8 inline-flex p-1 rounded-2xl transition-all ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-zinc-200/50'}`}>
             <button onClick={() => setActiveTab('guz')} className={`px-8 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'guz' ? (darkMode ? 'bg-zinc-800 text-white shadow-lg' : 'bg-white text-zinc-900 shadow-md') : 'text-zinc-500 hover:text-zinc-400'}`}>Güz</button>
             <button onClick={() => setActiveTab('bahar')} className={`px-8 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'bahar' ? (darkMode ? 'bg-zinc-800 text-white shadow-lg' : 'bg-white text-zinc-900 shadow-md') : 'text-zinc-500 hover:text-zinc-400'}`}>Bahar</button>
          </div>
        </header>

        {/* Ders Listesi */}
        <div className="space-y-3 mb-6">
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

        {/* --- YENİ SONUÇ ALANI (ÖZET TABLOSU) --- */}
        <div className={`mt-2 rounded-[32px] p-6 transition-all duration-500 flex flex-col gap-6 ${darkMode ? 'bg-zinc-900/80 text-white border border-zinc-700 shadow-2xl' : 'bg-white text-zinc-900 shadow-xl border border-zinc-50'}`}>
          
          {/* Üst Satır: Güz ve Bahar Ortalamaları */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl text-center ${darkMode ? 'bg-zinc-800/50' : 'bg-zinc-50'}`}>
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Güz Ort.</p>
              <p className="text-2xl font-bold">{results.guzAvg.toFixed(2)}</p>
            </div>
            <div className={`p-4 rounded-2xl text-center ${darkMode ? 'bg-zinc-800/50' : 'bg-zinc-50'}`}>
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Bahar Ort.</p>
              <p className="text-2xl font-bold">{results.baharAvg.toFixed(2)}</p>
            </div>
          </div>

          {/* Orta Satır: Genel Vize Ortalaması */}
          <div className="text-center">
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-1">GENEL VİZE ORTALAMASI</p>
             <p className={`text-5xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-zinc-800'}`}>
               {results.vizeAvg.toFixed(2)}
             </p>
             <p className="text-[9px] text-zinc-400 mt-1">(%50 Etkili)</p>
          </div>

          {/* Alt Satır: GEREKEN FİNAL NOTU */}
          <div className={`p-6 rounded-2xl text-center border-2 border-dashed transition-all ${
             results.neededFinal > 100 
               ? (darkMode ? 'border-red-900/50 bg-red-900/10' : 'border-red-200 bg-red-50') 
               : (results.neededFinal === 0 ? (darkMode ? 'border-emerald-900/50 bg-emerald-900/10' : 'border-emerald-200 bg-emerald-50') : (darkMode ? 'border-zinc-700 bg-zinc-800/50' : 'border-zinc-200 bg-zinc-50'))
          }`}>
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">FİNALDEN ALMAN GEREKEN</p>
             
             {results.neededFinal > 100 ? (
               <div>
                 <p className="text-3xl font-black text-red-500">İMKANSIZ</p>
                 <p className="text-[10px] text-red-400 mt-1">({results.neededFinal.toFixed(1)} gerekiyor)</p>
               </div>
             ) : results.neededFinal === 0 ? (
               <div>
                 <p className="text-3xl font-black text-emerald-500">GEÇTİNİZ! 🎉</p>
                 <p className="text-[10px] text-emerald-600 mt-1">Vize ortalamanız {GECME_NOTU}'i geçti.</p>
               </div>
             ) : (
               <p className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                 {results.neededFinal.toFixed(1)}
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