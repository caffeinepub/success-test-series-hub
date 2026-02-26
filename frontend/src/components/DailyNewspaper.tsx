import React from 'react';
import { useGetNewspapers } from '../hooks/useQueries';
import { BookOpen, Calendar, ExternalLink, Loader2 } from 'lucide-react';

export default function DailyNewspaper() {
  const { data: entries = [], isLoading } = useGetNewspapers();

  // Sort by date descending
  const sorted = [...entries].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="bg-navy-800 border border-navy-600 rounded-2xl p-6 h-full">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-gold-400" />
        </div>
        <h3 className="text-lg font-bold text-white font-rajdhani">Daily Newspaper</h3>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-navy-400 py-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-8">
          <BookOpen className="w-10 h-10 text-navy-600 mx-auto mb-2" />
          <p className="text-navy-400 text-sm">No newspaper entries yet.</p>
          <p className="text-navy-500 text-xs mt-1">Check back soon!</p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {sorted.map((entry) => (
            <li
              key={entry.id.toString()}
              className="flex items-center justify-between gap-3 border border-navy-600 rounded-lg px-3 py-2.5 hover:border-gold-500/40 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Calendar className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span className="text-navy-200 text-sm truncate">{entry.date}</span>
              </div>
              <a
                href={entry.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sky-400 hover:text-sky-300 text-xs font-medium shrink-0 transition-colors"
              >
                Read
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
