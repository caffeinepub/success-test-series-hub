import { useState } from 'react';
import { Plus, Trash2, Pencil, IndianRupee, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useGetTests, useDeleteTest } from '../hooks/useQueries';
import { getSessionToken } from '../hooks/useAuth';
import PaidTestWizard from '../components/PaidTestWizard';
import type { Test } from '../backend';
import { ExamCategory } from '../backend';
import { getExamCategoryLabel, EXAM_CATEGORY_COLORS } from '../utils/examCategories';
import { toast } from 'sonner';

export default function AdminPaidTests() {
  const { data: tests, isLoading } = useGetTests();
  const deleteTest = useDeleteTest();

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState<Test | null>(null);

  // Filter only paid tests (price > 0)
  const paidTests = tests ? tests.filter((t) => Number(t.price) > 0) : [];

  const handleAdd = () => {
    setEditingTest(null);
    setIsWizardOpen(true);
  };

  const handleEdit = (test: Test) => {
    setEditingTest(test);
    setIsWizardOpen(true);
  };

  const handleWizardClose = () => {
    setIsWizardOpen(false);
    setEditingTest(null);
  };

  const handleDeleteClick = (test: Test) => {
    setTestToDelete(test);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!testToDelete) return;
    const token = getSessionToken();
    if (!token) return;
    try {
      await deleteTest.mutateAsync({ token, id: testToDelete.id });
      toast.success('Paid test deleted successfully');
    } catch {
      toast.error('Failed to delete paid test');
    } finally {
      setDeleteDialogOpen(false);
      setTestToDelete(null);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <CreditCard size={22} className="text-gold" />
            Paid Tests Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage paid exam tests (price &gt; 0)
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-gold text-navy-deep hover:bg-gold-light font-semibold gap-2"
        >
          <Plus size={16} />
          Add Paid Test
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-navy">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-semibold w-16">ID</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Title</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Exam Category</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-center">Price</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-center">Questions</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-center">Neg. Marking</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : paidTests.length > 0 ? (
              paidTests.map((test) => {
                const catColors = EXAM_CATEGORY_COLORS[test.category as ExamCategory];
                const catLabel = getExamCategoryLabel(test.category as ExamCategory);
                return (
                  <TableRow
                    key={test.id.toString()}
                    className="border-border hover:bg-accent/20 transition-colors"
                  >
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      #{test.id.toString()}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{test.title}</TableCell>
                    <TableCell>
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          color: catColors?.color ?? '#f59e0b',
                          background: catColors?.bg ?? 'rgba(245,158,11,0.15)',
                        }}
                      >
                        {catLabel}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-0.5 font-semibold text-gold text-sm">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {Number(test.price)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {test.questions.length}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {test.negativeMarkValue > 0 ? (
                        <span className="text-destructive font-medium">
                          -{test.negativeMarkValue}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(test)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-gold hover:bg-gold/10"
                          title="Edit test (step-by-step)"
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteClick(test)}
                          disabled={deleteTest.isPending}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Delete test"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                  No paid tests yet. Click "Add Paid Test" to create one using the step-by-step wizard.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Paid Test</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <strong>"{testToDelete?.title}"</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTestToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteTest.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Step-by-Step Wizard */}
      {isWizardOpen && (
        <PaidTestWizard
          onClose={handleWizardClose}
          editMode={!!editingTest}
          initialTestData={editingTest}
          testId={editingTest?.id}
        />
      )}
    </div>
  );
}
