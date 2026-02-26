import { Heart } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'sts-hub');

  return (
    <footer className="py-8" style={{ background: 'oklch(0.09 0.05 265)', borderTop: '1px solid oklch(0.26 0.07 265)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/logo.dim_256x256.png"
              alt="STS Hub"
              className="h-8 w-8 rounded-full object-cover ring-2 ring-gold/30"
            />
            <span className="text-sm" style={{ color: 'oklch(0.55 0.05 255)' }}>
              © {year} <span className="text-gold font-semibold">STS Hub</span>. {t('allRightsReserved')}
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm transition-colors hover:text-gold" style={{ color: 'oklch(0.55 0.05 255)' }}>
              {t('privacyPolicy')}
            </a>
            <a href="#" className="text-sm transition-colors hover:text-gold" style={{ color: 'oklch(0.55 0.05 255)' }}>
              {t('termsOfService')}
            </a>
          </div>

          {/* Attribution */}
          <div className="flex items-center gap-1.5 text-sm" style={{ color: 'oklch(0.50 0.04 255)' }}>
            <span>{t('builtWith')}</span>
            <Heart className="h-3.5 w-3.5 text-gold fill-gold" />
            <span>{t('using')}</span>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light font-semibold transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
