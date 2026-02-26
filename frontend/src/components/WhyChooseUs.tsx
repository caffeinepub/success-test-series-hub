import { Brain, TrendingUp, Shield, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Generated Questions',
    description: 'Intelligent question generation tailored to your exam pattern and difficulty level.',
    color: 'text-sky',
    bg: 'bg-sky/10',
  },
  {
    icon: TrendingUp,
    title: 'Adaptive Tests',
    description: 'Tests that adapt to your performance, focusing on areas that need improvement.',
    color: 'text-gold',
    bg: 'bg-gold/10',
  },
  {
    icon: Shield,
    title: 'Live Proctoring',
    description: 'Secure exam environment with live monitoring to simulate real exam conditions.',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    description: 'In-depth performance reports and insights to track your progress over time.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold text-foreground mb-2">
            Why <span className="text-gold">Choose Us?</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We combine cutting-edge technology with expert content to give you the best exam preparation experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="card-navy p-6 flex flex-col gap-4 hover:border-gold/30 transition-all duration-200 hover:shadow-gold group"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className={feature.color} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
