import { useState } from 'react';
import { Plus, Trash2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGetTopRankers, useDeleteRanker } from '../hooks/useQueries';
import { getSessionToken } from '../hooks/useAuth';
import RankerFormModal from '../components/RankerFormModal';
import { toast } from 'sonner';

export default function AdminRankers() {
  const { data: rankers, isLoading } = useGetTopRankers();
  const deleteRanker = useDeleteRanker();
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async (rank: bigint) => {
    const token = getSessionToken();
    if (!token) return;
    if (!confirm(`Are you sure you want to remove ranker at rank #${rank}?`)) return;
    try {
      await deleteRanker.mutateAsync({ token, rank });
      toast.success('Ranker removed successfully');
    } catch {
      toast.error('Failed to remove ranker');
    }
  };

  const getRankStyle = (rank: bigint) => {
    const r = Number(rank);
    if (r === 1) return 'text-yellow-400 font-bold';
    if (r === 2) return 'text-slate-300 font-bold';
    if (r === 3) return 'text-amber-600 font-bold';
    return 'text-muted-foreground';
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Trophy size={22} className="text-gold" />
            Rankers Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage the leaderboard rankings
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-gold text-navy-deep hover:bg-gold-light font-semibold gap-2"
        >
          <Plus size={16} />
          Add Ranker
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-navy">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-semibold w-20">Rank</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Student Name</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Category</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-center">Score</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-10 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : rankers && rankers.length > 0 ? (
              rankers.map((ranker) => (
                <TableRow key={ranker.rank.toString()} className="border-border hover:bg-navy-light/50">
                  <TableCell className={`font-mono text-sm ${getRankStyle(ranker.rank)}`}>
                    #{ranker.rank.toString()}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{ranker.studentName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-sky/40 text-sky text-xs">
                      {ranker.examCategory}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-semibold text-gold">{ranker.score.toString()}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(ranker.rank)}
                      disabled={deleteRanker.isPending}
                      className="h-8 w-8 p-0 hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  <Trophy size={32} className="mx-auto mb-3 opacity-30" />
                  <p>No rankers found. Add your first ranker!</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <RankerFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
