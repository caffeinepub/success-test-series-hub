import { useState } from 'react';
import { Sparkles, ChevronDown, CheckCircle2, Loader2 } from 'lucide-react';
import { useGenerateQuestions } from '../hooks/useQueries';
import type { Question } from '../backend';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AITestGenerator() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const { mutate: generate, isPending, data: questions, error } = useGenerateQuestions();

  const handleGenerate = () => {
    if (!topic.trim()) return;
    generate({ topic: topic.trim(), difficulty });
  };

  return (
    <section id="ai" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-4xl font-bold text-foreground mb-2">
            AI-Powered <span className="text-gold">Test Generator</span>
          </h2>
          <p className="text-muted-foreground">Enter any topic and get instant practice questions</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card-navy p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Topic or Passage
              </label>
              <Textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic (e.g., Indian Constitution, Mughal Empire, Railway Budget 2025...)"
                rows={4}
                className="bg-navy-deep border-border text-foreground placeholder:text-muted-foreground resize-none focus:border-gold/60 focus:ring-gold/20"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Difficulty Level
              </label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="bg-navy-deep border-border text-foreground focus:border-gold/60 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground">
                  <SelectItem value="easy" className="hover:bg-navy-light focus:bg-navy-light">Easy</SelectItem>
                  <SelectItem value="medium" className="hover:bg-navy-light focus:bg-navy-light">Medium</SelectItem>
                  <SelectItem value="hard" className="hover:bg-navy-light focus:bg-navy-light">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isPending || !topic.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-success text-success-foreground font-bold py-3 rounded-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Questions
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
              Failed to generate questions. Please try again.
            </div>
          )}

          {questions && questions.length > 0 && (
            <div className="mt-6 space-y-4 animate-fade-in">
              <h3 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <Sparkles size={18} className="text-gold" />
                Generated Questions
              </h3>
              {questions.map((q: Question, i: number) => (
                <div key={i} className="card-navy p-5 border-gold/20">
                  <p className="font-medium text-foreground mb-4">
                    <span className="text-gold font-bold">Q{i + 1}.</span> {q.question}
                  </p>
                  <div className="space-y-2 mb-4">
                    {q.options.map((opt) => (
                      <div
                        key={opt}
                        className={`text-sm px-3 py-2 rounded-md border ${
                          opt === q.answer
                            ? 'bg-gold/15 text-gold border-gold/40 font-semibold'
                            : 'text-muted-foreground border-border'
                        }`}
                      >
                        {opt === q.answer && (
                          <CheckCircle2 size={13} className="inline mr-1.5 text-gold" />
                        )}
                        {opt}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gold bg-gold/10 border border-gold/20 rounded-md px-3 py-1.5 w-fit">
                    <CheckCircle2 size={12} />
                    <span>Correct Answer: <strong>{q.answer}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
