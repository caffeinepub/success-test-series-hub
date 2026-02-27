import { Mail, Clock, User, AtSign } from 'lucide-react';

interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  timestamp: bigint;
}

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
  // Contact submissions retrieval is not yet available via the backend API.
  const submissions: ContactSubmission[] = [];

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

      {/* Info banner */}
      <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm flex items-start gap-2">
        <Mail size={16} className="shrink-0 mt-0.5" />
        <span>
          Contact submissions viewer is coming soon. The backend API for retrieving submissions is not yet exposed.
          Submissions sent via the contact form are stored securely in the canister.
        </span>
      </div>

      {/* Empty state */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-navy">
        <div className="text-center py-16 text-muted-foreground">
          <Mail size={40} className="mx-auto mb-4 opacity-20" />
          <p className="font-semibold text-foreground mb-1">No submissions to display</p>
          <p className="text-sm">Contact form submissions will appear here once the API is available.</p>
        </div>
      </div>
    </div>
  );
}
