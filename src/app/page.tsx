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

// Histoloji ve Embriyoloji: tek ders (2.5 AKTS), teorik %92 + pratik %8
const HISTOLOGY_THEORY_WEIGHT = 0.92;
const HISTOLOGY_PRACTICAL_WEIGHT = 0.08;
const HISTOLOGY_COMBINED_CREDIT = 2.5;
// Güz: teorik + pratik ayrı girilir (%92 + %8). Bahar: tek birleşik not (2.5 AKTS).
const HISTOLOGY_PAIRS: { theoryId: number; practicalId: number }[] = [
  { theoryId: 3, practicalId: 11 },
];
const HISTOLOGY_PRACTICAL_IDS = new Set(HISTOLOGY_PAIRS.map((p) => p.practicalId));

type Course = {
  id: number;
  name: string;
  credit: number;
  score: string;
  isPracticalPart?: boolean;
};

type SemesterCourses = { guz: Course[]; bahar: Course[] };
type AllCoursesData = { sinif1: SemesterCourses; sinif2: SemesterCourses };

type HistologyGroupItem = { kind: 'group'; theory: Course; practical: Course };
type GuzListItem = Course | HistologyGroupItem;

const buildGuzCourseList = (courses: Course[], groupHistology: boolean): GuzListItem[] => {
  if (!groupHistology) return courses;

  const byId = Object.fromEntries(courses.map((c) => [c.id, c]));
  const items: GuzListItem[] = [];

  for (const course of courses) {
    if (HISTOLOGY_PRACTICAL_IDS.has(course.id)) continue;

    const pair = HISTOLOGY_PAIRS.find((p) => p.theoryId === course.id);
    if (pair && byId[pair.practicalId]) {
      items.push({ kind: 'group', theory: course, practical: byId[pair.practicalId] });
    } else {
      items.push(course);
    }
  }

  return items;
};

const migrateGuzHistologyCourses = (list: Course[]): Course[] =>
  list.map((course) => {
    if (course.id === 3) {
      return {
        ...course,
        name: 'Histoloji ve Embriyoloji',
        credit: HISTOLOGY_COMBINED_CREDIT,
        isPracticalPart: undefined,
      };
    }
    if (course.id === 11) {
      return {
        ...course,
        name: 'Histoloji ve Embriyoloji Pratik',
        credit: 0,
        isPracticalPart: true,
      };
    }
    return course;
  });

const migrateBaharHistologyCourses = (list: Course[]): Course[] => {
  const theory = list.find((c) => c.id === 103);
  const practical = list.find((c) => c.id === 111);

  let mergedScore = theory?.score ?? '';
  if (
    theory &&
    practical &&
    theory.score !== '' &&
    practical.score !== ''
  ) {
    const theoryScore = parseFloat(theory.score.toString());
    const practicalScore = parseFloat(practical.score.toString());
    mergedScore = String(
      theoryScore * HISTOLOGY_THEORY_WEIGHT + practicalScore * HISTOLOGY_PRACTICAL_WEIGHT
    );
  }

  return list
    .filter((c) => c.id !== 111)
    .map((course) => {
      if (course.id === 103) {
        return {
          ...course,
          name: 'Histoloji Teorik + Pratik',
          credit: HISTOLOGY_COMBINED_CREDIT,
          score: mergedScore,
          isPracticalPart: undefined,
        };
      }
      return course;
    });
};

const migrateAllCourses = (data: AllCoursesData): AllCoursesData => ({
  sinif1: {
    guz: migrateGuzHistologyCourses(data.sinif1.guz),
    bahar: migrateBaharHistologyCourses(data.sinif1.bahar),
  },
  sinif2: data.sinif2,
});

