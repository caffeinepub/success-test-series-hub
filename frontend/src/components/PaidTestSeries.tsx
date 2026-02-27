import React from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useGetTests } from '../hooks/useQueries';
import { ExamCategory } from '../backend';
import { getExamCategoryLabel, EXAM_CATEGORY_COLORS } from '../utils/examCategories';

const plans = [
  {
    name: 'Basic',
    price: '₹49',
    icon: Star,
    color: '#22c55e',
    borderColor: '#16a34a',
    bgGradient: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)',
    features: ['5 Full Tests', 'Hindi & English', 'Basic Analytics', '30-day Access'],
  },
  {
    name: 'Standard',
    price: '₹99',
    icon: Zap,
    color: '#f59e0b',
    borderColor: '#d97706',
    bgGradient: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)',
    features: ['15 Full Tests', 'Hindi & English', 'Detailed Analytics', '60-day Access', 'Current Affairs'],
    popular: true,
  },
  {
    name: 'Premium',
    price: '₹199',
    icon: Crown,
    color: '#8b5cf6',
    borderColor: '#7c3aed',
    bgGradient: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.05) 100%)',
    features: ['Unlimited Tests', 'Hindi & English', 'Advanced Analytics', '90-day Access', 'Current Affairs', 'Priority Support'],
  },
];

export default function PaidTestSeries() {
  const { t } = useTranslation();
  const { data: allTests } = useGetTests();

  // Filter paid tests (price > 0)
  const paidTests = React.useMemo(() => {
    if (!allTests) return [];
    return allTests.filter((test) => Number(test.price) > 0);
  }, [allTests]);

  return (
    <section id="paid-tests" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-rajdhani mb-3">
            {t('paidTestsTitle')}
          </h2>
          <p className="text-navy-300 max-w-xl mx-auto">
            {t('paidTestsSubtitle')}
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className="relative rounded-2xl border p-6 flex flex-col"
                style={{
                  background: plan.bgGradient,
                  borderColor: plan.borderColor,
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-navy-950"
                    style={{ background: plan.color }}
                  >
                    Most Popular
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${plan.color}22` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: plan.color }} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold font-rajdhani">{plan.name}</h3>
                    <p className="text-2xl font-bold" style={{ color: plan.color }}>{plan.price}</p>
                  </div>
                </div>
                <ul className="space-y-2 flex-1 mb-5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-navy-200">
                      <Check className="w-4 h-4 shrink-0" style={{ color: plan.color }} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: plan.color, color: '#0a1628' }}
                  onClick={() => alert(`Contact admin to purchase ${plan.name} plan`)}
                >
                  Buy Now
                </button>
              </div>
            );
          })}
        </div>

        {/* Available Paid Tests */}
        {paidTests.length > 0 && (
          <div>
            <h3 className="text-white font-bold font-rajdhani text-xl mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-gold inline-block" />
              Available Paid Tests
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paidTests.map((test) => {
                const catColors = EXAM_CATEGORY_COLORS[test.category as ExamCategory];
                const catLabel = getExamCategoryLabel(test.category as ExamCategory);
                return (
                  <div
                    key={test.id.toString()}
                    className="rounded-xl border p-4 flex items-start gap-4"
                    style={{
                      borderColor: catColors?.color ?? '#f59e0b',
                      background: catColors?.bg ?? 'rgba(245,158,11,0.08)',
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold"
                          style={{
                            color: catColors?.color ?? '#f59e0b',
                            background: `${catColors?.color ?? '#f59e0b'}22`,
                          }}
                        >
                          {catLabel}
                        </span>
                        <span className="text-xs text-navy-400">
                          {test.questions.length} {t('questions')}
                        </span>
                      </div>
                      <p className="text-white font-semibold text-sm leading-snug truncate">
                        {test.title}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className="text-lg font-bold"
                        style={{ color: catColors?.color ?? '#f59e0b' }}
                      >
                        ₹{Number(test.price)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
