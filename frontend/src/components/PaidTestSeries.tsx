import { useState } from 'react';
import { Check, CreditCard, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const plans = [
  {
    name: 'Basic',
    price: '₹49',
    color: 'border-sky/40',
    highlight: false,
    features: [
      'Access to 50+ tests',
      'Basic performance analytics',
      'Email support',
    ],
  },
  {
    name: 'Standard',
    price: '₹99',
    color: 'border-gold/60',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Access to 200+ tests',
      'Detailed analytics & reports',
      'Priority email support',
      'Category-wise mock tests',
    ],
  },
  {
    name: 'Premium',
    price: '₹199',
    color: 'border-success/40',
    highlight: false,
    features: [
      'Unlimited test access',
      'AI-powered adaptive tests',
      'Live proctoring support',
      'Dedicated mentor support',
      'Rank predictor tool',
    ],
  },
];

export default function PaidTestSeries() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const handleBuy = (planName: string) => {
    setSelectedPlan(planName);
    setShowModal(true);
  };

  return (
    <section id="paid-tests" className="py-16 bg-navy-mid">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold text-foreground mb-2">
            Paid <span className="text-gold">Test Series</span>
          </h2>
          <p className="text-muted-foreground">Unlock premium features to accelerate your preparation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative card-navy p-6 flex flex-col gap-5 border-2 transition-all duration-200 hover:shadow-gold ${plan.color} ${
                plan.highlight ? 'scale-105 shadow-gold' : ''
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gold text-navy-deep text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star size={10} fill="currentColor" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <h3 className="font-heading text-2xl font-bold text-foreground">{plan.name}</h3>
                <div className="font-heading text-4xl font-bold text-gold mt-1">{plan.price}</div>
                <div className="text-xs text-muted-foreground">one-time payment</div>
              </div>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check size={15} className="text-success mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBuy(plan.name)}
                className="w-full inline-flex items-center justify-center gap-2 bg-success text-success-foreground font-bold py-3 rounded-md hover:opacity-90 active:scale-95 transition-all"
              >
                <CreditCard size={16} />
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-gold flex items-center gap-2">
              <CreditCard size={20} />
              Payment Coming Soon
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              Thank you for your interest in the <strong className="text-foreground">{selectedPlan}</strong> plan!
              Payment processing will be available very soon. Stay tuned for updates.
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={() => setShowModal(false)}
            className="mt-4 w-full bg-gold text-navy-deep font-bold py-2.5 rounded-md hover:opacity-90 transition-all"
          >
            Got it!
          </button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
