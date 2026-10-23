export const UNI_NAME_LINE1 = 'Ondokuz Mayıs Üniversitesi';
export const UNI_NAME_LINE2 = 'Diş Hekimliği Fakültesi';

export const GECME_NOTU = 60;
export const FINAL_BARAJI = 50;

export const HISTOLOGY_THEORY_WEIGHT = 0.92;
export const HISTOLOGY_PRACTICAL_WEIGHT = 0.08;
export const HISTOLOGY_COMBINED_CREDIT = 2.5;

export const HISTOLOGY_PAIRS: { theoryId: number; practicalId: number }[] = [
  { theoryId: 3, practicalId: 11 },
];

export type PracticalDisplay = 'weighted' | 'credit';

export type TheoryPracticalGroup = {
  theoryId: number;
  practicalId: number;
  practicalDisplay: PracticalDisplay;
};

export const DONEM1_GUZ_GROUPS: TheoryPracticalGroup[] = [
  { theoryId: 1, practicalId: 10, practicalDisplay: 'credit' },
  { theoryId: 3, practicalId: 11, practicalDisplay: 'weighted' },
];

export const DONEM1_BAHAR_GROUPS: TheoryPracticalGroup[] = [
  { theoryId: 101, practicalId: 110, practicalDisplay: 'credit' },
];

export type Course = {
  id: number;
  name: string;
  credit: number;
  score: string;
  isPracticalPart?: boolean;
};

export type SemesterCourses = { guz: Course[]; bahar: Course[] };
export type AllCoursesData = { sinif1: SemesterCourses; sinif2: SemesterCourses };

export type CourseGroupItem = {
  kind: 'group';
  theory: Course;
  practical: Course;
  practicalDisplay: PracticalDisplay;
};
export type CourseListItem = Course | CourseGroupItem;

