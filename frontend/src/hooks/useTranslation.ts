import { useLanguage } from '@/contexts/LanguageContext';
import { translations, TranslationKey } from '@/utils/translations';

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: TranslationKey): string => {
    const langTranslations = translations[language] as Record<string, string>;
    const enTranslations = translations.en as Record<string, string>;
    return langTranslations[key] ?? enTranslations[key] ?? key;
  };

  return { t, language };
}
