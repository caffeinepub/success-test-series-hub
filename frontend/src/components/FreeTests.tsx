import React, { useState } from 'react';
import { useGetTests } from '../hooks/useQueries';
import TestTakingModal from './TestTakingModal';
import type { Test } from '../backend';
import { BookOpen, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function FreeTests() {
  const { data: tests = [], isLoading, error } = useGetTests();
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const { t } = useTranslation();

  const freeTests = tests.filter((test) => Number(test.price) === 0);

  return (
    <section id="free-tests" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-rajdhani mb-3">
            {t('freeTestsTitle')}
          </h2>
          <p className="text-navy-300">{t('freeTestsSubtitle')}</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-navy-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>{t('loading')}</span>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-400">
            <p>{t('errorLoading')}</p>
          </div>
        ) : freeTests.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-navy-600 mx-auto mb-4" />
            <p className="text-navy-400 text-lg">{t('noTestsAvailable')}</p>
            <p className="text-navy-500 text-sm mt-2">{t('checkBackSoon')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {freeTests.map((test) => (
              <div
                key={test.id.toString()}
                className="bg-navy-800 border border-navy-600 rounded-2xl p-5 hover:border-gold-500/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-sky-400" />
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                    FREE
                  </span>
                </div>

                <h3 className="text-white font-semibold font-rajdhani mb-1 group-hover:text-gold-400 transition-colors">
                  {test.title}
                </h3>
                <p className="text-navy-400 text-sm mb-3">{test.category}</p>

                <div className="flex items-center gap-3 text-xs text-navy-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {test.questions.length} {t('questions')}
                  </span>
                </div>

                {/* Negative Marking Badge */}
                {test.negativeMarkValue !== 0 ? (
                  <div className="flex items-center gap-1.5 mb-3 text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-lg px-2.5 py-1.5">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span>Negative: {test.negativeMarkValue} per wrong answer</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 mb-3 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-2.5 py-1.5">
                    <span>✓ No negative marking</span>
                  </div>
                )}

                <button
                  onClick={() => setSelectedTest(test)}
                  className="w-full py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 font-semibold text-sm transition-all border border-sky-500/30 hover:border-sky-500/50"
                >
                  {t('attemptTest')}
                </button>
              </div>
            ))}
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
