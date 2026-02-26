import { BookOpen, Users, FileText, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

interface HeroProps {
  onNavigate?: (path: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const { t } = useTranslation();

  const handleStartFreeTest = () => {
    const el = document.querySelector('#free-tests');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative overflow-hidden py-20 md:py-32" style={{
      background: 'linear-gradient(135deg, oklch(0.09 0.05 265) 0%, oklch(0.13 0.09 255) 50%, oklch(0.11 0.07 270) 100%)'
    }}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl" style={{ background: 'oklch(0.80 0.17 82 / 0.08)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl" style={{ background: 'oklch(0.65 0.22 238 / 0.08)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl" style={{ background: 'oklch(0.60 0.20 145 / 0.04)' }} />
        {/* Decorative grid lines */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(oklch(0.80 0.17 82) 1px, transparent 1px), linear-gradient(90deg, oklch(0.80 0.17 82) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6" style={{
          background: 'oklch(0.80 0.17 82 / 0.12)',
          border: '1px solid oklch(0.80 0.17 82 / 0.35)'
        }}>
          <Award className="h-4 w-4 text-gold" />
          <span className="text-gold text-sm font-heading font-semibold tracking-wide">India's #1 Exam Prep Platform</span>
        </div>

        <h1 className="font-heading font-bold text-4xl md:text-6xl leading-tight mb-4" style={{ color: 'oklch(0.96 0.01 255)' }}>
          {t('heroHeadline')}{' '}
          <span className="text-gold relative">
            {t('heroHeadlineAccent')}
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, oklch(0.80 0.17 82), oklch(0.65 0.22 238))' }} />
          </span>
        </h1>

        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed" style={{ color: 'oklch(0.72 0.05 255)' }}>
          {t('heroSubheadline')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            size="lg"
            onClick={handleStartFreeTest}
            className="font-heading font-bold text-lg tracking-wide px-8 shadow-gold animate-pulse-gold"
            style={{ background: 'oklch(0.60 0.20 145)', color: 'oklch(0.10 0.04 265)' }}
          >
            <BookOpen className="h-5 w-5 mr-2" />
            {t('startFreeTest')}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => document.querySelector('#paid-plans')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-heading font-bold text-lg tracking-wide px-8 border-sky text-sky hover:bg-sky hover:text-navy-deep"
          >
            <Zap className="h-5 w-5 mr-2" />
            View Plans
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {[
            { icon: Users, value: '50,000+', label: t('statStudents'), color: 'text-sky' },
            { icon: FileText, value: '10,000+', label: t('statTests'), color: 'text-gold' },
            { icon: Award, value: '20+', label: t('statCategories'), color: 'text-success' },
          ].map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="text-center group">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 mx-auto" style={{ background: 'oklch(0.20 0.065 265)' }}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className={`font-heading font-bold text-2xl md:text-3xl ${color}`}>{value}</div>
              <div className="text-sm font-medium mt-0.5" style={{ color: 'oklch(0.60 0.05 255)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
