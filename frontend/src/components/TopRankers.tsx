import { Trophy, Medal, Award, Loader2 } from 'lucide-react';
import { useGetTopRankers } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

const rankStyles: Record<number, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  1: {
    bg: 'bg-gold/10',
    border: 'border-gold/60',
    text: 'text-gold',
    icon: <Trophy size={18} className="text-gold" />,
  },
  2: {
    bg: 'bg-slate-400/10',
    border: 'border-slate-400/40',
    text: 'text-slate-300',
    icon: <Medal size={18} className="text-slate-300" />,
  },
  3: {
    bg: 'bg-orange-700/10',
    border: 'border-orange-600/40',
    text: 'text-orange-400',
    icon: <Award size={18} className="text-orange-400" />,
  },
};

export default function TopRankers() {
  const { data: rankers, isLoading, error } = useGetTopRankers();

  return (
    <section id="top-rankers" className="py-16 bg-navy-mid">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold text-foreground mb-2">
            Top <span className="text-gold">Rankers</span>
          </h2>
          <p className="text-muted-foreground">Our highest-scoring students across all exam categories</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full bg-navy-light rounded-xl" />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-10 text-destructive">
              Failed to load rankers. Please try again.
            </div>
          )}

          {!isLoading && !error && rankers && (
            <div className="space-y-3">
              {rankers.map((ranker) => {
                const rank = Number(ranker.rank);
                const style = rankStyles[rank] || {
                  bg: 'bg-card',
                  border: 'border-border',
                  text: 'text-muted-foreground',
                  icon: <span className="text-muted-foreground font-bold text-sm">#{rank}</span>,
                };

                return (
                  <div
                    key={ranker.rank.toString()}
                    className={`flex items-center gap-4 p-4 rounded-xl border ${style.bg} ${style.border} transition-all hover:shadow-navy`}
                  >
                    {/* Rank */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      rank <= 3 ? style.bg + ' border ' + style.border : 'bg-navy-light'
                    }`}>
                      {rank <= 3 ? style.icon : (
                        <span className="text-muted-foreground font-bold text-sm">#{rank}</span>
                      )}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <div className={`font-heading font-bold text-base ${rank <= 3 ? style.text : 'text-foreground'}`}>
                        {ranker.studentName}
                      </div>
                      <div className="text-xs text-muted-foreground">{ranker.examCategory}</div>
                    </div>

                    {/* Score */}
                    <div className="text-right shrink-0">
                      <div className={`font-heading font-bold text-xl ${rank <= 3 ? style.text : 'text-foreground'}`}>
                        {ranker.score.toString()}
                      </div>
                      <div className="text-xs text-muted-foreground">score</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
