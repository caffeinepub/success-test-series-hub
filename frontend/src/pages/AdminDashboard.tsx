import React, { useEffect } from 'react';
import { getSessionToken } from '../hooks/useAuth';
import AdminSidebar from '../components/AdminSidebar';
import AdminTests from './AdminTests';
import AdminRankers from './AdminRankers';
import AdminContacts from './AdminContacts';
import AdminSliders from './AdminSliders';
import AdminCurrentAffairs from './AdminCurrentAffairs';
import AdminNewspapers from './AdminNewspapers';
import AdminStudents from './AdminStudents';
import AdminPaidTests from './AdminPaidTests';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  currentPath: string;
}

export default function AdminDashboard({ onNavigate, currentPath }: AdminDashboardProps) {
  const token = getSessionToken();

  useEffect(() => {
    if (!token) {
      onNavigate('admin-login');
    }
  }, [token, onNavigate]);

  if (!token) return null;

  const handleSidebarNavigate = (path: string) => {
    if (path === '/') {
      onNavigate('home');
    } else {
      onNavigate(path);
    }
  };

  const renderPanel = () => {
    switch (currentPath) {
      case '/admin/tests':
        return <AdminTests />;
      case '/admin/paid-tests':
        return <AdminPaidTests />;
      case '/admin/rankers':
        return <AdminRankers />;
      case '/admin/contacts':
        return <AdminContacts />;
      case '/admin/sliders':
        return <AdminSliders />;
      case '/admin/current-affairs':
        return <AdminCurrentAffairs />;
      case '/admin/newspapers':
        return <AdminNewspapers />;
      case '/admin/students':
        return <AdminStudents />;
      default:
        return <AdminTests />;
    }
  };

  return (
    <div className="flex min-h-screen bg-navy-950">
      <AdminSidebar currentPath={currentPath} onNavigate={handleSidebarNavigate} />
      <main className="flex-1 overflow-auto">
        {renderPanel()}
      </main>
    </div>
  );
}
