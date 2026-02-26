import React, { useState } from 'react';
import type { Test } from '../backend';
import { X, CheckCircle, XCircle, AlertTriangle, Trophy } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

interface TestTakingModalProps {
  test: Test;
  onClose: () => void;
}

export default function TestTakingModal({ test, onClose }: TestTakingModalProps) {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const isHindi = language === 'hi';

  const handleAnswer = (questionIndex: number, option: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    let wrongCount = 0;

    test.questions.forEach((q, i) => {
      const userAnswer = answers[i];
      if (!userAnswer) return; // unanswered — skip

      const correctAnswer = isHindi && q.answer ? q.answer : q.answer;
      if (userAnswer === correctAnswer) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    // Apply negative marking: score = correct - (wrong * |negativeMarkValue|)
    const negMark = test.negativeMarkValue ?? 0;
    const calculatedScore = correctCount + wrongCount * negMark;
    setScore(Math.max(0, calculatedScore));
    setSubmitted(true);
  };

  const getOptionLabel = (q: typeof test.questions[0], optionIndex: number): string => {
    if (isHindi && q.optionsHi && q.optionsHi[optionIndex]) {
      return q.optionsHi[optionIndex];
    }
    return q.options[optionIndex];
  };

  const getQuestionText = (q: typeof test.questions[0]): string => {
    if (isHindi && q.questionHi) return q.questionHi;
    return q.question;
  };

  const getExplanation = (q: typeof test.questions[0]): string | undefined => {
    if (isHindi && q.explanationHi) return q.explanationHi;
    return q.explanation ?? undefined;
  };

  const totalAnswered = Object.keys(answers).length;
  const totalQuestions = test.questions.length;

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/95 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-navy-950/95 py-3 -mx-4 px-4 border-b border-navy-700">
          <div>
            <h2 className="text-xl font-bold text-white font-rajdhani">{test.title}</h2>
            <p className="text-navy-400 text-sm">{test.category}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-navy-800 hover:bg-navy-700 flex items-center justify-center text-navy-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Negative marking notice */}
        {test.negativeMarkValue !== 0 && (
          <div className="mb-5 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-3 text-orange-400 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Negative marking: <strong>{test.negativeMarkValue}</strong> marks per wrong answer. Unanswered questions are not penalized.
            </span>
          </div>
        )}

        {/* Score Summary (after submit) */}
        {submitted && (
          <div className="mb-6 bg-navy-800 border border-gold-500/40 rounded-2xl p-6 text-center">
            <Trophy className="w-12 h-12 text-gold-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white font-rajdhani mb-1">
              {t('testCompleted')}
            </h3>
            <p className="text-4xl font-bold text-gold-400 mb-2">
              {score.toFixed(2)} / {totalQuestions}
            </p>
            <p className="text-navy-400 text-sm">
              {Object.entries(answers).filter(([i, ans]) => ans === test.questions[Number(i)].answer).length} correct ·{' '}
              {Object.entries(answers).filter(([i, ans]) => ans !== test.questions[Number(i)].answer).length} wrong ·{' '}
              {totalQuestions - totalAnswered} unanswered
            </p>
            {test.negativeMarkValue !== 0 && (
              <p className="text-orange-400 text-xs mt-2">
                Negative marking applied: {test.negativeMarkValue} per wrong answer
              </p>
            )}
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {test.questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = submitted && userAnswer === q.answer;
            const isWrong = submitted && userAnswer && userAnswer !== q.answer;
            const explanation = getExplanation(q);

            return (
              <div
                key={i}
                className={`bg-navy-800 border rounded-2xl p-5 ${
                  submitted
                    ? isCorrect
                      ? 'border-green-500/50'
                      : isWrong
                      ? 'border-red-500/50'
                      : 'border-navy-600'
                    : 'border-navy-600'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="w-7 h-7 rounded-full bg-navy-700 flex items-center justify-center text-xs font-bold text-navy-300 shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-white font-medium leading-relaxed">{getQuestionText(q)}</p>
                </div>

                <div className="space-y-2 ml-10">
                  {q.options.map((_, optIdx) => {
                    const optionText = getOptionLabel(q, optIdx);
                    const isSelected = userAnswer === q.options[optIdx];
                    const isCorrectOption = q.answer === q.options[optIdx];

                    let optionClass = 'border-navy-600 text-navy-200 hover:border-sky-500/50 hover:bg-sky-500/5';
                    if (submitted) {
                      if (isCorrectOption) {
                        optionClass = 'border-green-500/60 bg-green-500/10 text-green-300';
                      } else if (isSelected && !isCorrectOption) {
                        optionClass = 'border-red-500/60 bg-red-500/10 text-red-300';
                      } else {
                        optionClass = 'border-navy-700 text-navy-500';
                      }
                    } else if (isSelected) {
                      optionClass = 'border-sky-500/60 bg-sky-500/10 text-sky-300';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleAnswer(i, q.options[optIdx])}
                        disabled={submitted}
                        className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all ${optionClass}`}
                      >
                        <span className="font-medium mr-2 text-navy-400">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        {optionText}
                      </button>
                    );
                  })}
                </div>

                {submitted && explanation && (
                  <div className="mt-3 ml-10 bg-navy-700/50 border border-navy-600 rounded-xl px-4 py-3">
                    <p className="text-xs font-semibold text-gold-400 mb-1">Explanation</p>
                    <p className="text-navy-300 text-sm">{explanation}</p>
                  </div>
                )}

                {submitted && (
                  <div className="mt-2 ml-10 flex items-center gap-1.5 text-xs">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Correct (+1)</span>
                      </>
                    ) : isWrong ? (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-red-400">
                          Wrong ({test.negativeMarkValue !== 0 ? test.negativeMarkValue : '0'})
                        </span>
                      </>
                    ) : (
                      <span className="text-navy-500">Not answered (0)</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit / Close Button */}
        <div className="mt-8 flex justify-center gap-4">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={totalAnswered === 0}
              className="px-8 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('submitTest')} ({totalAnswered}/{totalQuestions} answered)
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-navy-700 hover:bg-navy-600 text-white font-bold text-sm transition-all"
            >
              {t('closeTest')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
