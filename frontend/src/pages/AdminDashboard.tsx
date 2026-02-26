import { useEffect } from 'react';
import { getSessionToken } from '../hooks/useAuth';
import AdminSidebar from '../components/AdminSidebar';
import AdminTests from './AdminTests';
import AdminRankers from './AdminRankers';
import AdminContacts from './AdminContacts';
import { useAdminLogout } from '../hooks/useQueries';
import { clearSessionToken } from '../hooks/useAuth';

interface AdminDashboardProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function AdminDashboard({ currentPath, onNavigate }: AdminDashboardProps) {
  const token = getSessionToken();
  const logoutMutation = useAdminLogout();

  useEffect(() => {
    if (!token) {
      onNavigate('/admin');
    }
  }, [token, onNavigate]);

  if (!token) return null;

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync({ token });
    } catch {
      // ignore logout errors
    } finally {
      clearSessionToken();
      onNavigate('/admin');
    }
  };

  const renderPanel = () => {
    if (currentPath.includes('/admin/dashboard/rankers')) return <AdminRankers />;
    if (currentPath.includes('/admin/dashboard/contacts')) return <AdminContacts />;
    return <AdminTests />;
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        onLogout={handleLogout}
        isLoggingOut={logoutMutation.isPending}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
}
