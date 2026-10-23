'use client';

import { useEffect, useRef, useState } from 'react';
import { analytics } from '@/lib/analytics';
import {
  AllCoursesData,
  BAHAR_DERSLERI_1,
  BAHAR_DERSLERI_2,
  Course,
  CourseListItem,
  DONEM1_BAHAR_GROUPS,
  DONEM1_GUZ_GROUPS,
  GUZ_DERSLERI_1,
  GUZ_DERSLERI_2,
  buildGroupedCourseList,
  calculateResults,
  createDefaultCourses,
  migrateAllCourses,
} from '@/lib/not-hesaplama';

type ClassKey = 'sinif1' | 'sinif2';
type Period = 'guz' | 'bahar';

const formatCredit = (credit: number) =>
  Number.isInteger(credit) ? String(credit) : credit.toFixed(1);

const scoreInputClass =
  'h-11 w-14 shrink-0 appearance-none rounded-xl border border-line bg-canvas text-center text-base font-semibold tabular-nums text-ink outline-none transition-colors [appearance:textfield] placeholder:font-normal placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line bg-white/90 text-ink-soft shadow-sm backdrop-blur transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-[#0f172a]/90 dark:text-slate-400 dark:hover:text-slate-100 dark:focus-visible:ring-offset-[#0b1220]"
    >
      {children}
    </button>
  );
}

function CourseRow({
  item,
  period,
  onScoreChange,
}: {
  item: CourseListItem;
  period: Period;
  onScoreChange: (id: number, value: string, period: Period) => void;
}) {
  if ('kind' in item && item.kind === 'group') {
    const { theory, practical, practicalDisplay } = item;
    return (
      <li className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="min-w-0 flex-1 text-sm font-medium leading-snug">{theory.name}</span>
          <span className="w-9 shrink-0 text-center text-xs font-semibold tabular-nums text-slate-500 dark:text-slate-400">
            {formatCredit(theory.credit)}
          </span>
          <input
            type="number"
            inputMode="numeric"
            autoComplete="off"
            min={0}
            max={100}
            value={theory.score}
            onChange={(e) => onScoreChange(theory.id, e.target.value, period)}
            placeholder="-"
            aria-label={`${theory.name} teorik puanı`}
            className={scoreInputClass}
          />
        </div>
        <div className="mt-2 flex items-center gap-3 rounded-xl bg-canvas px-3 py-2 dark:bg-[#0b1220]">
          <span className="min-w-0 flex-1 text-xs text-ink-soft dark:text-slate-400">
            {theory.name} Pratik
            <span className="ml-1 text-slate-500 dark:text-slate-500">
              {practicalDisplay === 'weighted' ? '(%8 etki)' : `(${formatCredit(practical.credit)} kredi)`}
            </span>
          </span>
          <input
            type="number"
            inputMode="numeric"
            autoComplete="off"
            min={0}
            max={100}
            value={practical.score}
            onChange={(e) => onScoreChange(practical.id, e.target.value, period)}
            placeholder="-"
            aria-label={`${theory.name} pratik puanı`}
            className={scoreInputClass}
          />
        </div>
      </li>
    );
  }

  const course = item as Course;
  return (
    <li className="flex items-center gap-3 px-4 py-2.5">
      <span className="min-w-0 flex-1 text-sm font-medium leading-snug">{course.name}</span>
      <span className="w-9 shrink-0 text-center text-xs font-semibold tabular-nums text-slate-500 dark:text-slate-400">
        {formatCredit(course.credit)}
      </span>
      <input
        type="number"
        inputMode="numeric"
        autoComplete="off"
        min={0}
        max={100}
        value={course.score}
        onChange={(e) => onScoreChange(course.id, e.target.value, period)}
        placeholder="-"
        aria-label={`${course.name} puanı`}
        className={scoreInputClass}
      />
    </li>
  );
}

