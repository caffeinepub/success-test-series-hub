import { Trophy, Medal, Crown } from 'lucide-react';
import { useGetTopRankers } from '@/hooks/useQueries';
import { useTranslation } from '@/hooks/useTranslation';

export default function TopRankers() {
  const { data: rankers, isLoading, isError } = useGetTopRankers();
  const { t } = useTranslation();

  const getRankColor = (rank: number): string => {
    if (rank === 1) return 'oklch(0.80 0.17 82)';
    if (rank === 2) return 'oklch(0.75 0.04 255)';
    if (rank === 3) return 'oklch(0.68 0.22 30)';
    return 'oklch(0.55 0.05 255)';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4" style={{ color: 'oklch(0.80 0.17 82)' }} />;
    if (rank <= 3) return <Trophy className="h-4 w-4" style={{ color: getRankColor(rank) }} />;
    return <Medal className="h-4 w-4" style={{ color: 'oklch(0.35 0.05 265)' }} />;
  };

  const getRowStyle = (rank: number) => {
    if (rank === 1) return { background: 'oklch(0.80 0.17 82 / 0.08)', borderLeft: '3px solid oklch(0.80 0.17 82)' };
    if (rank === 2) return { background: 'oklch(0.75 0.04 255 / 0.05)', borderLeft: '3px solid oklch(0.75 0.04 255 / 0.5)' };
    if (rank === 3) return { background: 'oklch(0.68 0.22 30 / 0.06)', borderLeft: '3px solid oklch(0.68 0.22 30 / 0.5)' };
    return {};
  };

  return (
    <section id="top-rankers" className="py-16" style={{ background: 'oklch(0.11 0.055 265)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Trophy className="h-7 w-7 text-gold" />
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-gold">
              {t('topRankersTitle')}
            </h2>
            <Trophy className="h-7 w-7 text-gold" />
          </div>
          <div className="w-20 h-1 bg-gold mx-auto rounded-full" />
        </div>

        {isLoading && (
          <div className="text-center py-12" style={{ color: 'oklch(0.55 0.05 255)' }}>{t('loadingRankers')}</div>
        )}
        {isError && (
          <div className="text-center text-destructive py-12">{t('errorLoadingRankers')}</div>
        )}

        {!isLoading && !isError && (
          <>
            {!rankers || rankers.length === 0 ? (
              <div className="text-center py-12" style={{ color: 'oklch(0.55 0.05 255)' }}>{t('noRankersYet')}</div>
            ) : (
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid oklch(0.26 0.07 265)' }}>
                <table className="w-full max-w-3xl mx-auto">
                  <thead>
                    <tr style={{ borderBottom: '1px solid oklch(0.26 0.07 265)', background: 'oklch(0.14 0.06 265)' }}>
                      <th className="text-left py-3 px-4 font-heading font-semibold text-sm tracking-wide text-gold">{t('rankCol')}</th>
                      <th className="text-left py-3 px-4 font-heading font-semibold text-sm tracking-wide text-gold">{t('nameCol')}</th>
                      <th className="text-left py-3 px-4 font-heading font-semibold text-sm tracking-wide text-gold">{t('examCategoryCol')}</th>
                      <th className="text-right py-3 px-4 font-heading font-semibold text-sm tracking-wide text-gold">{t('scoreCol')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankers.map((ranker) => {
                      const rank = Number(ranker.rank);
                      return (
                        <tr
                          key={rank}
                          className="transition-colors"
                          style={{
                            borderBottom: '1px solid oklch(0.22 0.06 265)',
                            ...getRowStyle(rank),
                          }}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {getRankIcon(rank)}
                              <span className="font-heading font-bold" style={{ color: getRankColor(rank) }}>#{rank}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium" style={{ color: 'oklch(0.96 0.01 255)' }}>{ranker.studentName}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{
                              background: 'oklch(0.65 0.22 238 / 0.15)',
                              color: 'oklch(0.65 0.22 238)',
                              border: '1px solid oklch(0.65 0.22 238 / 0.3)'
                            }}>
                              {ranker.examCategory}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-heading font-bold text-gold">{Number(ranker.score)}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
