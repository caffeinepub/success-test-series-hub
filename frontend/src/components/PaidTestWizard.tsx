import { useState, useEffect } from 'react';
import {
  X, ChevronRight, ChevronLeft, Check, IndianRupee,
  FileText, HelpCircle, Settings, Eye, Loader2, Pencil,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAddTest, useUpdateTest } from '@/hooks/useQueries';
import { getSessionToken } from '@/hooks/useAuth';
import type { Test, Question } from '@/backend';
import { ExamCategory } from '@/backend';
import { EXAM_CATEGORY_OPTIONS, getExamCategoryLabel } from '@/utils/examCategories';
import { toast } from 'sonner';
import QuestionManager, { QuestionForm, makeEmptyQuestion } from './QuestionManager';

// ── Types ────────────────────────────────────────────────────────────────────

interface WizardFormData {
  title: string;
  category: ExamCategory;
  price: number;
  description: string;
  questions: QuestionForm[];
  negativeMarking: boolean;
  negativeMarkValue: number;
}

interface PaidTestWizardProps {
  onClose: () => void;
  editMode?: boolean;
  initialTestData?: Test | null;
  testId?: bigint;
}

// ── Step Config ──────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Basic Info', icon: FileText, description: 'Title, category & price' },
  { id: 2, label: 'Questions', icon: HelpCircle, description: 'Add test questions' },
  { id: 3, label: 'Settings', icon: Settings, description: 'Marking scheme' },
  { id: 4, label: 'Review', icon: Eye, description: 'Review & publish' },
];

// ── Helper ───────────────────────────────────────────────────────────────────

function findAnswerIndex(options: string[], answer: string): number {
  const idx = options.findIndex((o) => o === answer);
  return idx >= 0 ? idx : -1;
}

