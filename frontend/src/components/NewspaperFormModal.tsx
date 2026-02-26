import React, { useState } from 'react';
import { useAddNewspaper } from '../hooks/useQueries';
import { getSessionToken } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface NewspaperFormModalProps {
  onClose: () => void;
}

export default function NewspaperFormModal({ onClose }: NewspaperFormModalProps) {
  const token = getSessionToken() || '';
  const [date, setDate] = useState('');
  const [link, setLink] = useState('');
  const [error, setError] = useState('');

  const addEntry = useAddNewspaper();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!date.trim() || !link.trim()) {
      setError('Date and link are required.');
      return;
    }
    try {
      await addEntry.mutateAsync({ token, date: date.trim(), link: link.trim() });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to add entry.');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-navy-800 border-navy-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white font-rajdhani">Add Newspaper Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-navy-200">Date <span className="text-red-400">*</span></Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-navy-700 border-navy-500 text-white focus:border-gold-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-navy-200">Newspaper Link <span className="text-red-400">*</span></Label>
            <Input
              type="url"
              placeholder="https://example.com/newspaper.pdf"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="bg-navy-700 border-navy-500 text-white placeholder:text-navy-400 focus:border-gold-500"
              required
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded px-3 py-2">
              {error}
            </p>
          )}
          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={onClose} className="text-navy-300 hover:text-white">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addEntry.isPending}
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold"
            >
              {addEntry.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Entry'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
