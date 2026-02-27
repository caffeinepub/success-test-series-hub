import React, { useState } from 'react';
import { useGetTests } from '../hooks/useQueries';
import TestTakingModal from './TestTakingModal';
import type { Test } from '../backend';
import { BookOpen, Clock, Loader2, FileQuestion, PlayCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { getExamCategoryLabel, EXAM_CATEGORY_COLORS } from '../utils/examCategories';
import { ExamCategory } from '../backend';

// Estimate duration based on question count
function estimateDuration(questionCount: number): number {
  if (questionCount <= 30) return 30;
  if (questionCount <= 60) return 60;
  if (questionCount <= 100) return 90;
  if (questionCount <= 150) return 120;
  return Math.round(questionCount * 0.9);
}

export default function FreeTests() {
  const { data: tests = [], isLoading, error } = useGetTests();
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const { t } = useTranslation();

  const freeTests = tests.filter((test) => Number(test.price) === 0);

  return (
    <section id="free-tests" className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-rajdhani mb-3">
            {t('freeTestsTitle')}
          </h2>
          <p className="text-muted-foreground">{t('freeTestsSubtitle')}</p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin text-gold" />
            <span>{t('loading')}</span>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-destructive">
            <p>{t('errorLoading')}</p>
          </div>
        ) : freeTests.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">{t('noTestsAvailable')}</p>
            <p className="text-muted-foreground/60 text-sm mt-2">{t('checkBackSoon')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {freeTests.map((test) => {
              const categoryKey = test.category as ExamCategory;
              const categoryColors = EXAM_CATEGORY_COLORS[categoryKey] ?? {
                color: '#f59e0b',
                bg: 'rgba(245,158,11,0.15)',
              };
              const categoryLabel = getExamCategoryLabel(categoryKey, 'en');
              const questionCount = test.questions.length;
              const duration = estimateDuration(questionCount);

              return (
                <div
                  key={test.id.toString()}
                  className="rounded-2xl overflow-hidden border"
                  style={{
                    backgroundColor: '#0A1628',
                    borderColor: 'rgba(255,255,255,0.07)',
                  }}
                >
                  {/* Top accent bar using category color */}
                  <div
                    className="h-1 w-full"
                    style={{ backgroundColor: categoryColors.color }}
                  />

                  <div className="p-5 flex flex-col gap-4">
                    {/* Top row: category label + FREE badge */}
                    <div className="flex items-center justify-between">
                      {/* Category label pill */}
                      <span
                        className="text-xs font-bold font-rajdhani tracking-widest uppercase px-3 py-1 rounded-full"
                        style={{
                          color: categoryColors.color,
                          backgroundColor: categoryColors.bg,
                          border: `1px solid ${categoryColors.color}33`,
                        }}
                      >
                        {categoryLabel}
                      </span>

                      {/* FREE badge — vivid green, clearly visible */}
                      <span
                        className="text-xs font-extrabold tracking-widest uppercase px-3 py-1 rounded-full"
                        style={{
                          color: '#0A1628',
                          backgroundColor: '#22c55e',
                          letterSpacing: '0.12em',
                        }}
                      >
                        FREE
                      </span>
                    </div>

                    {/* Test title */}
                    <h3 className="text-white font-bold font-rajdhani text-xl leading-snug">
                      {test.title}
                    </h3>

                    {/* Metadata row */}
                    <div className="flex items-center gap-5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <FileQuestion className="w-4 h-4" style={{ color: categoryColors.color }} />
                        <span className="text-white/80">{questionCount}</span>
                        <span>Questions</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" style={{ color: categoryColors.color }} />
                        <span className="text-white/80">{duration}</span>
                        <span>min</span>
                      </span>
                    </div>

                    {/* Divider */}
                    <div
                      className="w-full h-px"
                      style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                    />

                    {/* Start Test button */}
                    <button
                      onClick={() => setSelectedTest(test)}
                      className="w-full py-3 rounded-xl font-bold font-rajdhani text-base tracking-wide transition-all duration-200 flex items-center justify-center gap-2 group"
                      style={{
                        background: 'transparent',
                        border: `1.5px solid ${categoryColors.color}66`,
                        color: categoryColors.color,
                      }}
                      onMouseEnter={(e) => {
                        const btn = e.currentTarget as HTMLButtonElement;
                        btn.style.background = categoryColors.bg;
                        btn.style.borderColor = categoryColors.color;
                      }}
                      onMouseLeave={(e) => {
                        const btn = e.currentTarget as HTMLButtonElement;
                        btn.style.background = 'transparent';
                        btn.style.borderColor = `${categoryColors.color}66`;
                      }}
                    >
                      <PlayCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
                      Start Test
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedTest && (
        <TestTakingModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
        />
      )}
    </section>
  );
}
