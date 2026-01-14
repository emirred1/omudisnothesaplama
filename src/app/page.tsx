'use client';

import { useState, useEffect } from 'react';

// ==========================================
// 1. AYARLAR - OKUL ADINI BURADAN DEĞİŞTİR
// ==========================================

const UNI_NAME = "Ondokuz Mayıs Üniversitesi"; 
const BASLIK_ALT = "ORTALAMA HESAPLA"; 

// Başlangıçta ekranda görünecek örnek dersler
const INITIAL_COURSES = [
  { id: 1, name: 'Anatomi', credit: 2, score: '' },
  { id: 2, name: 'Fizyoloji', credit: 2, score: '' },
  { id: 3, name: 'Histoloji', credit: 2, score: '' },
  { id: 4, name: 'Organik Kimya', credit: 2, score: '' },
  { id: 5, name: 'Diş Anatomisi ve Fizyolojisi', credit: 1, score: '' },
  { id: 6, name: 'Dental Materyaller', credit: 1, score: '' },
  { id: 7, name: 'Tıbbi Biyokimya', credit: 1, score: '' },
  { id: 8, name: 'Tıbbi Biyoloji ve Genetik', credit: 1, score: '' },
  { id: 9, name: 'Öğrenci Oryantasyonu ve Diş Hekimliği Tarihi', credit: 1, score: '' },
  { id: 10, name: 'Anatomi Pratik', credit: 1, score: '' },
  { id: 11, name: 'Histoloji Pratik', credit: 0.5, score: '' },
];

// ==========================================
// KODUN GERİ KALANI
// ==========================================

