import { useState } from 'react';
import { Plus, Pencil, Trash2, FileText, IndianRupee } from 'lucide-react';
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
              <TableHead className="text-muted-foreground font-semibold text-center">Price</TableHead>
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
                  <TableCell><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : tests && tests.length > 0 ? (
              tests.map((test) => (
                <TableRow key={test.id.toString()} className="border-border hover:bg-accent/20 transition-colors">
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    #{test.id.toString()}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{test.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-sky text-sky text-xs">
                      {test.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {Number(test.price) === 0 ? (
                      <Badge variant="outline" className="border-success text-success text-xs">
                        Free
                      </Badge>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 font-semibold text-gold text-sm">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {Number(test.price)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {test.questions.length}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(test)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-gold hover:bg-gold/10"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(test.id)}
                        disabled={deleteTest.isPending}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                  No tests yet. Click "Add Test" to create your first test.
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
