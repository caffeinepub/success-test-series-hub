import { useState } from 'react';
import { Sparkles, Loader2, CheckCircle, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useGenerateQuestions } from '@/hooks/useQueries';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import { getSessionToken } from '@/hooks/useAuth';
import type { Question } from '@/backend';

export default function AITestGenerator() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [genError, setGenError] = useState('');
  const { mutateAsync: generateQuestions, isPending } = useGenerateQuestions();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const difficultyOptions = [
    { value: 'Easy', label: t('difficultyEasy'), color: 'oklch(0.60 0.20 145)' },
    { value: 'Medium', label: t('difficultyMedium'), color: 'oklch(0.80 0.17 82)' },
    { value: 'Hard', label: t('difficultyHard'), color: 'oklch(0.68 0.22 30)' },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenError('');
    const token = getSessionToken() || '';
    try {
      const questions = await generateQuestions({ token, topic, difficulty });
      setGeneratedQuestions(questions);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Invalid session') || msg.includes('Unauthorized')) {
        setGenError('Admin login required to generate questions.');
      } else {
        setGenError('Failed to generate questions. Please try again.');
      }
    }
  };

  const getQuestionText = (q: Question) => {
    if (language === 'hi' && q.questionHi && q.questionHi.trim()) return q.questionHi;
    return q.question;
  };

  const getOptions = (q: Question) => {
    if (language === 'hi' && q.optionsHi && q.optionsHi.length > 0 && q.optionsHi.some(o => o.trim())) {
      return q.optionsHi;
    }
    return q.options;
  };

  return (
    <section className="py-16" style={{ background: 'linear-gradient(180deg, oklch(0.11 0.055 265) 0%, oklch(0.13 0.07 260) 50%, oklch(0.11 0.055 265) 100%)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Brain className="h-7 w-7 text-sky" />
            <h2 className="font-heading font-bold text-3xl md:text-4xl" style={{ color: 'oklch(0.96 0.01 255)' }}>
              {t('aiGeneratorTitle')}
            </h2>
          </div>
          <div className="w-20 h-1 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, oklch(0.65 0.22 238), oklch(0.80 0.17 82))' }} />
        </div>

        <div className="rounded-2xl p-8" style={{
          background: 'oklch(0.14 0.06 265)',
          border: '1px solid oklch(0.65 0.22 238 / 0.3)',
          boxShadow: '0 0 40px oklch(0.65 0.22 238 / 0.08)'
        }}>
          <div className="space-y-6">
            <div>
              <Label className="font-heading font-semibold mb-2 block text-sky">
                {t('topicLabel')}
              </Label>
              <Textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t('topicPlaceholder')}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-sky resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label className="font-heading font-semibold mb-2 block text-sky">
                {t('difficultyLabel')}
              </Label>
              <div className="flex gap-3">
                {difficultyOptions.map(({ value, label, color }) => (
                  <button
                    key={value}
                    onClick={() => setDifficulty(value)}
                    className="px-4 py-2 rounded-lg font-heading font-semibold text-sm transition-all"
                    style={difficulty === value ? {
                      background: color,
                      border: `1px solid ${color}`,
                      color: 'oklch(0.10 0.04 265)',
                      boxShadow: `0 0 12px ${color}55`,
                    } : {
                      background: 'oklch(0.18 0.065 265)',
                      border: `1px solid oklch(0.28 0.07 265)`,
                      color: 'oklch(0.72 0.04 255)',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {genError && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                {genError}
              </p>
            )}

            <Button
              onClick={handleGenerate}
              disabled={isPending || !topic.trim()}
              className="w-full font-heading font-bold tracking-wide text-lg py-6"
              style={{ background: 'oklch(0.65 0.22 238)', color: 'oklch(0.10 0.04 265)' }}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {t('generatingBtn')}
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  {t('generateBtn')}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Generated Questions */}
        {generatedQuestions.length > 0 && (
          <div className="mt-8 space-y-6">
            <h3 className="font-heading font-bold text-xl text-gold">{t('generatedQuestionsTitle')}</h3>
            {generatedQuestions.map((q, i) => {
              const questionText = getQuestionText(q);
              const options = getOptions(q);
              return (
                <div key={i} className="rounded-xl p-6" style={{
                  background: 'oklch(0.14 0.06 265)',
                  border: '1px solid oklch(0.26 0.07 265)'
                }}>
                  <p className="font-medium mb-4" style={{ color: 'oklch(0.96 0.01 255)' }}>
                    <span className="text-gold font-heading font-bold mr-2">{t('questionLabel')} {i + 1}.</span>
                    {questionText}
                  </p>
                  <div className="space-y-2">
                    {options.map((option, oi) => {
                      const isCorrect = q.options[oi] === q.answer;
                      return (
                        <div
                          key={oi}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm"
                          style={isCorrect ? {
                            border: '1px solid oklch(0.60 0.20 145 / 0.6)',
                            background: 'oklch(0.60 0.20 145 / 0.12)',
                            color: 'oklch(0.60 0.20 145)',
                          } : {
                            border: '1px solid oklch(0.26 0.07 265)',
                            color: 'oklch(0.72 0.04 255)',
                          }}
                        >
                          {isCorrect && <CheckCircle className="h-4 w-4 shrink-0" />}
                          <span className="font-semibold mr-1">{String.fromCharCode(65 + oi)}.</span>
                          {option}
                          {isCorrect && (
                            <span className="ml-auto text-xs font-semibold">{t('correctAnswer')}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
