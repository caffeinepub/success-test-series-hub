import React from 'react';
import { useGetCurrentAffairs } from '../hooks/useQueries';
import { Newspaper, Calendar, Loader2 } from 'lucide-react';

export default function DailyCurrentAffairs() {
  const { data: entries = [], isLoading } = useGetCurrentAffairs();

  // Sort by date descending
  const sorted = [...entries].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="bg-navy-800 border border-navy-600 rounded-2xl p-6 h-full">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
          <Newspaper className="w-4 h-4 text-sky-400" />
        </div>
        <h3 className="text-lg font-bold text-white font-rajdhani">Daily Current Affairs</h3>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-navy-400 py-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-8">
          <Newspaper className="w-10 h-10 text-navy-600 mx-auto mb-2" />
          <p className="text-navy-400 text-sm">No current affairs entries yet.</p>
          <p className="text-navy-500 text-xs mt-1">Check back soon!</p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {sorted.map((entry) => (
            <li
              key={entry.id.toString()}
              className="border-l-2 border-sky-500/50 pl-3 py-1"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="w-3 h-3 text-sky-400" />
                <span className="text-xs text-sky-400 font-medium">{entry.date}</span>
              </div>
              <p className="text-navy-200 text-sm leading-relaxed">{entry.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
