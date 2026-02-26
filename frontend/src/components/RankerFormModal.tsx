import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useAddRanker } from '../hooks/useQueries';
import { getSessionToken } from '../hooks/useAuth';
import { toast } from 'sonner';

const CATEGORIES = ['UPSC', 'BPSC', 'SSC', 'Railway', 'State Exams'];

interface RankerFormModalProps {
  open: boolean;
  onClose: () => void;
}

export default function RankerFormModal({ open, onClose }: RankerFormModalProps) {
  const [studentName, setStudentName] = useState('');
  const [examCategory, setExamCategory] = useState('');
  const [score, setScore] = useState('');

  const addRanker = useAddRanker();

  const handleClose = () => {
    setStudentName('');
    setExamCategory('');
    setScore('');
    onClose();
  };

  const handleSave = async () => {
    if (!studentName.trim()) { toast.error('Student name is required.'); return; }
    if (!examCategory) { toast.error('Exam category is required.'); return; }
    const scoreNum = parseInt(score, 10);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      toast.error('Score must be a number between 0 and 100.');
      return;
    }

    const token = getSessionToken();
    if (!token) { toast.error('Session expired. Please log in again.'); return; }

    try {
      await addRanker.mutateAsync({
        token,
        studentName: studentName.trim(),
        examCategory,
        score: BigInt(scoreNum),
      });
      toast.success('Ranker added successfully');
      handleClose();
    } catch {
      toast.error('Failed to add ranker. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-foreground">
            Add New Ranker
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label className="text-foreground/90 font-medium">Student Name</Label>
            <Input
              placeholder="e.g. Priya Sharma"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="bg-input border-border focus:border-gold"
              disabled={addRanker.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground/90 font-medium">Exam Category</Label>
            <Select value={examCategory} onValueChange={setExamCategory} disabled={addRanker.isPending}>
              <SelectTrigger className="bg-input border-border focus:border-gold">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="hover:bg-navy-light">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground/90 font-medium">Score (0–100)</Label>
            <Input
              type="number"
              placeholder="e.g. 92"
              min={0}
              max={100}
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="bg-input border-border focus:border-gold"
              disabled={addRanker.isPending}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={addRanker.isPending}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={addRanker.isPending}
            className="bg-gold text-navy-deep hover:bg-gold-light font-semibold"
          >
            {addRanker.isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-navy-deep/30 border-t-navy-deep rounded-full animate-spin" />
                Adding…
              </span>
            ) : (
              'Add Ranker'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