export default function Home() {
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [average, setAverage] = useState('0.00');
  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Kayıtlı verileri yükle
  useEffect(() => {
    const savedTheme = localStorage.getItem('uni_theme_100');
    const savedCourses = localStorage.getItem('uni_courses_100');

    if (savedTheme === 'dark') setDarkMode(true);
    if (savedCourses) setCourses(JSON.parse(savedCourses));
    setIsLoaded(true);
  }, []);

  // Değişiklikleri kaydet ve hesapla
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('uni_theme_100', darkMode ? 'dark' : 'light');
      localStorage.setItem('uni_courses_100', JSON.stringify(courses));
      calculateAverage();
    }
  }, [courses, darkMode, isLoaded]);

  const calculateAverage = () => {
    let totalWeightedScore = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      // Eğer not girilmemişse hesaplamaya katma
      if (course.score !== '' && course.credit) {
        const scoreVal = parseFloat(course.score.toString());
        const creditVal = parseFloat(course.credit.toString());
        
        totalWeightedScore += scoreVal * creditVal;
        totalCredits += creditVal;
      }
    });

    if (totalCredits === 0) setAverage('0.00');
    else setAverage((totalWeightedScore / totalCredits).toFixed(2));
  };

  const updateCourse = (id: number, field: string, value: string | number) => {
    // 100'den büyük sayı girilmesini engelle
    if (field === 'score' && Number(value) > 100) return;
    
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addCourse = () => {
    const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    setCourses([...courses, { id: newId, name: 'Yeni Ders', credit: 2, score: '' }]);
  };

  const removeCourse = (id: number) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const resetAll = () => {
    setCourses(INITIAL_COURSES);
  };

  if (!isLoaded) return null;

  return (
    <main className={`min-h-screen transition-all duration-700 flex flex-col items-center justify-center p-6 text-[13px] ${darkMode ? 'bg-black text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      
      {/* Sağ Üst Kontroller */}
      <div className="fixed top-6 right-6 flex items-center gap-2 z-50">
        <button onClick={resetAll} title="Sıfırla" className={`p-3 rounded-full transition-all active:scale-90 ${darkMode ? 'bg-zinc-900 text-zinc-500 border border-zinc-800' : 'bg-white shadow-sm text-zinc-400 border border-zinc-100'}`}>
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
        {/* Başlık */}
        <header className="mb-10 text-center">
          <h1 className={`text-3xl font-light tracking-tight ${darkMode ? 'text-white' : 'text-zinc-800'}`}>
            {UNI_NAME}
          </h1>
          <p className="text-zinc-500 text-[10px] mt-2 font-medium uppercase tracking-[0.3em]">{BASLIK_ALT}</p>
        </header>

        {/* Ders Listesi */}
        <div className="space-y-3 mb-6">
          {courses.map((course) => (
            <div key={course.id} className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${darkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-100 shadow-sm'}`}>
              
              {/* Ders Adı */}
              <input 
                type="text" 
                value={course.name} 
                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                className={`flex-grow bg-transparent border-none outline-none text-sm font-medium ${darkMode ? 'text-white placeholder:text-zinc-700' : 'text-zinc-800 placeholder:text-zinc-300'}`}
                placeholder="Ders Adı"
              />

              {/* Kredi */}
              <div className="flex flex-col items-center w-12">
                <label className="text-[8px] font-bold text-zinc-500 uppercase">KREDİ</label>
                <input 
                  type="number" 
                  value={course.credit} 
                  onChange={(e) => updateCourse(course.id, 'credit', e.target.value)}
                  className={`w-full text-center bg-transparent border-none outline-none font-bold ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}
                />
              </div>

              {/* Not (100 üzerinden) */}
              <div className="flex flex-col items-center w-16">
                 <label className="text-[8px] font-bold text-zinc-500 uppercase">PUAN</label>
                 <input 
                  type="number" 
                  value={course.score}
                  placeholder="-"
                  min="0"
                  max="100"
                  onChange={(e) => updateCourse(course.id, 'score', e.target.value)}
                  className={`w-full bg-transparent text-center font-bold outline-none text-lg ${darkMode ? 'text-emerald-400 placeholder:text-zinc-800' : 'text-emerald-600 placeholder:text-zinc-200'}`}
                 />
              </div>

              {/* Sil Butonu */}
              <button onClick={() => removeCourse(course.id)} className="text-zinc-500 hover:text-red-500 transition-colors px-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          ))}

          {/* Ders Ekle Butonu */}
          <button onClick={addCourse} className={`w-full py-3 rounded-xl border border-dashed text-xs font-bold uppercase tracking-wider transition-all ${darkMode ? 'border-zinc-800 text-zinc-600 hover:bg-zinc-900 hover:text-zinc-400' : 'border-zinc-200 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600'}`}>
            + Ders Ekle
          </button>
        </div>

        {/* Sonuç Alanı */}
        <div className={`mt-2 rounded-[32px] p-8 transition-all duration-500 flex flex-col items-center justify-center ${
           darkMode ? 'bg-zinc-900/80 text-white border border-zinc-700 shadow-2xl' : 'bg-white text-zinc-900 shadow-xl border border-zinc-50'
        }`}>
          <div className="flex justify-between items-end w-full">
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-zinc-500">Ağırlıklı Ortalama</p>
              <p className={`text-6xl font-black tracking-tighter transition-all duration-300 ${Number(average) >= 50 ? 'text-emerald-500' : 'text-red-500'}`}>
                {average}
              </p>
            </div>
            <div className="text-right flex flex-col items-end">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Toplam Kredi</p>
              <p className="text-2xl font-bold tracking-tight text-zinc-400">
                {courses.reduce((acc, curr) => acc + (curr.score !== '' ? Number(curr.credit) : 0), 0)}
              </p>
            </div>
          </div>
        </div>

      </div>
      
      {/* Footer */}
      <footer className="w-full max-w-md mt-10 mb-6 flex items-center justify-center gap-4">
        <div className={`h-[1px] flex-grow ${darkMode ? 'bg-zinc-900' : 'bg-zinc-200'}`}></div>
        <p className={`text-[9px] font-bold uppercase tracking-[0.2em] ${darkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Modified with AI
        </p>
        <div className={`h-[1px] flex-grow ${darkMode ? 'bg-zinc-900' : 'bg-zinc-200'}`}></div>
      </footer>
    </main>
  );
}