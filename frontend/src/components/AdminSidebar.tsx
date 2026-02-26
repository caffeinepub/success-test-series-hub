import { LayoutDashboard, FileText, Trophy, Mail, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

const navItems = [
  { label: 'Tests', path: '/admin/dashboard/tests', icon: FileText },
  { label: 'Rankers', path: '/admin/dashboard/rankers', icon: Trophy },
  { label: 'Contact Submissions', path: '/admin/dashboard/contacts', icon: Mail },
];

export default function AdminSidebar({ currentPath, onNavigate, onLogout, isLoggingOut }: AdminSidebarProps) {
  return (
    <aside className="w-64 min-h-screen bg-navy-deep border-r border-gold/20 flex flex-col shadow-navy shrink-0">
      {/* Header */}
      <div className="p-5 border-b border-gold/20">
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/logo.dim_256x256.png"
            alt="Logo"
            className="h-9 w-9 rounded-full object-cover border border-gold/30"
          />
          <div>
            <div className="font-heading font-bold text-gold text-sm leading-tight">STSHub</div>
            <div className="text-xs text-muted-foreground">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="mb-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">
            Management
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath.includes(item.path);
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gold/15 text-gold border border-gold/30'
                    : 'text-foreground/70 hover:text-foreground hover:bg-navy-light'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={16} className={isActive ? 'text-gold' : 'text-muted-foreground group-hover:text-foreground'} />
                  {item.label}
                </span>
                {isActive && <ChevronRight size={14} className="text-gold" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gold/20">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 font-medium"
          onClick={onLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <span className="h-4 w-4 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin" />
          ) : (
            <LogOut size={16} />
          )}
          {isLoggingOut ? 'Logging out…' : 'Logout'}
        </Button>
        <button
          onClick={() => onNavigate('/')}
          className="w-full mt-2 text-xs text-muted-foreground hover:text-gold transition-colors text-center py-1"
        >
          ← Back to main site
        </button>
      </div>
    </aside>
  );
}
