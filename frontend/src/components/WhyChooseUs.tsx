import { Brain, TrendingUp, Shield, BarChart3 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function WhyChooseUs() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Brain,
      titleKey: 'aiQuestionsTitle' as const,
      descKey: 'aiQuestionsDesc' as const,
      color: 'oklch(0.65 0.22 238)',
      glow: 'oklch(0.65 0.22 238 / 0.15)',
      border: 'oklch(0.65 0.22 238 / 0.3)',
    },
    {
      icon: TrendingUp,
      titleKey: 'adaptiveTestsTitle' as const,
      descKey: 'adaptiveTestsDesc' as const,
      color: 'oklch(0.80 0.17 82)',
      glow: 'oklch(0.80 0.17 82 / 0.12)',
      border: 'oklch(0.80 0.17 82 / 0.3)',
    },
    {
      icon: Shield,
      titleKey: 'liveProctoringTitle' as const,
      descKey: 'liveProctoringDesc' as const,
      color: 'oklch(0.60 0.20 145)',
      glow: 'oklch(0.60 0.20 145 / 0.12)',
      border: 'oklch(0.60 0.20 145 / 0.3)',
    },
    {
      icon: BarChart3,
      titleKey: 'analyticsTitle' as const,
      descKey: 'analyticsDesc' as const,
      color: 'oklch(0.68 0.22 30)',
      glow: 'oklch(0.68 0.22 30 / 0.12)',
      border: 'oklch(0.68 0.22 30 / 0.3)',
    },
  ];

  return (
    <section className="py-16" style={{ background: 'oklch(0.11 0.055 265)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl" style={{ color: 'oklch(0.96 0.01 255)' }}>
            {t('whyChooseUsTitle')}
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, titleKey, descKey, color, glow, border }) => (
            <div
              key={titleKey}
              className="relative rounded-xl p-6 transition-all duration-300 text-center group"
              style={{
                background: `linear-gradient(135deg, ${glow}, oklch(0.13 0.06 265))`,
                border: `1px solid ${border}`,
              }}
            >
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-all duration-300"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}
              >
                <Icon className="h-6 w-6" style={{ color }} />
              </div>
              <h3 className="font-heading font-bold text-lg mb-2" style={{ color: 'oklch(0.96 0.01 255)' }}>
                {t(titleKey)}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.62 0.05 255)' }}>
                {t(descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
