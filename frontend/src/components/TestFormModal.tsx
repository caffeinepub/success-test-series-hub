import { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, IndianRupee, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAddTest, useUpdateTest } from '@/hooks/useQueries';
import { getSessionToken } from '@/hooks/useAuth';
import type { Test, Question } from '@/backend';
import { ExamCategory } from '@/backend';
import { EXAM_CATEGORY_OPTIONS } from '@/utils/examCategories';
import { toast } from 'sonner';

interface QuestionForm {
  question: string;
  options: [string, string, string, string];
  answerIndex: number; // 0-3, index into options array
  explanation: string;
  questionHi: string;
  optionsHi: [string, string, string, string];
  explanationHi: string;
  expanded: boolean;
}

interface TestFormModalProps {
  open: boolean;
  onClose: () => void;
  editingTest: Test | null;
}

function makeEmptyQuestion(): QuestionForm {
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

/** Given a Question from backend, find which option index matches the answer string */
function findAnswerIndex(options: string[], answer: string): number {
  const idx = options.findIndex((o) => o === answer);
  return idx >= 0 ? idx : -1;
}

export default function TestFormModal({ open, onClose, editingTest }: TestFormModalProps) {
  const [title, setTitle] = useState('');
  const [examCategory, setExamCategory] = useState<ExamCategory>(ExamCategory.upsc);
  const [price, setPrice] = useState<number>(0);
  const [negativeMarkValue, setNegativeMarkValue] = useState<number>(0);
  const [questions, setQuestions] = useState<QuestionForm[]>([makeEmptyQuestion()]);
  const [errors, setErrors] = useState<string[]>([]);

  const { mutateAsync: addTest, isPending: isAdding } = useAddTest();
  const { mutateAsync: updateTest, isPending: isUpdating } = useUpdateTest();

  const isPending = isAdding || isUpdating;

  useEffect(() => {
    if (open) {
      setErrors([]);
      if (editingTest) {
        setTitle(editingTest.title);
        setExamCategory(editingTest.category as ExamCategory ?? ExamCategory.upsc);
        setPrice(Number(editingTest.price));
        setNegativeMarkValue(editingTest.negativeMarkValue ?? 0);
        setQuestions(
          editingTest.questions.length > 0
            ? editingTest.questions.map((q) => {
                const opts: [string, string, string, string] = [
                  q.options[0] ?? '',
                  q.options[1] ?? '',
                  q.options[2] ?? '',
                  q.options[3] ?? '',
                ];
                return {
                  question: q.question,
                  options: opts,
                  answerIndex: findAnswerIndex(opts, q.answer),
                  explanation: q.explanation ?? '',
                  questionHi: q.questionHi ?? '',
                  optionsHi: [
                    q.optionsHi?.[0] ?? '',
                    q.optionsHi?.[1] ?? '',
                    q.optionsHi?.[2] ?? '',
                    q.optionsHi?.[3] ?? '',
                  ] as [string, string, string, string],
                  explanationHi: q.explanationHi ?? '',
                  expanded: false,
                };
              })
            : [makeEmptyQuestion()]
        );
      } else {
        setTitle('');
        setExamCategory(ExamCategory.upsc);
        setPrice(0);
        setNegativeMarkValue(0);
        setQuestions([makeEmptyQuestion()]);
      }
    }
  }, [open, editingTest]);

  const updateQuestion = (index: number, field: keyof QuestionForm, value: unknown) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const newOptions = [...q.options] as [string, string, string, string];
        newOptions[oIndex] = value;
        return { ...q, options: newOptions };
      })
    );
  };

  const updateOptionHi = (qIndex: number, oIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const newOptions = [...q.optionsHi] as [string, string, string, string];
        newOptions[oIndex] = value;
        return { ...q, optionsHi: newOptions };
      })
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev.map((q) => ({ ...q, expanded: false })),
      makeEmptyQuestion(),
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleExpand = (index: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, expanded: !q.expanded } : q))
    );
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setPrice(isNaN(val) || val < 0 ? 0 : val);
  };

  const handleNegativeMarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setNegativeMarkValue(isNaN(val) ? 0 : val);
  };

  const validate = (): boolean => {
    const errs: string[] = [];

    if (!title.trim()) errs.push('Test title is required.');
    if (!examCategory) errs.push('Exam Category is required.');

    questions.forEach((q, qi) => {
      if (!q.question.trim()) {
        errs.push(`Question ${qi + 1}: Question text (English) is required.`);
      }
      const filledOptions = q.options.filter((o) => o.trim());
      if (filledOptions.length < 2) {
        errs.push(`Question ${qi + 1}: At least 2 options are required.`);
      }
      if (q.answerIndex < 0) {
        errs.push(`Question ${qi + 1}: Please select the correct answer.`);
      } else if (!q.options[q.answerIndex]?.trim()) {
        errs.push(`Question ${qi + 1}: The selected correct answer option is empty.`);
      }
    });

    setErrors(errs);
    return errs.length === 0;
  };

  const handleSave = async () => {
    const token = getSessionToken();
    if (!token) {
      toast.error('Session expired. Please log in again.');
      return;
    }

    if (!validate()) {
      setQuestions((prev) => prev.map((q) => ({ ...q, expanded: true })));
      return;
    }

    const questionPayload: Question[] = questions.map((q) => ({
      question: q.question.trim(),
      options: q.options,
      answer: q.options[q.answerIndex] ?? '',
      explanation: q.explanation.trim() || undefined,
      questionHi: q.questionHi.trim() || undefined,
      optionsHi: q.optionsHi.some((o) => o.trim()) ? q.optionsHi : undefined,
      explanationHi: q.explanationHi.trim() || undefined,
    }));

    try {
      if (editingTest) {
        await updateTest({
          token,
          id: editingTest.id,
          title: title.trim(),
          category: examCategory,
          questions: questionPayload,
          price: BigInt(price),
          negativeMarkValue,
        });
        toast.success(`Test updated with ${questionPayload.length} question(s)!`);
      } else {
        await addTest({
          token,
          title: title.trim(),
          category: examCategory,
          questions: questionPayload,
          price: BigInt(price),
          negativeMarkValue,
        });
        toast.success(`Test added with ${questionPayload.length} question(s)!`);
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Failed to save test: ${msg}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-navy-mid border-border text-foreground max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-gold text-xl">
            {editingTest ? 'Edit Test' : 'Add New Test'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Validation Errors */}
          {errors.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/40 rounded-lg p-3 space-y-1">
              {errors.map((err, i) => (
                <p key={i} className="text-destructive text-sm flex items-start gap-1.5">
                  <span className="mt-0.5 shrink-0">⚠</span>
                  {err}
                </p>
              ))}
            </div>
          )}

          {/* Title + Exam Category + Price + Negative Mark */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <Label className="text-foreground font-semibold mb-1.5 block">Test Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter test title"
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-gold"
              />
            </div>

            {/* Exam Category */}
            <div>
              <Label className="text-foreground font-semibold mb-1.5 block">Exam Category *</Label>
              <Select
                value={examCategory}
                onValueChange={(val) => setExamCategory(val as ExamCategory)}
              >
                <SelectTrigger className="bg-muted border-border text-foreground focus:border-gold">
                  <SelectValue placeholder="Select exam category" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {EXAM_CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-foreground hover:bg-accent"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Which exam is this test for?
              </p>
            </div>

            {/* Price */}
            <div>
              <Label className="text-foreground font-semibold mb-1.5 flex items-center gap-1">
                <IndianRupee className="h-3.5 w-3.5 text-gold" />
                Price (₹)
              </Label>
              <Input
                type="number"
                min={0}
                step={1}
                value={price}
                onChange={handlePriceChange}
                placeholder="0 = Free"
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-gold"
              />
              <p className="text-xs text-muted-foreground mt-1">Set 0 for free tests</p>
            </div>

            {/* Negative Mark */}
            <div>
              <Label className="text-foreground font-semibold mb-1.5 block">
                Negative Mark per Wrong Answer
              </Label>
              <Input
                type="number"
                step={0.01}
                value={negativeMarkValue}
                onChange={handleNegativeMarkChange}
                placeholder="e.g. 0.33 or 0"
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-gold"
              />
              <p className="text-xs text-muted-foreground mt-1">Use 0 for no penalty</p>
            </div>
          </div>

          {/* Questions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-foreground font-semibold">
                Questions ({questions.length})
              </Label>
              <Button
                type="button"
                size="sm"
                onClick={addQuestion}
                className="bg-gold hover:bg-gold-light text-navy-deep font-semibold"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Question
              </Button>
            </div>

            <div className="space-y-4">
              {questions.map((q, qi) => (
                <div key={qi} className="bg-muted border border-border rounded-xl overflow-hidden">
                  {/* Question Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-accent/30">
                    <button
                      type="button"
                      onClick={() => toggleExpand(qi)}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors flex-1 text-left"
                    >
                      {q.expanded ? (
                        <ChevronUp className="h-4 w-4 shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0" />
                      )}
                      <span className="font-semibold text-sm">
                        Q{qi + 1}:{' '}
                        {q.question
                          ? q.question.slice(0, 50) + (q.question.length > 50 ? '…' : '')
                          : 'New Question'}
                      </span>
                      {q.answerIndex >= 0 && q.options[q.answerIndex]?.trim() && (
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      )}
                    </button>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qi)}
                        className="text-destructive hover:text-red-400 transition-colors ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {q.expanded && (
                    <div className="p-4 space-y-5">
                      {/* English Section */}
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-gold uppercase tracking-widest border-b border-border pb-1">
                          English *
                        </div>

                        {/* Question Text */}
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

                        {/* Options */}
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
                                  title="Mark as correct answer"
                                  className={`shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    q.answerIndex === oi
                                      ? 'border-success bg-success/20 text-success'
                                      : 'border-border text-transparent hover:border-success/60'
                                  }`}
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                </button>
                                <span className="text-xs text-muted-foreground w-16 shrink-0">
                                  Option {oi + 1}
                                  {q.answerIndex === oi && (
                                    <span className="ml-1 text-success font-bold">✓</span>
                                  )}
                                </span>
                                <Input
                                  value={opt}
                                  onChange={(e) => updateOption(qi, oi, e.target.value)}
                                  placeholder={`Option ${oi + 1}`}
                                  className={`bg-background border-border text-foreground placeholder:text-muted-foreground text-sm flex-1 ${
                                    q.answerIndex === oi
                                      ? 'border-success focus:border-success'
                                      : 'focus:border-gold'
                                  }`}
                                />
                              </div>
                            ))}
                          </div>
                          {q.answerIndex < 0 && (
                            <p className="text-xs text-amber-400 mt-1.5">
                              ⚠ Click the circle next to an option to mark it as the correct answer
                            </p>
                          )}
                          {q.answerIndex >= 0 && (
                            <p className="text-xs text-success mt-1.5">
                              ✓ Correct answer: Option {q.answerIndex + 1}
                            </p>
                          )}
                        </div>

                        {/* Explanation */}
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
                          हिंदी (Hindi) — Optional
                        </div>

                        {/* Question Text Hindi */}
                        <div>
                          <Label className="text-muted-foreground text-xs mb-1 block">
                            Question Text (Hindi)
                          </Label>
                          <Textarea
                            value={q.questionHi}
                            onChange={(e) => updateQuestion(qi, 'questionHi', e.target.value)}
                            placeholder="हिंदी में प्रश्न दर्ज करें"
                            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-sky resize-none text-sm"
                            rows={2}
                          />
                        </div>

                        {/* Options Hindi */}
                        <div>
                          <Label className="text-muted-foreground text-xs mb-2 block">
                            Options (Hindi)
                          </Label>
                          <div className="space-y-2">
                            {q.optionsHi.map((opt, oi) => (
                              <div key={oi} className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground w-16 shrink-0">
                                  विकल्प {oi + 1}
                                </span>
                                <Input
                                  value={opt}
                                  onChange={(e) => updateOptionHi(qi, oi, e.target.value)}
                                  placeholder={`विकल्प ${oi + 1}`}
                                  className="bg-background border-border text-foreground placeholder:text-muted-foreground text-sm flex-1 focus:border-sky"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Explanation Hindi */}
                        <div>
                          <Label className="text-muted-foreground text-xs mb-1 block">
                            Explanation (Hindi)
                          </Label>
                          <Textarea
                            value={q.explanationHi}
                            onChange={(e) => updateQuestion(qi, 'explanationHi', e.target.value)}
                            placeholder="सही उत्तर की व्याख्या करें (वैकल्पिक)"
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
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-border gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="bg-gold hover:bg-gold-light text-navy-deep font-semibold min-w-[100px]"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving…
              </span>
            ) : editingTest ? (
              'Update Test'
            ) : (
              'Add Test'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
