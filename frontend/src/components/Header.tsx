import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Categories', href: '#categories' },
  { label: 'Free Tests', href: '#free-tests' },
  { label: 'Paid Tests', href: '#paid-tests' },
  { label: 'Top Rankers', href: '#top-rankers' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-navy-deep border-b border-gold/20 shadow-navy">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/logo.dim_256x256.png"
              alt="Success Test Series Hub Logo"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="hidden sm:block">
              <span className="font-heading text-xl font-bold text-gold leading-tight block">
                Success Test Series
              </span>
              <span className="text-xs text-sky font-medium tracking-widest uppercase">Hub</span>
            </div>
            <span className="sm:hidden font-heading text-lg font-bold text-gold">STSHub</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-gold transition-colors rounded-md hover:bg-navy-light"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-md text-foreground hover:text-gold hover:bg-navy-light transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-border/50 mt-1 pt-3 animate-fade-in">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-gold hover:bg-navy-light rounded-md transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