// --- 1. SINIF DERSLERİ ---
const GUZ_DERSLERI_1: Course[] = [
  { id: 1, name: 'Anatomi', credit: 2, score: '' },
  { id: 2, name: 'Fizyoloji', credit: 2, score: '' },
  { id: 3, name: 'Histoloji ve Embriyoloji', credit: HISTOLOGY_COMBINED_CREDIT, score: '' },
  { id: 4, name: 'Organik Kimya', credit: 2, score: '' },
  { id: 5, name: 'Diş Anatomisi ve Fizyolojisi', credit: 1, score: '' },
  { id: 6, name: 'Dental Materyaller', credit: 1, score: '' },
  { id: 7, name: 'Tıbbi Biyokimya', credit: 2, score: '' },
  { id: 8, name: 'Tıbbi Biyoloji ve Genetik', credit: 2, score: '' },
  { id: 9, name: 'Öğrenci Oryantasyonu ve Diş Hekimliği Tarihi', credit: 1, score: '' },
  { id: 10, name: 'Anatomi Pratik', credit: 1, score: '' },
  { id: 11, name: 'Histoloji ve Embriyoloji Pratik', credit: 0, score: '', isPracticalPart: true },
];

const BAHAR_DERSLERI_1: Course[] = [
  { id: 101, name: 'Anatomi', credit: 2, score: '' },
  { id: 102, name: 'Fizyoloji', credit: 2, score: '' },
  { id: 103, name: 'Histoloji Teorik + Pratik', credit: HISTOLOGY_COMBINED_CREDIT, score: '' },
  { id: 104, name: 'Biyoistatistik', credit: 1, score: '' },
  { id: 105, name: 'Diş Anatomisi ve Fizyolojisi', credit: 1, score: '' },
  { id: 106, name: 'Dental Materyaller', credit: 1, score: '' },
  { id: 107, name: 'Biyofizik', credit: 2, score: '' },
  { id: 108, name: 'Mikrobiyoloji', credit: 1, score: '' },
  { id: 110, name: 'Anatomi Pratik', credit: 1, score: '' },
];

// --- 2. SINIF DERSLERİ ---
const GUZ_DERSLERI_2: Course[] = [
  { id: 201, name: 'Protetik Diş Tedavisi', credit: 2, score: '' },
  { id: 202, name: 'Restoratif Diş Tedavisi', credit: 2, score: '' },
  { id: 203, name: 'Endodonti', credit: 2, score: '' },
  { id: 204, name: 'Patoloji', credit: 1, score: '' },
  { id: 205, name: 'Mikrobiyoloji', credit: 1, score: '' },
  { id: 206, name: 'Periodontoloji', credit: 1, score: '' },
  { id: 207, name: 'Pedodonti', credit: 1, score: '' },
  { id: 208, name: 'Farmakoloji', credit: 1, score: '' },
];

