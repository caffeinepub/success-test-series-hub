import { GraduationCap, Building2, Briefcase, Train, MapPin } from 'lucide-react';

interface ExamCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  { name: 'UPSC', icon: GraduationCap, description: 'Civil Services' },
  { name: 'BPSC', icon: Building2, description: 'Bihar Public Service' },
  { name: 'SSC', icon: Briefcase, description: 'Staff Selection' },
  { name: 'Railway', icon: Train, description: 'RRB Exams' },
  { name: 'State Exams', icon: MapPin, description: 'State Level' },
];

export default function ExamCategories({ selectedCategory, onSelectCategory }: ExamCategoriesProps) {
  return (
    <section id="categories" className="py-16 bg-navy-mid">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-4xl font-bold text-foreground mb-2">
            Exam <span className="text-gold">Categories</span>
          </h2>
          <p className="text-muted-foreground">Select a category to filter tests</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {/* All button */}
          <button
            onClick={() => onSelectCategory('All')}
            className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
              selectedCategory === 'All'
                ? 'bg-gold text-navy-deep border-gold shadow-gold'
                : 'bg-transparent text-foreground/70 border-border hover:border-gold/50 hover:text-gold'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                selectedCategory === cat.name
                  ? 'bg-gold text-navy-deep border-gold shadow-gold'
                  : 'bg-transparent text-foreground/70 border-border hover:border-gold/50 hover:text-gold'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(isSelected ? 'All' : cat.name)}
                className={`group flex flex-col items-center gap-3 p-5 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-gold/10 border-gold shadow-gold'
                    : 'bg-card border-border hover:border-gold/40 hover:bg-navy-light'
                }`}
              >
                <div className={`p-3 rounded-full transition-colors ${
                  isSelected ? 'bg-gold/20' : 'bg-navy-light group-hover:bg-gold/10'
                }`}>
                  <Icon size={24} className={isSelected ? 'text-gold' : 'text-sky group-hover:text-gold'} />
                </div>
                <div className="text-center">
                  <div className={`font-heading font-bold text-sm ${isSelected ? 'text-gold' : 'text-foreground'}`}>
                    {cat.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{cat.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
