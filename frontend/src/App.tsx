import { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
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
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';

type Page = 'home' | 'admin' | 'admin-dashboard' | 'student-login' | 'student-dashboard';

function getInitialPage(): Page {
  const path = window.location.pathname;
  if (path === '/admin') return 'admin';
  if (path.startsWith('/admin/dashboard')) return 'admin-dashboard';
  if (path === '/student/login') return 'student-login';
  if (path.startsWith('/student/dashboard')) return 'student-dashboard';
  return 'home';
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    if (path === '/admin') setCurrentPage('admin');
    else if (path.startsWith('/admin/dashboard')) setCurrentPage('admin-dashboard');
    else if (path === '/student/login') setCurrentPage('student-login');
    else if (path.startsWith('/student/dashboard')) setCurrentPage('student-dashboard');
    else setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'admin':
        return <AdminLogin onNavigate={navigate} />;
      case 'admin-dashboard':
        return <AdminDashboard currentPath={currentPath} onNavigate={navigate} />;
      case 'student-login':
        return <StudentLogin onNavigate={navigate} />;
      case 'student-dashboard':
        return <StudentDashboard onNavigate={navigate} />;
      default:
        return (
          <>
            <Hero onNavigate={navigate} />
            <ExamCategories />
            <FreeTests />
            <PaidTestSeries />
            <WhyChooseUs />
            <TopRankers />
            <AITestGenerator />
            <Contact />
          </>
        );
    }
  };

  const isAdminPage = currentPage === 'admin' || currentPage === 'admin-dashboard';

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background text-foreground">
        {!isAdminPage && <Header onNavigate={navigate} />}
        <main>{renderPage()}</main>
        {!isAdminPage && currentPage === 'home' && <Footer />}
      </div>
    </LanguageProvider>
  );
}
