import { useState } from 'react';
import { BookOpen, Building2, Train, Landmark, Newspaper, Globe } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const categoryIcons: Record<string, React.ElementType> = {
  UPSC: Landmark,
  BPSC: Building2,
  SSC: BookOpen,
  Railway: Train,
  Banking: Globe,
  'Current Affairs': Newspaper,
  'State Exams': Building2,
};

const categoryAccents: Record<string, { active: string; hover: string; icon: string }> = {
  'All Tests': { active: 'oklch(0.80 0.17 82)', hover: 'oklch(0.80 0.17 82 / 0.15)', icon: 'oklch(0.80 0.17 82)' },
  UPSC: { active: 'oklch(0.65 0.22 238)', hover: 'oklch(0.65 0.22 238 / 0.15)', icon: 'oklch(0.65 0.22 238)' },
  BPSC: { active: 'oklch(0.80 0.17 82)', hover: 'oklch(0.80 0.17 82 / 0.15)', icon: 'oklch(0.80 0.17 82)' },
  SSC: { active: 'oklch(0.60 0.20 145)', hover: 'oklch(0.60 0.20 145 / 0.15)', icon: 'oklch(0.60 0.20 145)' },
  Railway: { active: 'oklch(0.68 0.22 30)', hover: 'oklch(0.68 0.22 30 / 0.15)', icon: 'oklch(0.68 0.22 30)' },
  Banking: { active: 'oklch(0.65 0.20 300)', hover: 'oklch(0.65 0.20 300 / 0.15)', icon: 'oklch(0.65 0.20 300)' },
  'Current Affairs': { active: 'oklch(0.65 0.18 185)', hover: 'oklch(0.65 0.18 185 / 0.15)', icon: 'oklch(0.65 0.18 185)' },
  'State Exams': { active: 'oklch(0.65 0.20 340)', hover: 'oklch(0.65 0.20 340 / 0.15)', icon: 'oklch(0.65 0.20 340)' },
};

export default function ExamCategories() {
  const [activeCategory, setActiveCategory] = useState('All Tests');
  const { t } = useTranslation();

  const categories = [
    { key: 'All Tests', label: t('catAllTests') },
    { key: 'UPSC', label: t('catUPSC') },
    { key: 'BPSC', label: t('catBPSC') },
    { key: 'SSC', label: t('catSSC') },
    { key: 'Railway', label: t('catRailway') },
    { key: 'Banking', label: t('catBanking') },
    { key: 'Current Affairs', label: t('catCurrentAffairs') },
    { key: 'State Exams', label: t('catStateExams') },
  ];

  return (
    <section className="py-12" style={{ background: 'oklch(0.14 0.06 265)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-center mb-8" style={{ color: 'oklch(0.96 0.01 255)' }}>
          {t('examCategoriesTitle')}
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map(({ key, label }) => {
            const Icon = categoryIcons[key] || BookOpen;
            const isActive = activeCategory === key;
            const accent = categoryAccents[key] || categoryAccents['All Tests'];

            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-heading font-semibold text-sm tracking-wide transition-all duration-200"
                style={isActive ? {
                  background: accent.active,
                  border: `1px solid ${accent.active}`,
                  color: 'oklch(0.10 0.04 265)',
                  boxShadow: `0 0 16px ${accent.active}55`,
                } : {
                  background: 'oklch(0.18 0.065 265)',
                  border: `1px solid oklch(0.28 0.07 265)`,
                  color: 'oklch(0.75 0.04 255)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = accent.active;
                    (e.currentTarget as HTMLButtonElement).style.color = accent.active;
                    (e.currentTarget as HTMLButtonElement).style.background = accent.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'oklch(0.28 0.07 265)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.75 0.04 255)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.18 0.065 265)';
                  }
                }}
              >
                <Icon className="h-4 w-4" style={{ color: isActive ? 'oklch(0.10 0.04 265)' : accent.icon }} />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
