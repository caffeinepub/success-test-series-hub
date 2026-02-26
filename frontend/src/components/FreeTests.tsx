import { useState } from 'react';
import { BookOpen, Tag, Loader2 } from 'lucide-react';
import { useGetTests } from '../hooks/useQueries';
import type { Test } from '../backend';
import TestTakingModal from './TestTakingModal';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface FreeTestsProps {
  categoryFilter: string;
}

const categoryColors: Record<string, string> = {
  UPSC: 'bg-sky/20 text-sky border-sky/30',
  BPSC: 'bg-gold/20 text-gold border-gold/30',
  SSC: 'bg-success/20 text-success border-success/30',
  Railway: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'State Exams': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
};

export default function FreeTests({ categoryFilter }: FreeTestsProps) {
  const { data: tests, isLoading, error } = useGetTests();
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  const filteredTests = tests
    ? categoryFilter === 'All'
      ? tests
      : tests.filter((t) => t.category === categoryFilter)
    : [];

  return (
    <section id="free-tests" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-4xl font-bold text-foreground mb-2">
            Free <span className="text-gold">Test Series</span>
          </h2>
          <p className="text-muted-foreground">
            {categoryFilter !== 'All' ? `Showing tests for ${categoryFilter}` : 'All available free tests'}
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-navy p-5">
                <Skeleton className="h-5 w-3/4 mb-3 bg-navy-light" />
                <Skeleton className="h-4 w-1/3 mb-4 bg-navy-light" />
                <Skeleton className="h-9 w-28 bg-navy-light" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-destructive">
            Failed to load tests. Please try again.
          </div>
        )}

        {!isLoading && !error && filteredTests.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No tests found for this category.</p>
          </div>
        )}

        {!isLoading && !error && filteredTests.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTests.map((test) => (
              <div
                key={test.id.toString()}
                className="card-navy p-5 flex flex-col gap-4 hover:border-gold/40 transition-all duration-200 hover:shadow-gold"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading font-bold text-lg text-foreground leading-tight flex-1">
                    {test.title}
                  </h3>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${
                    categoryColors[test.category] || 'bg-muted text-muted-foreground border-border'
                  }`}>
                    {test.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag size={14} />
                  <span>{test.questions.length} Questions</span>
                </div>
                <button
                  onClick={() => setSelectedTest(test)}
                  className="mt-auto inline-flex items-center gap-2 bg-success text-success-foreground font-semibold text-sm px-5 py-2.5 rounded-md hover:opacity-90 active:scale-95 transition-all w-fit"
                >
                  <BookOpen size={15} />
                  Attempt
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