function mapTestToFormData(test: Test): WizardFormData {
  return {
    title: test.title,
    category: test.category as ExamCategory,
    price: Number(test.price),
    description: '',
    questions:
      test.questions.length > 0
        ? test.questions.map((q) => {
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
        : [makeEmptyQuestion()],
    negativeMarking: test.negativeMarkValue > 0,
    negativeMarkValue: test.negativeMarkValue > 0 ? test.negativeMarkValue : 0.33,
  };
}

const defaultFormData: WizardFormData = {
  title: '',
  category: ExamCategory.upsc,
  price: 99,
  description: '',
  questions: [makeEmptyQuestion()],
  negativeMarking: false,
  negativeMarkValue: 0.33,
};

// ── Main Component ───────────────────────────────────────────────────────────

export default function PaidTestWizard({
  onClose,
  editMode = false,
  initialTestData,
  testId,
}: PaidTestWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>(defaultFormData);
  const [stepErrors, setStepErrors] = useState<string[]>([]);

  const { mutateAsync: addTest, isPending: isAdding } = useAddTest();
  const { mutateAsync: updateTest, isPending: isUpdating } = useUpdateTest();
  const isPending = isAdding || isUpdating;

  // Pre-populate in edit mode
  useEffect(() => {
    if (editMode && initialTestData) {
      setFormData(mapTestToFormData(initialTestData));
    } else if (!editMode) {
      setFormData(defaultFormData);
    }
    setCurrentStep(1);
    setStepErrors([]);
  }, [editMode, initialTestData]);

  // ── Validation ─────────────────────────────────────────────────────────────

  const validateStep = (step: number): string[] => {
    const errs: string[] = [];
    if (step === 1) {
      if (!formData.title.trim()) errs.push('Test title is required.');
      if (!formData.category) errs.push('Exam category is required.');
      if (formData.price < 1) errs.push('Price must be at least ₹1 for paid tests.');
    }
    if (step === 2) {
      if (formData.questions.length === 0) {
        errs.push('At least one question is required.');
      }
      formData.questions.forEach((q, qi) => {
        if (!q.question.trim()) errs.push(`Q${qi + 1}: Question text is required.`);
        const filled = q.options.filter((o) => o.trim());
        if (filled.length < 2) errs.push(`Q${qi + 1}: At least 2 options are required.`);
        if (q.answerIndex < 0) errs.push(`Q${qi + 1}: Please select the correct answer.`);
        else if (!q.options[q.answerIndex]?.trim())
          errs.push(`Q${qi + 1}: The selected correct answer option is empty.`);
      });
    }
    return errs;
  };

  const handleNext = () => {
    const errs = validateStep(currentStep);
    if (errs.length > 0) {
      setStepErrors(errs);
      return;
    }
    setStepErrors([]);
    setCurrentStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => {
    setStepErrors([]);
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const goToStep = (step: number) => {
    setStepErrors([]);
    setCurrentStep(step);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    const token = getSessionToken();
    if (!token) {
      toast.error('Session expired. Please log in again.');
      return;
    }

    const questionPayload: Question[] = formData.questions.map((q) => ({
      question: q.question.trim(),
      options: q.options,
      answer: q.options[q.answerIndex] ?? '',
      explanation: q.explanation.trim() || undefined,
      questionHi: q.questionHi.trim() || undefined,
      optionsHi: q.optionsHi.some((o) => o.trim()) ? q.optionsHi : undefined,
      explanationHi: q.explanationHi.trim() || undefined,
    }));

    const negVal = formData.negativeMarking ? formData.negativeMarkValue : 0;

    try {
      if (editMode && testId !== undefined) {
        await updateTest({
          token,
          id: testId,
          title: formData.title.trim(),
          category: formData.category,
          questions: questionPayload,
          price: BigInt(formData.price),
          negativeMarkValue: negVal,
        });
        toast.success('Test updated successfully!');
      } else {
        await addTest({
          token,
          title: formData.title.trim(),
          category: formData.category,
          questions: questionPayload,
          price: BigInt(formData.price),
          negativeMarkValue: negVal,
        });
        toast.success(`Test published with ${questionPayload.length} question(s)!`);
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Failed to save test: ${msg}`);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-navy-mid border border-border rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div>
            <h2 className="font-heading text-xl font-bold text-gold">
              {editMode ? 'Edit Paid Test' : 'Create New Paid Test'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-0">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isClickable = step.id < currentStep;

              return (
                <div key={step.id} className="flex items-center flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => isClickable && goToStep(step.id)}
                    disabled={!isClickable}
                    className={`flex flex-col items-center gap-1 flex-shrink-0 transition-all ${
                      isClickable ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted
                          ? 'bg-success border-success text-navy-deep'
                          : isActive
                          ? 'bg-gold border-gold text-navy-deep'
                          : 'bg-transparent border-border text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-semibold hidden sm:block ${
                        isActive
                          ? 'text-gold'
                          : isCompleted
                          ? 'text-success'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>

                  {/* Connector line */}
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 rounded transition-all ${
                        currentStep > step.id ? 'bg-success' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-6 py-5">
            {/* Validation Errors */}
            {stepErrors.length > 0 && (
              <div className="mb-4 bg-destructive/10 border border-destructive/40 rounded-lg p-3 space-y-1">
                {stepErrors.map((err, i) => (
                  <p key={i} className="text-destructive text-sm flex items-start gap-1.5">
                    <span className="mt-0.5 shrink-0">⚠</span>
                    {err}
                  </p>
                ))}
              </div>
            )}

            {/* ── Step 1: Basic Info ── */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <Label className="text-foreground font-semibold mb-1.5 block">
                    Test Title *
                  </Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. UPSC Prelims Mock Test 2025"
                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-gold"
                  />
                </div>

                <div>
                  <Label className="text-foreground font-semibold mb-1.5 block">
                    Exam Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(val) =>
                      setFormData({ ...formData, category: val as ExamCategory })
                    }
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
                    Which competitive exam is this test for?
                  </p>
                </div>

                <div>
                  <Label className="text-foreground font-semibold mb-1.5 flex items-center gap-1">
                    <IndianRupee className="h-3.5 w-3.5 text-gold" />
                    Price (₹) *
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    value={formData.price}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setFormData({ ...formData, price: isNaN(val) || val < 0 ? 0 : val });
                    }}
                    placeholder="e.g. 99"
                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-gold"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum ₹1 for paid tests. Students will pay this amount to access the test.
                  </p>
                </div>

                <div>
                  <Label className="text-foreground font-semibold mb-1.5 block">
                    Description (optional)
                  </Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of what this test covers..."
                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-gold resize-none"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* ── Step 2: Questions ── */}
            {currentStep === 2 && (
              <QuestionManager
                questions={formData.questions}
                onQuestionsChange={(qs) => setFormData({ ...formData, questions: qs })}
              />
            )}

            {/* ── Step 3: Settings ── */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                    Marking Scheme
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Configure how marks are awarded and deducted.
                  </p>
                </div>

                {/* Negative Marking Toggle */}
                <div className="bg-muted border border-border rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">Negative Marking</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Deduct marks for wrong answers
                      </p>
                    </div>
                    <Switch
                      checked={formData.negativeMarking}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, negativeMarking: checked })
                      }
                    />
                  </div>

                  {formData.negativeMarking && (
                    <div className="pt-2 border-t border-border">
                      <Label className="text-foreground font-semibold mb-1.5 block">
                        Marks Deducted per Wrong Answer
                      </Label>
                      <Input
                        type="number"
                        step={0.01}
                        min={0.01}
                        value={formData.negativeMarkValue}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setFormData({
                            ...formData,
                            negativeMarkValue: isNaN(val) ? 0.33 : val,
                          });
                        }}
                        placeholder="e.g. 0.33"
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-gold max-w-xs"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Common values: 0.25 (1/4), 0.33 (1/3), 0.5 (1/2), 1 (full mark)
                      </p>
                    </div>
                  )}
                </div>

                {/* Summary Card */}
                <div className="bg-accent/20 border border-border rounded-xl p-4">
                  <p className="text-sm font-semibold text-foreground mb-2">Marking Summary</p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Correct Answer</span>
                      <span className="text-success font-semibold">+1 mark</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wrong Answer</span>
                      <span className={formData.negativeMarking ? 'text-destructive font-semibold' : 'text-muted-foreground'}>
                        {formData.negativeMarking
                          ? `-${formData.negativeMarkValue} mark${formData.negativeMarkValue !== 1 ? 's' : ''}`
                          : 'No penalty'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Unattempted</span>
                      <span className="text-muted-foreground">0 marks</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 4: Review & Publish ── */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                    Review Your Test
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Check all details before {editMode ? 'saving changes' : 'publishing'}.
                  </p>
                </div>

                {/* Basic Info Review */}
                <div className="bg-muted border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-accent/30 border-b border-border">
                    <span className="text-xs font-bold text-gold uppercase tracking-widest">
                      Basic Info
                    </span>
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-gold transition-colors"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </button>
                  </div>
                  <div className="p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title</span>
                      <span className="text-foreground font-medium">{formData.title || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="text-foreground font-medium">
                        {getExamCategoryLabel(formData.category)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="text-gold font-semibold flex items-center gap-0.5">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {formData.price}
                      </span>
                    </div>
                    {formData.description && (
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground flex-shrink-0">Description</span>
                        <span className="text-foreground text-right">{formData.description}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Questions Review */}
                <div className="bg-muted border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-accent/30 border-b border-border">
                    <span className="text-xs font-bold text-gold uppercase tracking-widest">
                      Questions ({formData.questions.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-gold transition-colors"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </button>
                  </div>
                  <div className="p-4 space-y-2">
                    {formData.questions.map((q, qi) => (
                      <div key={qi} className="flex items-start gap-2 text-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center mt-0.5">
                          {qi + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground truncate">
                            {q.question || <span className="text-muted-foreground italic">Empty question</span>}
                          </p>
                          {q.answerIndex >= 0 && q.options[q.answerIndex]?.trim() && (
                            <p className="text-xs text-success mt-0.5">
                              ✓ {q.options[q.answerIndex]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Settings Review */}
                <div className="bg-muted border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-accent/30 border-b border-border">
                    <span className="text-xs font-bold text-gold uppercase tracking-widest">
                      Settings
                    </span>
                    <button
                      type="button"
                      onClick={() => goToStep(3)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-gold transition-colors"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </button>
                  </div>
                  <div className="p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Negative Marking</span>
                      <span className={formData.negativeMarking ? 'text-destructive font-semibold' : 'text-muted-foreground'}>
                        {formData.negativeMarking
                          ? `Yes (−${formData.negativeMarkValue} per wrong)`
                          : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border flex-shrink-0 bg-navy-mid">
          <Button
            type="button"
            variant="ghost"
            onClick={currentStep === 1 ? onClose : handleBack}
            className="text-muted-foreground hover:text-foreground gap-1.5"
            disabled={isPending}
          >
            <ChevronLeft className="h-4 w-4" />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>

          <div className="flex items-center gap-2">
            {/* Step dots */}
            <div className="flex gap-1.5 mr-3">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    s.id === currentStep
                      ? 'bg-gold w-4'
                      : s.id < currentStep
                      ? 'bg-success'
                      : 'bg-border'
                  }`}
                />
              ))}
            </div>

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-gold hover:bg-gold-light text-navy-deep font-semibold gap-1.5"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-success hover:opacity-90 text-navy-deep font-semibold gap-1.5 min-w-[140px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {editMode ? 'Saving...' : 'Publishing...'}
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    {editMode ? 'Save Changes' : 'Publish Test'}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
