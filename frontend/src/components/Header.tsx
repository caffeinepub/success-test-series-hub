import { useState } from 'react';
import { Menu, X, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  onNavigate?: (path: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const navLinks = [
    { label: t('home'), href: '#home' },
    { label: t('freeTests'), href: '#free-tests' },
    { label: t('paidPlans'), href: '#paid-plans' },
    { label: t('topRankers'), href: '#top-rankers' },
    { label: t('contact'), href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStudentLogin = () => {
    setMobileMenuOpen(false);
    onNavigate?.('/student/login');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 shadow-navy" style={{ background: 'oklch(0.09 0.05 265)', borderBottom: '1px solid oklch(0.26 0.07 265)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate?.('/')}>
            <img src="/assets/generated/logo.dim_256x256.png" alt="STS Hub Logo" className="h-10 w-10 rounded-full object-cover ring-2 ring-gold/40" />
            <span className="font-heading font-bold text-xl tracking-wide text-gold">STS Hub</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium font-heading tracking-wide transition-colors duration-200 hover:text-gold"
                style={{ color: 'oklch(0.82 0.04 255)' }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors duration-200"
              style={{
                border: '1px solid oklch(0.80 0.17 82 / 0.5)',
                background: 'oklch(0.14 0.06 265)',
              }}
              title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
            >
              <span className={`text-xs font-bold font-heading tracking-wider transition-colors ${language === 'en' ? 'text-gold' : ''}`}
                style={language !== 'en' ? { color: 'oklch(0.45 0.04 255)' } : {}}>
                EN
              </span>
              <span className="text-xs mx-0.5" style={{ color: 'oklch(0.40 0.04 255)' }}>|</span>
              <span className={`text-xs font-bold font-heading tracking-wider transition-colors ${language === 'hi' ? 'text-gold' : ''}`}
                style={language !== 'hi' ? { color: 'oklch(0.45 0.04 255)' } : {}}>
                HI
              </span>
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleStudentLogin}
              className="border-gold text-gold hover:bg-gold hover:text-navy-deep font-heading font-semibold tracking-wide"
            >
              <GraduationCap className="h-4 w-4 mr-1.5" />
              {t('studentLogin')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Language Toggle Mobile */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full"
              style={{ border: '1px solid oklch(0.80 0.17 82 / 0.5)', background: 'oklch(0.14 0.06 265)' }}
            >
              <span className={`text-xs font-bold font-heading ${language === 'en' ? 'text-gold' : ''}`}
                style={language !== 'en' ? { color: 'oklch(0.45 0.04 255)' } : {}}>EN</span>
              <span className="text-xs" style={{ color: 'oklch(0.40 0.04 255)' }}>|</span>
              <span className={`text-xs font-bold font-heading ${language === 'hi' ? 'text-gold' : ''}`}
                style={language !== 'hi' ? { color: 'oklch(0.45 0.04 255)' } : {}}>HI</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hover:text-gold transition-colors"
              style={{ color: 'oklch(0.82 0.04 255)' }}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-4 space-y-3" style={{ background: 'oklch(0.09 0.05 265)', borderTop: '1px solid oklch(0.26 0.07 265)' }}>
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="block w-full text-left text-sm font-medium font-heading tracking-wide py-2 hover:text-gold transition-colors"
              style={{ color: 'oklch(0.82 0.04 255)' }}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2" style={{ borderTop: '1px solid oklch(0.26 0.07 265)' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleStudentLogin}
              className="w-full border-gold text-gold hover:bg-gold hover:text-navy-deep font-heading font-semibold tracking-wide"
            >
              <GraduationCap className="h-4 w-4 mr-1.5" />
              {t('studentLogin')}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
