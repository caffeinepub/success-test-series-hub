import { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAddTest, useUpdateTest } from '../hooks/useQueries';
import { getSessionToken } from '../hooks/useAuth';
import type { Test, Question } from '../backend';
import { toast } from 'sonner';

const CATEGORIES = ['UPSC', 'BPSC', 'SSC', 'Railway', 'State Exams'];

interface QuestionEntry {
  question: string;
  options: [string, string, string, string];
  answer: string;
}

const emptyQuestion = (): QuestionEntry => ({
  question: '',
  options: ['', '', '', ''],
  answer: '',
});

interface TestFormModalProps {
  open: boolean;
  onClose: () => void;
  editingTest: Test | null;
}

export default function TestFormModal({ open, onClose, editingTest }: TestFormModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState<QuestionEntry[]>([emptyQuestion()]);

  const addTest = useAddTest();
  const updateTest = useUpdateTest();

  const isEditing = !!editingTest;

  useEffect(() => {
    if (open) {
      if (editingTest) {
        setTitle(editingTest.title);
        setCategory(editingTest.category);
        setQuestions(
          editingTest.questions.length > 0
            ? editingTest.questions.map((q) => ({
                question: q.question,
                options: [
                  q.options[0] ?? '',
                  q.options[1] ?? '',
                  q.options[2] ?? '',
                  q.options[3] ?? '',
                ] as [string, string, string, string],
                answer: q.answer,
              }))
            : [emptyQuestion()]
        );
      } else {
        setTitle('');
        setCategory('');
        setQuestions([emptyQuestion()]);
      }
    }
  }, [open, editingTest]);

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, emptyQuestion()]);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (idx: number, field: keyof QuestionEntry, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (qIdx: number, optIdx: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        const newOptions = [...q.options] as [string, string, string, string];
        newOptions[optIdx] = value;
        return { ...q, options: newOptions };
      })
    );
  };

  const handleSetAnswer = (qIdx: number, option: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIdx ? { ...q, answer: option } : q))
    );
  };

  const validate = () => {
    if (!title.trim()) return 'Title is required.';
    if (!category) return 'Category is required.';
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) return `Question ${i + 1}: question text is required.`;
      for (let j = 0; j < 4; j++) {
        if (!q.options[j].trim()) return `Question ${i + 1}: all 4 options are required.`;
      }
      if (!q.answer) return `Question ${i + 1}: please select the correct answer.`;
    }
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }

    const token = getSessionToken();
    if (!token) { toast.error('Session expired. Please log in again.'); return; }

    const payload: Question[] = questions.map((q) => ({
      question: q.question,
      options: q.options,
      answer: q.answer,
    }));

    try {
      if (isEditing && editingTest) {
        await updateTest.mutateAsync({ token, id: editingTest.id, title, category, questions: payload });
        toast.success('Test updated successfully');
      } else {
        await addTest.mutateAsync({ token, title, category, questions: payload });
        toast.success('Test added successfully');
      }
      onClose();
    } catch {
      toast.error('Failed to save test. Please try again.');
    }
  };

  const isPending = addTest.isPending || updateTest.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl bg-card border-border text-foreground p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="font-heading text-xl text-foreground">
            {isEditing ? 'Edit Test' : 'Add New Test'}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="px-6 py-5 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label className="text-foreground/90 font-medium">Test Title</Label>
              <Input
                placeholder="e.g. UPSC Prelims Mock Test 1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-input border-border focus:border-gold"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-foreground/90 font-medium">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-input border-border focus:border-gold">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="hover:bg-navy-light">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-foreground/90 font-medium">
                  Questions ({questions.length})
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddQuestion}
                  className="gap-1.5 border-gold/40 text-gold hover:bg-gold/10 hover:text-gold text-xs"
                >
                  <Plus size={13} />
                  Add Question
                </Button>
              </div>

              {questions.map((q, qIdx) => (
                <div
                  key={qIdx}
                  className="p-4 rounded-lg border border-border bg-navy-light/30 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-gold mt-1">Q{qIdx + 1}</span>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <Input
                    placeholder="Question text"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                    className="bg-input border-border focus:border-gold text-sm"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSetAnswer(qIdx, opt || `Option ${optIdx + 1}`)}
                          className={`h-5 w-5 rounded-full border-2 shrink-0 transition-all ${
                            q.answer === opt && opt
                              ? 'border-gold bg-gold'
                              : 'border-muted-foreground hover:border-gold'
                          }`}
                          title="Set as correct answer"
                        />
                        <Input
                          placeholder={`Option ${optIdx + 1}`}
                          value={opt}
                          onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                          className="bg-input border-border focus:border-gold text-sm h-8"
                        />
                      </div>
                    ))}
                  </div>

                  {q.answer && (
                    <p className="text-xs text-success">
                      ✓ Correct answer: <span className="font-medium">{q.answer}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t border-border gap-2">
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
            className="bg-gold text-navy-deep hover:bg-gold-light font-semibold"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-navy-deep/30 border-t-navy-deep rounded-full animate-spin" />
                Saving…
              </span>
            ) : (
              isEditing ? 'Update Test' : 'Add Test'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
