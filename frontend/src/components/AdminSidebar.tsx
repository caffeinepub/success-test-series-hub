import React from 'react';
import { useAdminLogout } from '../hooks/useQueries';
import { getSessionToken, clearSessionToken } from '../hooks/useAuth';
import {
  ClipboardList,
  Trophy,
  MessageSquare,
  LogOut,
  GraduationCap,
  ArrowLeft,
  Image,
  Newspaper,
  BookOpen,
  Users,
} from 'lucide-react';

interface AdminSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const navItems = [
  { path: '/admin/tests', label: 'Tests', icon: ClipboardList },
  { path: '/admin/rankers', label: 'Rankers', icon: Trophy },
  { path: '/admin/contacts', label: 'Contact Submissions', icon: MessageSquare },
  { path: '/admin/sliders', label: 'Manage Sliders', icon: Image },
  { path: '/admin/current-affairs', label: 'Current Affairs', icon: Newspaper },
  { path: '/admin/newspapers', label: 'Daily Newspaper', icon: BookOpen },
  { path: '/admin/students', label: 'Students', icon: Users },
];

export default function AdminSidebar({ currentPath, onNavigate }: AdminSidebarProps) {
  const logoutMutation = useAdminLogout();

  const handleLogout = async () => {
    const token = getSessionToken();
    if (token) {
      try {
        await logoutMutation.mutateAsync(token);
      } catch (_) {}
    }
    clearSessionToken();
    onNavigate('/');
  };

  return (
    <aside className="w-64 min-h-screen bg-navy-900 border-r border-navy-700 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-navy-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gold-500/20 border border-gold-500/40 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <p className="text-white font-bold font-rajdhani text-sm leading-tight">STS Hub</p>
            <p className="text-navy-400 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = currentPath === path;
          return (
            <button
              key={path}
              onClick={() => onNavigate(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                  : 'text-navy-300 hover:bg-navy-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-navy-700 space-y-1">
        <button
          onClick={() => onNavigate('/')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-navy-400 hover:bg-navy-800 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Back to Site
        </button>
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all disabled:opacity-50"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </aside>
  );
}
