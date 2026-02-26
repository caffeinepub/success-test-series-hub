import { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, IndianRupee } from 'lucide-react';
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
import { toast } from 'sonner';

interface QuestionForm {
  question: string;
  options: [string, string, string, string];
  answer: string;
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

const CATEGORIES = ['UPSC', 'BPSC', 'SSC', 'Railway', 'Banking', 'State Exams', 'Current Affairs'];

function makeEmptyQuestion(): QuestionForm {
  return {
    question: '',
    options: ['', '', '', ''],
    answer: '',
    explanation: '',
    questionHi: '',
    optionsHi: ['', '', '', ''],
    explanationHi: '',
    expanded: true,
  };
}

export default function TestFormModal({ open, onClose, editingTest }: TestFormModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [negativeMarkValue, setNegativeMarkValue] = useState<number>(0);
  const [questions, setQuestions] = useState<QuestionForm[]>([makeEmptyQuestion()]);
  const { mutateAsync: addTest, isPending: isAdding } = useAddTest();
  const { mutateAsync: updateTest, isPending: isUpdating } = useUpdateTest();

  const isPending = isAdding || isUpdating;

  useEffect(() => {
    if (open) {
      if (editingTest) {
        setTitle(editingTest.title);
        setCategory(editingTest.category);
        setPrice(Number(editingTest.price));
        setNegativeMarkValue(editingTest.negativeMarkValue ?? 0);
        setQuestions(
          editingTest.questions.map((q) => ({
            question: q.question,
            options: [
              q.options[0] ?? '',
              q.options[1] ?? '',
              q.options[2] ?? '',
              q.options[3] ?? '',
            ] as [string, string, string, string],
            answer: q.answer,
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
          }))
        );
      } else {
        setTitle('');
        setCategory('');
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
    setQuestions((prev) => [...prev, makeEmptyQuestion()]);
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

  const handleSave = async () => {
    const token = getSessionToken();
    if (!token) {
      toast.error('Session expired. Please log in again.');
      return;
    }

    if (!title.trim()) {
      toast.error('Test title is required.');
      return;
    }
    if (!category) {
      toast.error('Category is required.');
      return;
    }

    const questionPayload: Question[] = questions.map((q) => ({
      question: q.question,
      options: q.options,
      answer: q.answer,
      explanation: q.explanation || undefined,
      questionHi: q.questionHi || undefined,
      optionsHi: q.optionsHi.some((o) => o.trim()) ? q.optionsHi : undefined,
      explanationHi: q.explanationHi || undefined,
    }));

    try {
      if (editingTest) {
        await updateTest({
          token,
          id: editingTest.id,
          title,
          category,
          questions: questionPayload,
          price: BigInt(price),
          negativeMarkValue,
        });
        toast.success('Test updated successfully');
      } else {
        await addTest({
          token,
          title,
          category,
          questions: questionPayload,
          price: BigInt(price),
          negativeMarkValue,
        });
        toast.success('Test added successfully');
      }
      onClose();
    } catch {
      toast.error('Failed to save test. Please try again.');
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
          {/* Title + Category + Price + Negative Mark row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <Label className="text-foreground font-semibold mb-1.5 block">Test Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter test title"
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-gold"
              />
            </div>

            {/* Category */}
            <div>
              <Label className="text-foreground font-semibold mb-1.5 block">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-muted border-border text-foreground focus:border-gold">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-foreground hover:bg-accent">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                placeholder="e.g. -0.33 or 0"
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-gold"
              />
              <p className="text-xs text-muted-foreground mt-1">Use negative values (e.g. -0.33) or 0 for no penalty</p>
            </div>
          </div>

          {/* Questions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-foreground font-semibold">Questions ({questions.length})</Label>
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
                      {q.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      <span className="font-semibold text-sm">
                        Q{qi + 1}: {q.question ? q.question.slice(0, 50) + (q.question.length > 50 ? '...' : '') : 'New Question'}
                      </span>
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
                          English
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs mb-1 block">Question (English)</Label>
                          <Textarea
                            value={q.question}
                            onChange={(e) => updateQuestion(qi, 'question', e.target.value)}
                            placeholder="Enter question in English"
                            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-gold resize-none text-sm"
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {q.options.map((opt, oi) => (
                            <div key={oi}>
                              <Label className="text-muted-foreground text-xs mb-1 block">Option {oi + 1}</Label>
                              <Input
                                value={opt}
                                onChange={(e) => updateOption(qi, oi, e.target.value)}
                                placeholder={`Option ${oi + 1}`}
                                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-gold text-sm"
                              />
                            </div>
                          ))}
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs mb-1 block">Correct Answer</Label>
                          <Input
                            value={q.answer}
                            onChange={(e) => updateQuestion(qi, 'answer', e.target.value)}
                            placeholder="Must match one of the options exactly"
                            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-gold text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs mb-1 block">Explanation (optional)</Label>
                          <Textarea
                            value={q.explanation}
                            onChange={(e) => updateQuestion(qi, 'explanation', e.target.value)}
                            placeholder="Explanation for the correct answer"
                            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-gold resize-none text-sm"
                            rows={2}
                          />
                        </div>
                      </div>

                      {/* Hindi Section */}
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-sky uppercase tracking-widest border-b border-border pb-1">
                          Hindi (हिंदी)
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs mb-1 block">Question (Hindi)</Label>
                          <Textarea
                            value={q.questionHi}
                            onChange={(e) => updateQuestion(qi, 'questionHi', e.target.value)}
                            placeholder="हिंदी में प्रश्न दर्ज करें"
                            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-sky resize-none text-sm"
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {q.optionsHi.map((opt, oi) => (
                            <div key={oi}>
                              <Label className="text-muted-foreground text-xs mb-1 block">Option {oi + 1} (Hindi)</Label>
                              <Input
                                value={opt}
                                onChange={(e) => updateOptionHi(qi, oi, e.target.value)}
                                placeholder={`विकल्प ${oi + 1}`}
                                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-sky text-sm"
                              />
                            </div>
                          ))}
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs mb-1 block">Explanation (Hindi, optional)</Label>
                          <Textarea
                            value={q.explanationHi}
                            onChange={(e) => updateQuestion(qi, 'explanationHi', e.target.value)}
                            placeholder="हिंदी में स्पष्टीकरण"
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

        <DialogFooter className="gap-2 pt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="bg-gold hover:bg-gold-light text-navy-deep font-heading font-bold"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-navy-deep/30 border-t-navy-deep rounded-full animate-spin" />
                Saving…
              </span>
            ) : editingTest ? 'Update Test' : 'Add Test'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
