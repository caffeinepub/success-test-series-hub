import { useState } from 'react';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGetTests, useDeleteTest } from '../hooks/useQueries';
import { getSessionToken } from '../hooks/useAuth';
import TestFormModal from '../components/TestFormModal';
import type { Test } from '../backend';
import { toast } from 'sonner';

export default function AdminTests() {
  const { data: tests, isLoading } = useGetTests();
  const deleteTest = useDeleteTest();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);

  const handleDelete = async (id: bigint) => {
    const token = getSessionToken();
    if (!token) return;
    if (!confirm('Are you sure you want to delete this test?')) return;
    try {
      await deleteTest.mutateAsync({ token, id });
      toast.success('Test deleted successfully');
    } catch {
      toast.error('Failed to delete test');
    }
  };

  const handleEdit = (test: Test) => {
    setEditingTest(test);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTest(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingTest(null);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText size={22} className="text-gold" />
            Tests Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, edit, and manage exam tests
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-gold text-navy-deep hover:bg-gold-light font-semibold gap-2"
        >
          <Plus size={16} />
          Add Test
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-navy">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-semibold w-16">ID</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Title</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Category</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-center">Questions</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : tests && tests.length > 0 ? (
              tests.map((test) => (
                <TableRow key={test.id.toString()} className="border-border hover:bg-navy-light/50">
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    #{test.id.toString()}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{test.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-gold/40 text-gold text-xs">
                      {test.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground text-sm">
                    {test.questions.length}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(test)}
                        className="h-8 w-8 p-0 hover:text-gold hover:bg-gold/10"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(test.id)}
                        disabled={deleteTest.isPending}
                        className="h-8 w-8 p-0 hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  <FileText size={32} className="mx-auto mb-3 opacity-30" />
                  <p>No tests found. Add your first test!</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TestFormModal
        open={modalOpen}
        onClose={handleModalClose}
        editingTest={editingTest}
      />
    </div>
  );
}
