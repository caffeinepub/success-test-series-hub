import { useState } from 'react';
import { X, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import type { Test } from '../backend';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TestTakingModalProps {
  test: Test;
  onClose: () => void;
}

export default function TestTakingModal({ test, onClose }: TestTakingModalProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    let correct = 0;
    test.questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const percentage = test.questions.length > 0
    ? Math.round((score / test.questions.length) * 100)
    : 0;

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 50) return 'text-gold';
    return 'text-destructive';
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border text-foreground p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-navy-deep">
          <DialogTitle className="font-heading text-2xl text-foreground flex items-center gap-2">
            <Trophy size={22} className="text-gold" />
            {test.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {test.category} • {test.questions.length} Questions
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh]">
          <div className="px-6 py-5 space-y-6">
            {submitted ? (
              <>
                {/* Score Summary */}
                <div className="text-center py-6 bg-navy-deep rounded-xl border border-border">
                  <div className={`font-heading text-6xl font-bold ${getScoreColor()}`}>
                    {percentage}%
                  </div>
                  <div className="text-muted-foreground mt-2">
                    {score} out of {test.questions.length} correct
                  </div>
                  <div className="mt-3 text-sm font-semibold">
                    {percentage >= 80 ? '🎉 Excellent!' : percentage >= 50 ? '👍 Good effort!' : '📚 Keep practicing!'}
                  </div>
                </div>

                {/* Answer Review */}
                <div className="space-y-4">
                  <h3 className="font-heading text-lg font-bold text-foreground">Answer Review</h3>
                  {test.questions.map((q, i) => {
                    const userAnswer = answers[i];
                    const isCorrect = userAnswer === q.answer;
                    return (
                      <div
                        key={i}
                        className={`p-4 rounded-lg border ${
                          isCorrect ? 'border-success/40 bg-success/5' : 'border-destructive/40 bg-destructive/5'
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-3">
                          {isCorrect
                            ? <CheckCircle2 size={18} className="text-success mt-0.5 shrink-0" />
                            : <XCircle size={18} className="text-destructive mt-0.5 shrink-0" />
                          }
                          <p className="text-sm font-medium text-foreground">
                            Q{i + 1}. {q.question}
                          </p>
                        </div>
                        <div className="ml-6 space-y-1">
                          {q.options.map((opt) => (
                            <div
                              key={opt}
                              className={`text-xs px-3 py-1.5 rounded-md ${
                                opt === q.answer
                                  ? 'bg-gold/20 text-gold font-semibold border border-gold/40'
                                  : opt === userAnswer && !isCorrect
                                  ? 'bg-destructive/20 text-destructive border border-destructive/40'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {opt === q.answer && '✓ '}{opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="space-y-6">
                {test.questions.map((q, i) => (
                  <div key={i} className="bg-navy-deep rounded-lg p-4 border border-border">
                    <p className="font-medium text-foreground mb-4">
                      <span className="text-gold font-bold">Q{i + 1}.</span> {q.question}
                    </p>
                    <RadioGroup
                      value={answers[i] || ''}
                      onValueChange={(val) => setAnswers((prev) => ({ ...prev, [i]: val }))}
                      className="space-y-2"
                    >
                      {q.options.map((opt) => (
                        <div
                          key={opt}
                          className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                            answers[i] === opt
                              ? 'border-gold/60 bg-gold/10'
                              : 'border-border hover:border-gold/30 hover:bg-navy-light'
                          }`}
                          onClick={() => setAnswers((prev) => ({ ...prev, [i]: opt }))}
                        >
                          <RadioGroupItem value={opt} id={`q${i}-${opt}`} className="border-gold text-gold" />
                          <Label htmlFor={`q${i}-${opt}`} className="cursor-pointer text-sm text-foreground">
                            {opt}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t border-border bg-navy-deep flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Close
          </button>
          {!submitted && (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < test.questions.length}
              className="inline-flex items-center gap-2 bg-success text-success-foreground font-semibold text-sm px-6 py-2.5 rounded-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit Test
            </button>
          )}
          {submitted && (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 bg-gold text-navy-deep font-semibold text-sm px-6 py-2.5 rounded-md hover:opacity-90 active:scale-95 transition-all"
            >
              Done
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