export default function Home() {
  const [allCourses, setAllCourses] = useState<AllCoursesData>(createDefaultCourses);
  const [activeClass, setActiveClass] = useState<ClassKey>('sinif1');
  const [activeTab, setActiveTab] = useState<Period>('guz');
  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const scoreTrackedKeys = useRef(new Set<string>());

  useEffect(() => {
    const savedTheme = localStorage.getItem('uni_theme_v9');
    const savedData = localStorage.getItem('uni_data_v9');
    const savedClass = localStorage.getItem('uni_class_v9');

    // eslint-disable-next-line react-hooks/set-state-in-effect -- saved values are read once on mount
    if (savedTheme === 'dark') setDarkMode(true);
    if (savedData) setAllCourses(migrateAllCourses(JSON.parse(savedData) as AllCoursesData));
    if (savedClass === 'sinif1' || savedClass === 'sinif2') setActiveClass(savedClass);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('uni_theme_v9', darkMode ? 'dark' : 'light');
      localStorage.setItem('uni_data_v9', JSON.stringify(allCourses));
      localStorage.setItem('uni_class_v9', activeClass);
    }
  }, [allCourses, activeClass, darkMode, isLoaded]);

  const updateScore = (id: number, value: string, period: Period) => {
    if (Number(value) > 100) return;
    if (Number(value) < 0) return;

    if (value !== '') {
      const trackKey = `${activeClass}-${period}`;
      if (!scoreTrackedKeys.current.has(trackKey)) {
        scoreTrackedKeys.current.add(trackKey);
        analytics.scoreEntered(activeClass, period);
      }
    }

    setAllCourses((prev) => ({
      ...prev,
      [activeClass]: {
        ...prev[activeClass],
        [period]: prev[activeClass][period].map((c) =>
          c.id === id ? { ...c, score: value } : c
        ),
      },
    }));
  };

  const resetCurrentScores = () => {
    const confirmed = window.confirm(
      `${activeTab === 'guz' ? 'Güz' : 'Bahar'} dönemi notları temizlenecek. Emin misin?`
    );
    if (!confirmed) return;

    analytics.clearScores(activeClass, activeTab);

    const defaultList =
      activeClass === 'sinif1'
        ? activeTab === 'guz'
          ? GUZ_DERSLERI_1
          : BAHAR_DERSLERI_1
        : activeTab === 'guz'
          ? GUZ_DERSLERI_2
          : BAHAR_DERSLERI_2;

    const cleanList = defaultList.map((c) => ({ ...c, score: '' }));
    scoreTrackedKeys.current.delete(`${activeClass}-${activeTab}`);

    setAllCourses((prev) => ({
      ...prev,
      [activeClass]: {
        ...prev[activeClass],
        [activeTab]: cleanList,
      },
    }));
  };

  if (!isLoaded) return null;

  const currentClassData = allCourses[activeClass];
  const results = calculateResults(currentClassData);
  const displayItems = buildGroupedCourseList(
    currentClassData[activeTab],
    activeTab === 'guz' ? DONEM1_GUZ_GROUPS : DONEM1_BAHAR_GROUPS,
    activeClass === 'sinif1'
  );

  const noScores = !results.hasScores;
  const failed = !noScores && results.neededFinal > 100;
  const passed = !noScores && results.neededFinal <= 0;

  const finalTone = failed
    ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300'
    : passed
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300'
      : 'border-line bg-white text-ink dark:border-slate-800 dark:bg-[#0f172a] dark:text-slate-100';

  return (
    <main className="min-h-dvh bg-canvas text-ink transition-colors duration-300 dark:bg-[#0b1220] dark:text-slate-100">
      <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
        <IconButton label="Dönem notlarını temizle" onClick={resetCurrentScores}>
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
        </IconButton>
        <IconButton
          label={darkMode ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
          onClick={() => {
            const nextDark = !darkMode;
            setDarkMode(nextDark);
            analytics.toggleTheme(nextDark ? 'dark' : 'light');
          }}
        >
          {darkMode ? (
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </IconButton>
      </div>

      <div className="mx-auto w-full max-w-lg px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
        <header className="text-center">
          <div
            aria-hidden="true"
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-[11px] font-bold tracking-wide text-white shadow-sm dark:bg-[#22456f]"
          >
            OMÜ
          </div>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand dark:text-slate-400">
            Ondokuz Mayıs Üniversitesi · Diş Hekimliği Fakültesi
          </p>
          <h1 className="mt-2 text-[26px] font-semibold tracking-tight sm:text-3xl">
            Not Hesaplama
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft dark:text-slate-400">
            Vize notlarını gir; dönem ortalamanı ve finalde alman gereken notu anında gör.
          </p>
        </header>

        <section aria-label="Sınıf ve dönem seçimi" className="mt-8">
          <div className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-white p-1 dark:border-slate-800 dark:bg-[#0f172a]">
            {(
              [
                { key: 'sinif1', label: 'Dönem 1' },
                { key: 'sinif2', label: 'Dönem 2' },
              ] as const
            ).map((option) => {
              const isActive = activeClass === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    if (isActive) return;
                    setActiveClass(option.key);
                    analytics.selectDonem(option.key === 'sinif1' ? 'donem_1' : 'donem_2');
                  }}
                  className={`h-11 cursor-pointer rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0b1220] ${
                    isActive
                      ? 'bg-brand text-white shadow-sm dark:bg-[#22456f]'
                      : 'text-ink-soft hover:bg-brand-soft dark:text-slate-400 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="inline-flex rounded-xl border border-line bg-white p-1 dark:border-slate-800 dark:bg-[#0f172a]">
              {(
                [
                  { key: 'guz', label: 'Güz' },
                  { key: 'bahar', label: 'Bahar' },
                ] as const
              ).map((option) => {
                const isActive = activeTab === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => {
                      if (isActive) return;
                      setActiveTab(option.key);
                      analytics.selectYariyil(option.key);
                    }}
                    className={`h-10 cursor-pointer rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0b1220] ${
                      isActive
                        ? 'bg-brand-soft text-brand dark:bg-slate-800 dark:text-slate-100'
                        : 'text-ink-soft hover:text-ink dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {displayItems.length} ders
            </p>
          </div>
        </section>

        <section
          aria-label={`${activeTab === 'guz' ? 'Güz' : 'Bahar'} dönemi dersleri`}
          className="mt-4 overflow-hidden rounded-2xl border border-line bg-white dark:border-slate-800 dark:bg-[#0f172a]"
        >
          <div className="flex items-center gap-3 border-b border-line px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span className="flex-1">Ders</span>
            <span className="w-9 text-center">Kredi</span>
            <span className="w-14 text-center">Not</span>
          </div>
          <ul className="divide-y divide-line dark:divide-slate-800">
            {displayItems.map((item) => (
              <CourseRow
                key={'kind' in item ? `group-${item.theory.id}` : `course-${item.id}`}
                item={item}
                period={activeTab}
                onScoreChange={updateScore}
              />
            ))}
          </ul>
        </section>

        <section aria-live="polite" aria-label="Hesaplama sonuçları" className="mt-4 space-y-3">
          <div className="rounded-2xl bg-brand p-5 text-white shadow-sm dark:border dark:border-slate-800 dark:bg-[#122a45]">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                  Genel Ortalama
                </p>
                <p className="mt-1 text-5xl font-semibold tracking-tight tabular-nums">
                  {noScores ? '—' : results.vizeAvg}
                </p>
                <p className="mt-2 text-xs text-white/60">
                  Güz ve bahar ortalamasının %50&apos;si
                </p>
              </div>
              <dl className="shrink-0 space-y-2 text-right text-xs">
                <div className="flex items-baseline justify-end gap-2">
                  <dt className="text-white/60">Güz</dt>
                  <dd className="w-8 text-right font-semibold tabular-nums">
                    {noScores ? '—' : results.guzAvg}
                  </dd>
                </div>
                <div className="flex items-baseline justify-end gap-2">
                  <dt className="text-white/60">Bahar</dt>
                  <dd className="w-8 text-right font-semibold tabular-nums">
                    {noScores ? '—' : results.baharAvg}
                  </dd>
                </div>
                <div className="flex items-baseline justify-end gap-2 border-t border-white/15 pt-2">
                  <dt className="text-white/60">Geçme</dt>
                  <dd className="w-8 text-right font-semibold tabular-nums">60</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className={`flex items-center justify-between gap-4 rounded-2xl border p-5 ${finalTone}`}>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-60">
                Finalden alman gereken
              </p>
              {noScores ? (
                <>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">Notları girerek başla</p>
                  <p className="mt-1 text-xs opacity-70">
                    Sonuçlar not girdikçe otomatik hesaplanır.
                  </p>
                </>
              ) : failed ? (
                <>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">Geçmiş olsun</p>
                  <p className="mt-1 text-xs opacity-80">
                    {Math.round(results.neededFinal)} puan gerekiyor; 100 ile mümkün değil.
                  </p>
                </>
              ) : passed ? (
                <>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">Geçtiniz</p>
                  <p className="mt-1 text-xs opacity-80">
                    Finale gerek kalmadan geçme notunu tutturdunuz.
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">
                    {Math.round(results.neededFinal)}
                  </p>
                  <p className="mt-1 text-xs opacity-70">
                    Geçmek için finalde en az bu puanı almalısın.
                  </p>
                </>
              )}
            </div>
            <span
              aria-hidden="true"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${
                failed
                  ? 'border-red-200 bg-red-100/60 dark:border-red-900/60 dark:bg-red-900/20'
                  : passed
                    ? 'border-emerald-200 bg-emerald-100/60 dark:border-emerald-900/60 dark:bg-emerald-900/20'
                    : 'border-line bg-canvas dark:border-slate-700 dark:bg-[#0b1220]'
              }`}
            >
              {failed ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                </svg>
              ) : passed ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                </svg>
              )}
            </span>
          </div>
        </section>

        <footer className="mt-8 flex flex-col items-center gap-2 border-t border-line pt-5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <a
            href="https://www.instagram.com/emirdemyr/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded font-medium text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:text-slate-400 dark:hover:text-slate-200"
          >
            Made by Emir
          </a>
          <p>
            <a
              href="/eski"
              className="rounded underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:hover:text-slate-300"
            >
              Eski görünüm
            </a>
            <span className="px-2" aria-hidden="true">
              ·
            </span>
            OMÜ Diş Hekimliği
          </p>
        </footer>
      </div>
    </main>
  );
}
