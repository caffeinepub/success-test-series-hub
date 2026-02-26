import React, { useState } from 'react';
import { useAddCurrentAffairs } from '../hooks/useQueries';
import { getSessionToken } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface CurrentAffairsFormModalProps {
  onClose: () => void;
}

export default function CurrentAffairsFormModal({ onClose }: CurrentAffairsFormModalProps) {
  const token = getSessionToken() || '';
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const addEntry = useAddCurrentAffairs();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!date.trim() || !content.trim()) {
      setError('Date and content are required.');
      return;
    }
    try {
      await addEntry.mutateAsync({ token, date: date.trim(), content: content.trim() });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to add entry.');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-navy-800 border-navy-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white font-rajdhani">Add Current Affairs Entry</DialogTitle>
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
            <Label className="text-navy-200">Content <span className="text-red-400">*</span></Label>
            <Textarea
              placeholder="Enter current affairs content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-navy-700 border-navy-500 text-white placeholder:text-navy-400 focus:border-gold-500 min-h-[100px]"
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
