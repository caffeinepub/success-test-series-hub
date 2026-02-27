import { useState } from 'react';
import {
  Plus, Trash2, ChevronDown, ChevronUp, ArrowUp, ArrowDown,
  Pencil, CheckCircle2, AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export interface QuestionForm {
  question: string;
  options: [string, string, string, string];
  answerIndex: number;
  explanation: string;
  questionHi: string;
  optionsHi: [string, string, string, string];
  explanationHi: string;
  expanded: boolean;
}

export function makeEmptyQuestion(): QuestionForm {
  return {
    question: '',
    options: ['', '', '', ''],
    answerIndex: -1,
    explanation: '',
    questionHi: '',
    optionsHi: ['', '', '', ''],
    explanationHi: '',
    expanded: true,
  };
}

interface QuestionManagerProps {
  questions: QuestionForm[];
  onQuestionsChange: (questions: QuestionForm[]) => void;
}

export default function QuestionManager({ questions, onQuestionsChange }: QuestionManagerProps) {
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);

  const updateQuestion = (index: number, field: keyof QuestionForm, value: unknown) => {
    onQuestionsChange(
      questions.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    onQuestionsChange(
      questions.map((q, i) => {
        if (i !== qIndex) return q;
        const newOptions = [...q.options] as [string, string, string, string];
        newOptions[oIndex] = value;
        return { ...q, options: newOptions };
      })
    );
  };

  const updateOptionHi = (qIndex: number, oIndex: number, value: string) => {
    onQuestionsChange(
      questions.map((q, i) => {
        if (i !== qIndex) return q;
        const newOptions = [...q.optionsHi] as [string, string, string, string];
        newOptions[oIndex] = value;
        return { ...q, optionsHi: newOptions };
      })
    );
  };

  const addQuestion = () => {
    onQuestionsChange([
      ...questions.map((q) => ({ ...q, expanded: false })),
      makeEmptyQuestion(),
    ]);
  };

  const removeQuestion = (index: number) => {
    onQuestionsChange(questions.filter((_, i) => i !== index));
    setDeleteConfirmIndex(null);
  };

  const toggleExpand = (index: number) => {
    onQuestionsChange(
      questions.map((q, i) => (i === index ? { ...q, expanded: !q.expanded } : q))
    );
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newQ = [...questions];
    [newQ[index - 1], newQ[index]] = [newQ[index], newQ[index - 1]];
    onQuestionsChange(newQ);
  };

  const moveDown = (index: number) => {
    if (index === questions.length - 1) return;
    const newQ = [...questions];
    [newQ[index], newQ[index + 1]] = [newQ[index + 1], newQ[index]];
    onQuestionsChange(newQ);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            Questions
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({questions.length} added)
            </span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add at least one question. Use arrows to reorder.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={addQuestion}
          className="bg-gold hover:bg-gold-light text-navy-deep font-semibold gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </div>

      {/* Question Cards */}
      {questions.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl p-10 text-center">
          <p className="text-muted-foreground text-sm">No questions yet. Click "Add Question" to start.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, qi) => (
            <div
              key={qi}
              className="bg-muted border border-border rounded-xl overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-accent/30">
                {/* Question Number Badge */}
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gold text-navy-deep text-xs font-bold flex items-center justify-center">
                  Q{qi + 1}
                </span>

                {/* Preview / Toggle */}
                <button
                  type="button"
                  onClick={() => toggleExpand(qi)}
                  className="flex items-center gap-1.5 flex-1 text-left min-w-0"
                >
                  <span className="text-sm font-medium text-foreground truncate">
                    {q.question
                      ? q.question.slice(0, 60) + (q.question.length > 60 ? '…' : '')
                      : <span className="text-muted-foreground italic">New Question</span>}
                  </span>
                  {q.answerIndex >= 0 && q.options[q.answerIndex]?.trim() && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                  )}
                </button>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Reorder */}
                  <button
                    type="button"
                    onClick={() => moveUp(qi)}
                    disabled={qi === 0}
                    className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(qi)}
                    disabled={qi === questions.length - 1}
                    className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>

                  {/* Edit Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(qi)}
                    className="p-1 rounded text-muted-foreground hover:text-gold transition-colors"
                    title={q.expanded ? 'Collapse' : 'Edit'}
                  >
                    {q.expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
                  </button>

                  {/* Delete */}
                  {deleteConfirmIndex === qi ? (
                    <div className="flex items-center gap-1 bg-destructive/10 border border-destructive/30 rounded px-2 py-0.5">
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                      <span className="text-xs text-destructive">Delete?</span>
                      <button
                        type="button"
                        onClick={() => removeQuestion(qi)}
                        className="text-xs text-destructive font-bold hover:underline ml-1"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmIndex(null)}
                        className="text-xs text-muted-foreground hover:underline"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmIndex(qi)}
                      className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete question"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Form */}
              {q.expanded && (
                <div className="p-4 space-y-5">
                  {/* English Section */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-gold uppercase tracking-widest border-b border-border pb-1">
                      English *
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-xs mb-1 block">
                        Question Text (English) *
                      </Label>
                      <Textarea
                        value={q.question}
                        onChange={(e) => updateQuestion(qi, 'question', e.target.value)}
                        placeholder="Enter question in English"
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-gold resize-none text-sm"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-xs mb-2 block">
                        Options * — Click the circle to mark the correct answer
                      </Label>
                      <div className="space-y-2">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQuestion(qi, 'answerIndex', oi)}
                              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all ${
                                q.answerIndex === oi
                                  ? 'border-success bg-success'
                                  : 'border-muted-foreground hover:border-gold'
                              }`}
                              title="Mark as correct answer"
                            >
                              {q.answerIndex === oi && (
                                <span className="flex items-center justify-center w-full h-full">
                                  <span className="w-2 h-2 rounded-full bg-navy-deep block" />
                                </span>
                              )}
                            </button>
                            <span className="text-xs text-muted-foreground w-5 flex-shrink-0 font-semibold">
                              {String.fromCharCode(65 + oi)}.
                            </span>
                            <Input
                              value={opt}
                              onChange={(e) => updateOption(qi, oi, e.target.value)}
                              placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                              className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-gold text-sm h-8"
                            />
                          </div>
                        ))}
                      </div>
                      {q.answerIndex >= 0 && q.options[q.answerIndex]?.trim() && (
                        <p className="text-xs text-success mt-1.5 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Correct: {q.options[q.answerIndex]}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-xs mb-1 block">
                        Explanation (optional)
                      </Label>
                      <Textarea
                        value={q.explanation}
                        onChange={(e) => updateQuestion(qi, 'explanation', e.target.value)}
                        placeholder="Explain the correct answer (optional)"
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-gold resize-none text-sm"
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Hindi Section */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-sky uppercase tracking-widest border-b border-border pb-1">
                      Hindi (हिंदी) — Optional
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-xs mb-1 block">
                        Question Text (Hindi)
                      </Label>
                      <Textarea
                        value={q.questionHi}
                        onChange={(e) => updateQuestion(qi, 'questionHi', e.target.value)}
                        placeholder="हिंदी में प्रश्न लिखें (वैकल्पिक)"
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-sky resize-none text-sm"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-xs mb-2 block">
                        Options (Hindi)
                      </Label>
                      <div className="space-y-2">
                        {q.optionsHi.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-5 flex-shrink-0 font-semibold">
                              {String.fromCharCode(65 + oi)}.
                            </span>
                            <Input
                              value={opt}
                              onChange={(e) => updateOptionHi(qi, oi, e.target.value)}
                              placeholder={`विकल्प ${String.fromCharCode(65 + oi)}`}
                              className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-sky text-sm h-8"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-xs mb-1 block">
                        Explanation (Hindi)
                      </Label>
                      <Textarea
                        value={q.explanationHi}
                        onChange={(e) => updateQuestion(qi, 'explanationHi', e.target.value)}
                        placeholder="हिंदी में स्पष्टीकरण (वैकल्पिक)"
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-sky resize-none text-sm"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bottom Add Button */}
      {questions.length > 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={addQuestion}
          className="w-full border-dashed border-border text-muted-foreground hover:text-gold hover:border-gold gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Another Question
        </Button>
      )}
    </div>
  );
}