export const buildGroupedCourseList = (
  courses: Course[],
  groups: TheoryPracticalGroup[],
  enabled: boolean
): CourseListItem[] => {
  if (!enabled || groups.length === 0) return courses;

  const byId = Object.fromEntries(courses.map((c) => [c.id, c]));
  const practicalIds = new Set(groups.map((g) => g.practicalId));
  const items: CourseListItem[] = [];

  for (const course of courses) {
    if (practicalIds.has(course.id)) continue;

    const group = groups.find((g) => g.theoryId === course.id);
    if (group && byId[group.practicalId]) {
      items.push({
        kind: 'group',
        theory: course,
        practical: byId[group.practicalId],
        practicalDisplay: group.practicalDisplay,
      });
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
  if (theory && practical && theory.score !== '' && practical.score !== '') {
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

export const migrateAllCourses = (data: AllCoursesData): AllCoursesData => ({
  sinif1: {
    guz: migrateGuzHistologyCourses(data.sinif1.guz),
    bahar: migrateBaharHistologyCourses(data.sinif1.bahar),
  },
  sinif2: data.sinif2,
});

export const GUZ_DERSLERI_1: Course[] = [
  { id: 1, name: 'Anatomi', credit: 2, score: '' },
  { id: 10, name: 'Anatomi Pratik', credit: 1, score: '' },
  { id: 2, name: 'Fizyoloji', credit: 2, score: '' },
  { id: 3, name: 'Histoloji ve Embriyoloji', credit: HISTOLOGY_COMBINED_CREDIT, score: '' },
  { id: 4, name: 'Organik Kimya', credit: 2, score: '' },
  { id: 5, name: 'Diş Anatomisi ve Fizyolojisi', credit: 1, score: '' },
  { id: 6, name: 'Dental Materyaller', credit: 1, score: '' },
  { id: 7, name: 'Tıbbi Biyokimya', credit: 2, score: '' },
  { id: 8, name: 'Tıbbi Biyoloji ve Genetik', credit: 2, score: '' },
  { id: 9, name: 'Öğrenci Oryantasyonu ve Diş Hekimliği Tarihi', credit: 1, score: '' },
  { id: 11, name: 'Histoloji ve Embriyoloji Pratik', credit: 0, score: '', isPracticalPart: true },
];

export const BAHAR_DERSLERI_1: Course[] = [
  { id: 101, name: 'Anatomi', credit: 2, score: '' },
  { id: 110, name: 'Anatomi Pratik', credit: 1, score: '' },
  { id: 102, name: 'Fizyoloji', credit: 2, score: '' },
  { id: 103, name: 'Histoloji Teorik + Pratik', credit: HISTOLOGY_COMBINED_CREDIT, score: '' },
  { id: 104, name: 'Biyoistatistik', credit: 1, score: '' },
  { id: 105, name: 'Diş Anatomisi ve Fizyolojisi', credit: 1, score: '' },
  { id: 106, name: 'Dental Materyaller', credit: 1, score: '' },
  { id: 107, name: 'Biyofizik', credit: 2, score: '' },
  { id: 108, name: 'Mikrobiyoloji', credit: 1, score: '' },
];

export const GUZ_DERSLERI_2: Course[] = [
  { id: 201, name: 'Protetik Diş Tedavisi', credit: 2, score: '' },
  { id: 202, name: 'Restoratif Diş Tedavisi', credit: 2, score: '' },
  { id: 203, name: 'Endodonti', credit: 2, score: '' },
  { id: 204, name: 'Patoloji', credit: 1, score: '' },
  { id: 205, name: 'Mikrobiyoloji', credit: 1, score: '' },
  { id: 206, name: 'Periodontoloji', credit: 1, score: '' },
  { id: 207, name: 'Pedodonti', credit: 1, score: '' },
  { id: 208, name: 'Farmakoloji', credit: 1, score: '' },
];

export const BAHAR_DERSLERI_2: Course[] = [
  { id: 301, name: 'Protetik Diş Tedavisi', credit: 2, score: '' },
  { id: 302, name: 'Restoratif Diş Tedavisi', credit: 2, score: '' },
  { id: 303, name: 'Endodonti', credit: 2, score: '' },
  { id: 304, name: 'Ağız Diş ve Çene Radyolojisi', credit: 1, score: '' },
  { id: 305, name: 'Ağız Diş ve Çene Cerrahisi', credit: 2, score: '' },
  { id: 306, name: 'Periodontoloji', credit: 1, score: '' },
  { id: 307, name: 'Kariyer Planlama', credit: 1, score: '' },
];

export const createDefaultCourses = (): AllCoursesData => ({
  sinif1: { guz: GUZ_DERSLERI_1, bahar: BAHAR_DERSLERI_1 },
  sinif2: { guz: GUZ_DERSLERI_2, bahar: BAHAR_DERSLERI_2 },
});

export const getAverageOfList = (list: Course[]) => {
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
        practicalCourse?.score !== '' ? parseFloat(practicalCourse.score.toString()) : null;

      const combined =
        practicalScore !== null
          ? theoryScore * HISTOLOGY_THEORY_WEIGHT + practicalScore * HISTOLOGY_PRACTICAL_WEIGHT
          : theoryScore;

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

export type Results = {
  guzAvg: number;
  baharAvg: number;
  vizeAvg: number;
  neededFinal: number;
  hasScores: boolean;
};

export const calculateResults = (data: SemesterCourses): Results => {
  const guz = Math.round(getAverageOfList(data.guz));
  const bahar = Math.round(getAverageOfList(data.bahar));
  const vize = Math.round((guz + bahar) / 2);

  const needed = (GECME_NOTU - vize * 0.5) / 0.5;

  return {
    guzAvg: guz,
    baharAvg: bahar,
    vizeAvg: vize,
    neededFinal: needed < FINAL_BARAJI ? FINAL_BARAJI : needed,
    hasScores: [...data.guz, ...data.bahar].some((c) => c.score !== ''),
  };
};