const BAHAR_DERSLERI_2: Course[] = [
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
  const [allCourses, setAllCourses] = useState<AllCoursesData>({
    sinif1: { guz: GUZ_DERSLERI_1, bahar: BAHAR_DERSLERI_1 },
    sinif2: { guz: GUZ_DERSLERI_2, bahar: BAHAR_DERSLERI_2 },
  });
  
  const [activeClass, setActiveClass] = useState('sinif1');
  const [activeTab, setActiveTab] = useState('guz');
  
  const [results, setResults] = useState({
    guzAvg: 0, baharAvg: 0, vizeAvg: 0, neededFinal: 0
  });

  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('uni_theme_v9');
    const savedData = localStorage.getItem('uni_data_v9');
    const savedClass = localStorage.getItem('uni_class_v9');

    if (savedTheme === 'dark') setDarkMode(true);
    if (savedData) setAllCourses(migrateAllCourses(JSON.parse(savedData) as AllCoursesData));
    if (savedClass) setActiveClass(savedClass);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('uni_theme_v9', darkMode ? 'dark' : 'light');
      localStorage.setItem('uni_data_v9', JSON.stringify(allCourses));
      localStorage.setItem('uni_class_v9', activeClass);
    }
    calculateAll();
  }, [allCourses, activeClass, darkMode, isLoaded]);

  // --- HESAPLAMA ---
  const getHistologyCombinedScore = (theoryScore: number, practicalScore: number | null) => {
    if (practicalScore !== null) {
      return theoryScore * HISTOLOGY_THEORY_WEIGHT + practicalScore * HISTOLOGY_PRACTICAL_WEIGHT;
    }
    return theoryScore;
  };

  const getAverageOfList = (list: Course[]) => {
    const practicalIds = new Set<number>(HISTOLOGY_PAIRS.map((p) => p.practicalId));
    const listById = Object.fromEntries(list.map((c) => [c.id, c]));

    let totalWeightedScore = 0;
    let totalCredits = 0;

    list.forEach((course) => {
      if (practicalIds.has(course.id)) return;

      const pair = HISTOLOGY_PAIRS.find((p) => p.theoryId === course.id);
      if (pair) {
        if (course.score === '') return;

        const theoryScore = parseFloat(course.score.toString());
        const practicalCourse = listById[pair.practicalId];
        const practicalScore =
          practicalCourse?.score !== ''
            ? parseFloat(practicalCourse.score.toString())
            : null;

        const combined = getHistologyCombinedScore(theoryScore, practicalScore);
        totalWeightedScore += combined * HISTOLOGY_COMBINED_CREDIT;
        totalCredits += HISTOLOGY_COMBINED_CREDIT;
        return;
      }

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
    const currentClassData: SemesterCourses = allCourses[activeClass as keyof AllCoursesData];
    let guz = Math.round(getAverageOfList(currentClassData.guz));
    let bahar = Math.round(getAverageOfList(currentClassData.bahar));
    let vize = Math.round((guz + bahar) / 2);

    const currentPoints = vize * 0.5;
    let needed = (GECME_NOTU - currentPoints) / 0.5;

    if (needed < FINAL_BARAJI) needed = FINAL_BARAJI;

    setResults({ guzAvg: guz, baharAvg: bahar, vizeAvg: vize, neededFinal: needed });
  };

  // NOT: Artık hem Güz hem Bahar aynı anda render edildiği için
  // updateScore fonksiyonunun hangi dönemi güncellediğini bilmesi gerek.
  const updateScore = (id: number, value: string, period: 'guz' | 'bahar') => {
    if (Number(value) > 100) return;
    if (Number(value) < 0) return;

    setAllCourses((prev) => {
      const classKey = activeClass as keyof AllCoursesData;
      return {
        ...prev,
        [classKey]: {
          ...prev[classKey],
          [period]: prev[classKey][period].map((c) =>
            c.id === id ? { ...c, score: value } : c
          ),
        },
      };
    });
  };

  const resetCurrentScores = () => {
    const defaultList = activeClass === 'sinif1' 
      ? (activeTab === 'guz' ? GUZ_DERSLERI_1 : BAHAR_DERSLERI_1)
      : (activeTab === 'guz' ? GUZ_DERSLERI_2 : BAHAR_DERSLERI_2);

    const cleanList = defaultList.map(c => ({...c, score: ''}));
    
    setAllCourses((prev) => {
      const classKey = activeClass as keyof AllCoursesData;
      return {
        ...prev,
        [classKey]: {
          ...prev[classKey],
          [activeTab]: cleanList,
        },
      };
    });
  };

  if (!isLoaded) return null;

  // Şu anki sınıfın dersleri (Dönem ayrımı yapmadan alıyoruz, çünkü ikisini de çizeceğiz)
  const currentClassData: SemesterCourses = allCourses[activeClass as keyof AllCoursesData];
  const groupGuzHistology = activeClass === 'sinif1';
  const guzDisplayItems = buildGuzCourseList(currentClassData.guz, groupGuzHistology);

  const scoreInputClass = (size: 'md' | 'sm') =>
    `w-full bg-transparent text-center font-bold outline-none ${
      size === 'md' ? 'text-lg' : 'text-base'
    } ${darkMode ? 'text-emerald-400 placeholder:text-zinc-800' : 'text-emerald-600 placeholder:text-zinc-200'}`;

  return (
    <main className={`min-h-screen transition-all duration-700 flex flex-col items-center justify-center p-6 text-[13px] overflow-hidden ${darkMode ? 'bg-black text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      
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

      <div className={`w-full max-w-md flex-grow flex flex-col justify-center py-10 overflow-hidden`}>
        <header className="mb-8 text-center z-10 relative">
          <h1 className={`text-3xl font-light tracking-tight ${darkMode ? 'text-white' : 'text-zinc-800'}`}>
            {UNI_NAME_LINE1}
            <span className="block mt-1 font-medium">{UNI_NAME_LINE2}</span>
          </h1>
          <p className="text-zinc-500 text-[10px] mt-3 font-medium uppercase tracking-[0.3em]">{BASLIK_ALT}</p>
        
          {/* SEÇİM KUTUSU */}
          <div className={`mt-8 inline-flex flex-col p-1.5 rounded-[20px] transition-all w-64 ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-zinc-100/80 border border-zinc-200'}`}>
            
            {/* ÜST SATIR: SINIF SEÇİMİ */}
            <div className="relative flex w-full mb-1 bg-transparent h-10 items-center">
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

            {/* ALT SATIR: DÖNEM SEÇİMİ */}
            <div className="relative flex w-full bg-transparent h-10 items-center">
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

        {/* --- DERS LİSTESİ (INSTAGRAM TARZI SLIDER) --- */}
        {/* Kapsayıcı: Sadece 1 ekran genişliğinde, taşanları gizler */}
        <div className="relative overflow-hidden w-full">
             
             {/* İçteki Uzun Şerit: 2 ekran genişliğinde (%200) */}
             {/* Güz seçiliyse translateX(0), Bahar seçiliyse translateX(-50%) yani sola kayar */}
             <div 
                className={`flex w-[200%] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${activeTab === 'guz' ? 'translate-x-0' : '-translate-x-1/2'}`}
             >
                {/* SOL TARAF: GÜZ DERSLERİ */}
                <div className="w-[50%] px-1">
                  <div className="space-y-3 mb-6">
                    {guzDisplayItems.map((item) => {
                      if ('kind' in item && item.kind === 'group') {
                        const { theory, practical } = item;
                        return (
                          <div
                            key={`group-${theory.id}`}
                            className={`rounded-2xl border transition-colors overflow-hidden ${
                              darkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-100 shadow-sm'
                            }`}
                          >
                            <div className="flex items-center gap-3 p-3">
                              <input
                                type="text"
                                value={theory.name}
                                readOnly
                                className={`flex-grow bg-transparent border-none outline-none text-sm font-medium cursor-default ${
                                  darkMode ? 'text-zinc-300' : 'text-zinc-700'
                                }`}
                              />
                              <div className="flex flex-col items-center w-12">
                                <label className="text-[8px] font-bold text-zinc-500 uppercase">KREDİ</label>
                                <input
                                  type="number"
                                  value={theory.credit}
                                  readOnly
                                  className={`w-full text-center bg-transparent border-none outline-none font-bold cursor-default ${
                                    darkMode ? 'text-zinc-500' : 'text-zinc-400'
                                  }`}
                                />
                              </div>
                              <div className="flex flex-col items-center w-16">
                                <label className="text-[8px] font-bold text-zinc-500 uppercase">TEORİK</label>
                                <input
                                  type="number"
                                  value={theory.score}
                                  placeholder="-"
                                  min={0}
                                  max={100}
                                  onChange={(e) => updateScore(theory.id, e.target.value, 'guz')}
                                  className={scoreInputClass('md')}
                                />
                              </div>
                            </div>
                            <div
                              className={`mx-3 mb-3 flex items-center gap-2 rounded-xl border-l-2 py-2 pl-3 pr-2 ${
                                darkMode
                                  ? 'border-zinc-600/80 bg-zinc-950/60'
                                  : 'border-zinc-300 bg-zinc-50'
                              }`}
                            >
                              <span
                                className={`flex-grow text-[11px] font-medium ${
                                  darkMode ? 'text-zinc-500' : 'text-zinc-500'
                                }`}
                              >
                                Pratik
                              </span>
                              <div className="flex flex-col items-center w-10 shrink-0">
                                <label className="text-[7px] font-bold text-zinc-500 uppercase">Etki</label>
                                <span
                                  className={`text-[10px] font-bold ${
                                    darkMode ? 'text-zinc-600' : 'text-zinc-400'
                                  }`}
                                >
                                  %8
                                </span>
                              </div>
                              <div className="flex flex-col items-center w-14 shrink-0">
                                <label className="text-[7px] font-bold text-zinc-500 uppercase">Puan</label>
                                <input
                                  type="number"
                                  value={practical.score}
                                  placeholder="-"
                                  min={0}
                                  max={100}
                                  onChange={(e) => updateScore(practical.id, e.target.value, 'guz')}
                                  className={scoreInputClass('sm')}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      }

                      const course = item as Course;
                      return (
                        <div
                          key={course.id}
                          className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
                            darkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-100 shadow-sm'
                          }`}
                        >
                          <input
                            type="text"
                            value={course.name}
                            readOnly
                            className={`flex-grow bg-transparent border-none outline-none text-sm font-medium cursor-default ${
                              darkMode ? 'text-zinc-400' : 'text-zinc-700'
                            }`}
                          />
                          <div className="flex flex-col items-center w-12">
                            <label className="text-[8px] font-bold text-zinc-500 uppercase">KREDİ</label>
                            <input
                              type="number"
                              value={course.credit}
                              readOnly
                              className={`w-full text-center bg-transparent border-none outline-none font-bold cursor-default ${
                                darkMode ? 'text-zinc-500' : 'text-zinc-400'
                              }`}
                            />
                          </div>
                          <div className="flex flex-col items-center w-16">
                            <label className="text-[8px] font-bold text-zinc-500 uppercase">PUAN</label>
                            <input
                              type="number"
                              value={course.score}
                              placeholder="-"
                              min={0}
                              max={100}
                              onChange={(e) => updateScore(course.id, e.target.value, 'guz')}
                              className={scoreInputClass('md')}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SAĞ TARAF: BAHAR DERSLERİ */}
                <div className="w-[50%] px-1">
                  <div className="space-y-3 mb-6">
                    {currentClassData.bahar.map((course) => (
                      <div key={course.id} className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${darkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-100 shadow-sm'}`}>
                        <input type="text" value={course.name} readOnly={true} className={`flex-grow bg-transparent border-none outline-none text-sm font-medium cursor-default ${darkMode ? 'text-zinc-400' : 'text-zinc-700'}`} />
                        <div className="flex flex-col items-center w-12">
                          <label className="text-[8px] font-bold text-zinc-500 uppercase">
                            {course.isPracticalPart ? 'ETKİ' : 'KREDİ'}
                          </label>
                          {course.isPracticalPart ? (
                            <span className={`w-full text-center font-bold text-xs ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>%8</span>
                          ) : (
                            <input type="number" value={course.credit} readOnly={true} className={`w-full text-center bg-transparent border-none outline-none font-bold cursor-default ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
                          )}
                        </div>
                        <div className="flex flex-col items-center w-16">
                          <label className="text-[8px] font-bold text-zinc-500 uppercase">PUAN</label>
                          {/* ÖNEMLİ: Güncelleme yaparken 'bahar' olduğunu belirtiyoruz */}
                          <input type="number" value={course.score} placeholder="-" min="0" max="100" onChange={(e) => updateScore(course.id, e.target.value, 'bahar')} className={`w-full bg-transparent text-center font-bold outline-none text-lg ${darkMode ? 'text-emerald-400 placeholder:text-zinc-800' : 'text-emerald-600 placeholder:text-zinc-200'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

             </div>
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
          Made by{' '}
          <a
            href="https://www.instagram.com/emirred0/"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors hover:underline underline-offset-2 ${
              darkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            Emir
          </a>
        </p>
        <div className={`h-[1px] flex-grow ${darkMode ? 'bg-zinc-900' : 'bg-zinc-200'}`}></div>
      </footer>
    </main>
  );
}