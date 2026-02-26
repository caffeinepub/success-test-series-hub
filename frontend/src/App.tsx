import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Hero from './components/Hero';
import ExamCategories from './components/ExamCategories';
import FreeTests from './components/FreeTests';
import PaidTestSeries from './components/PaidTestSeries';
import WhyChooseUs from './components/WhyChooseUs';
import TopRankers from './components/TopRankers';
import AITestGenerator from './components/AITestGenerator';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

type AdminView = 'login' | 'dashboard';

function getAdminView(): AdminView | null {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname;
  if (path.startsWith('/admin/dashboard')) return 'dashboard';
  if (path === '/admin' || path === '/admin/') return 'login';
  return null;
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Listen for popstate (browser back/forward)
  useState(() => {
    const handler = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  });

  const adminView = (() => {
    if (currentPath.startsWith('/admin/dashboard')) return 'dashboard';
    if (currentPath === '/admin' || currentPath === '/admin/') return 'login';
    return null;
  })();

  const handleStartFreeTest = () => {
    const el = document.getElementById('free-tests');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (adminView === 'login') {
    return (
      <>
        <AdminLogin onNavigate={navigate} />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  if (adminView === 'dashboard') {
    return (
      <>
        <AdminDashboard currentPath={currentPath} onNavigate={navigate} />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero onStartFreeTest={handleStartFreeTest} />
        <ExamCategories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <FreeTests categoryFilter={selectedCategory} />
        <PaidTestSeries />
        <WhyChooseUs />
        <TopRankers />
        <AITestGenerator />
        <Contact />
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}
