import React from 'react';
import { Check, Star, Zap, Crown, CreditCard, Building2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

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

        {/* Bank Payment Details */}
        <div
          className="rounded-2xl border-2 p-6"
          style={{
            borderColor: '#d97706',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.04) 100%)',
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-gold-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-gold-400" />
                <h3 className="text-gold-400 font-bold font-rajdhani text-lg">Payment Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-navy-800/60 rounded-lg px-4 py-3 border border-navy-600">
                  <p className="text-navy-400 text-xs mb-1">Account Number</p>
                  <p className="text-white font-mono font-semibold text-sm">444418210022399</p>
                </div>
                <div className="bg-navy-800/60 rounded-lg px-4 py-3 border border-navy-600">
                  <p className="text-navy-400 text-xs mb-1">IFSC Code</p>
                  <p className="text-white font-mono font-semibold text-sm">BKID0004444</p>
                </div>
                <div className="bg-navy-800/60 rounded-lg px-4 py-3 border border-navy-600">
                  <p className="text-navy-400 text-xs mb-1">Account Holder</p>
                  <p className="text-white font-semibold text-sm">Sachin Kumar</p>
                </div>
              </div>
              <p className="text-navy-300 text-sm flex items-start gap-2">
                <span className="text-gold-400 font-bold shrink-0">Note:</span>
                Transfer the amount and contact admin for plan activation. Please share your mobile number and payment screenshot.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
