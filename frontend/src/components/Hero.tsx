import { BookOpen, Zap, Trophy } from 'lucide-react';

interface HeroProps {
  onStartFreeTest: () => void;
}

export default function Hero({ onStartFreeTest }: HeroProps) {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-navy-deep py-20 md:py-32"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-sky/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-6">
            <Zap size={14} className="text-gold" />
            <span className="text-gold text-sm font-semibold tracking-wide">India's Premier Exam Prep Platform</span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground mb-4 leading-tight">
            Start{' '}
            <span className="text-gold">Free Test</span>{' '}
            Now!
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            Practice for{' '}
            <span className="text-sky font-semibold">UPSC, BPSC, SSC, Railway</span>, and{' '}
            <span className="text-sky font-semibold">State Exams</span> with AI-powered test series.
          </p>

          {/* CTA Button */}
          <button
            onClick={onStartFreeTest}
            className="inline-flex items-center gap-2 bg-success text-success-foreground font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:opacity-90 active:scale-95 transition-all duration-200"
          >
            <BookOpen size={20} />
            Start Free Test
          </button>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: '10,000+', label: 'Students' },
              { value: '500+', label: 'Tests' },
              { value: '5', label: 'Exam Categories' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-2xl md:text-3xl font-bold text-gold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </section>
  );
}
