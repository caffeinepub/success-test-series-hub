import { Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'success-test-series-hub'
  );

  return (
    <footer className="bg-navy-deep border-t border-gold/20">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/logo.dim_256x256.png"
              alt="Success Test Series Hub"
              className="h-9 w-9 rounded-full object-cover"
            />
            <div>
              <div className="font-heading font-bold text-gold text-sm">Success Test Series Hub</div>
              <div className="text-xs text-muted-foreground">India's Premier Exam Prep Platform</div>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span className="hover:text-gold cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-border">|</span>
            <span className="hover:text-gold cursor-pointer transition-colors">Terms & Conditions</span>
            <span className="text-border">|</span>
            <span className="hover:text-gold cursor-pointer transition-colors">Refund Policy</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {year} Success Test Series Hub. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with{' '}
            <Heart size={12} className="text-gold fill-gold mx-0.5" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
