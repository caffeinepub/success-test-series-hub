import React, { useState } from 'react';
import { useGetNewspapers, useDeleteNewspaper } from '../hooks/useQueries';
import { getSessionToken } from '../hooks/useAuth';
import NewspaperFormModal from '../components/NewspaperFormModal';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Trash2, BookOpen, ExternalLink } from 'lucide-react';

export default function AdminNewspapers() {
  const token = getSessionToken() || '';
  const { data: entries = [], isLoading } = useGetNewspapers();
  const deleteEntry = useDeleteNewspaper();
  const [showModal, setShowModal] = useState(false);

  const sorted = [...entries].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = async (id: bigint) => {
    if (!confirm('Delete this newspaper entry?')) return;
    try {
      await deleteEntry.mutateAsync({ token, id });
    } catch (err: any) {
      alert(err?.message || 'Failed to delete entry.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-rajdhani">Manage Daily Newspaper</h1>
          <p className="text-navy-400 text-sm mt-1">Add and manage daily newspaper links</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-navy-400 py-8">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading entries...
        </div>
      ) : sorted.length === 0 ? (
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-12 text-center">
          <BookOpen className="w-12 h-12 text-navy-500 mx-auto mb-3" />
          <p className="text-navy-400">No newspaper entries yet.</p>
        </div>
      ) : (
        <div className="bg-navy-800 border border-navy-600 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-600">
                <th className="text-left px-4 py-3 text-navy-300 text-sm font-medium">Date</th>
                <th className="text-left px-4 py-3 text-navy-300 text-sm font-medium">Link</th>
                <th className="px-4 py-3 text-navy-300 text-sm font-medium w-16">Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry) => (
                <tr key={entry.id.toString()} className="border-b border-navy-700 last:border-0 hover:bg-navy-700/30">
                  <td className="px-4 py-3 text-gold-400 text-sm font-medium whitespace-nowrap">{entry.date}</td>
                  <td className="px-4 py-3 text-sm">
                    <a
                      href={entry.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:text-sky-300 flex items-center gap-1 max-w-xs truncate"
                    >
                      <span className="truncate">{entry.link}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(entry.id)}
                      disabled={deleteEntry.isPending}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      {deleteEntry.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <NewspaperFormModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
