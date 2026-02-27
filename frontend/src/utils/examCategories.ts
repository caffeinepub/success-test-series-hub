import { ExamCategory } from '../backend';

/** Map ExamCategory enum values to human-readable display labels */
export const EXAM_CATEGORY_LABELS: Record<ExamCategory, string> = {
  [ExamCategory.upsc]: 'UPSC',
  [ExamCategory.ssc]: 'SSC',
  [ExamCategory.railway]: 'Railway',
  [ExamCategory.banking]: 'Banking',
  [ExamCategory.bpsc]: 'BPSC',
  [ExamCategory.stateExams]: 'State PCS',
};

/** Map ExamCategory enum values to Hindi display labels */
export const EXAM_CATEGORY_LABELS_HI: Record<ExamCategory, string> = {
  [ExamCategory.upsc]: 'UPSC',
  [ExamCategory.ssc]: 'SSC',
  [ExamCategory.railway]: 'रेलवे',
  [ExamCategory.banking]: 'बैंकिंग',
  [ExamCategory.bpsc]: 'BPSC',
  [ExamCategory.stateExams]: 'राज्य PCS',
};

/** All exam category options for dropdowns */
export const EXAM_CATEGORY_OPTIONS: { value: ExamCategory; label: string }[] = [
  { value: ExamCategory.upsc, label: 'UPSC' },
  { value: ExamCategory.bpsc, label: 'BPSC' },
  { value: ExamCategory.ssc, label: 'SSC' },
  { value: ExamCategory.railway, label: 'Railway' },
  { value: ExamCategory.banking, label: 'Banking' },
  { value: ExamCategory.stateExams, label: 'State PCS' },
];

/** Get display label for an ExamCategory value, with fallback */
export function getExamCategoryLabel(category: ExamCategory | string | undefined, lang: 'en' | 'hi' = 'en'): string {
  if (!category) return lang === 'hi' ? 'सामान्य' : 'General';
  const labels = lang === 'hi' ? EXAM_CATEGORY_LABELS_HI : EXAM_CATEGORY_LABELS;
  return labels[category as ExamCategory] ?? (lang === 'hi' ? 'सामान्य' : 'General');
}

/** Accent colors for each exam category badge */
export const EXAM_CATEGORY_COLORS: Record<ExamCategory, { color: string; bg: string }> = {
  [ExamCategory.upsc]: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  [ExamCategory.bpsc]: { color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  [ExamCategory.ssc]: { color: '#38bdf8', bg: 'rgba(56,189,248,0.15)' },
  [ExamCategory.railway]: { color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
  [ExamCategory.banking]: { color: '#fb923c', bg: 'rgba(251,146,60,0.15)' },
  [ExamCategory.stateExams]: { color: '#34d399', bg: 'rgba(52,211,153,0.15)' },
};
