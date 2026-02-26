import { Mail, Clock, User, AtSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { useGetContactSubmissions } from '../hooks/useQueries';
import { getSessionToken } from '../hooks/useAuth';

function formatTimestamp(ts: bigint): string {
  // Backend stores nanoseconds
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminContacts() {
  const token = getSessionToken() || '';
  const { data: submissions, isLoading, isError } = useGetContactSubmissions(token);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
          <Mail size={22} className="text-gold" />
          Contact Submissions
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View all contact form submissions (read-only)
        </p>
      </div>

      {isError && (
        <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          Failed to load contact submissions. Your session may have expired.
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-navy">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-semibold">
                <span className="flex items-center gap-1.5"><User size={13} /> Name</span>
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold">
                <span className="flex items-center gap-1.5"><AtSign size={13} /> Email</span>
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold">Message</TableHead>
              <TableHead className="text-muted-foreground font-semibold">
                <span className="flex items-center gap-1.5"><Clock size={13} /> Submitted</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                </TableRow>
              ))
            ) : submissions && submissions.length > 0 ? (
              submissions.map((sub, idx) => (
                <TableRow key={idx} className="border-border hover:bg-navy-light/50">
                  <TableCell className="font-medium text-foreground">{sub.name}</TableCell>
                  <TableCell className="text-sky text-sm">{sub.email}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-xs">
                    <span className="line-clamp-2">{sub.message}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                    {formatTimestamp(sub.timestamp)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  <Mail size={32} className="mx-auto mb-3 opacity-30" />
                  <p>No contact submissions yet.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
