import React, { useState } from 'react';
import { useAddSlider } from '../hooks/useQueries';
import { getSessionToken } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface SliderFormModalProps {
  onClose: () => void;
}

export default function SliderFormModal({ onClose }: SliderFormModalProps) {
  const token = getSessionToken() || '';
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const addSlider = useAddSlider();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!imageUrl.trim()) {
      setError('Image URL is required.');
      return;
    }
    try {
      await addSlider.mutateAsync({
        token,
        imageUrl: imageUrl.trim(),
        title: title.trim() || null,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to add slider.');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-navy-800 border-navy-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white font-rajdhani">Add New Slider</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-navy-200">Image URL <span className="text-red-400">*</span></Label>
            <Input
              type="url"
              placeholder="https://example.com/poster.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="bg-navy-700 border-navy-500 text-white placeholder:text-navy-400 focus:border-gold-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-navy-200">Title (optional)</Label>
            <Input
              type="text"
              placeholder="Poster title or caption"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-navy-700 border-navy-500 text-white placeholder:text-navy-400 focus:border-gold-500"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded px-3 py-2">
              {error}
            </p>
          )}
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-navy-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addSlider.isPending}
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold"
            >
              {addSlider.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Slider'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
