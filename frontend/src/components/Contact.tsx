import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSubmitContact } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync: submitContact, isPending } = useSubmitContact();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitContact({ name, email, message });
      setSubmitted(true);
      toast.success(t('contactSuccess'));
    } catch {
      toast.error(t('contactError'));
    }
  };

  if (submitted) {
    return (
      <section id="contact" className="py-16 bg-navy-900">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
          <h2 className="font-rajdhani font-bold text-3xl text-white mb-3">{t('contactSuccess')}</h2>
          <p className="text-navy-400">{t('contactSuccessMsg')}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-16 bg-navy-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Mail className="h-10 w-10 text-gold-400 mx-auto mb-3" />
          <h2 className="font-rajdhani font-bold text-3xl md:text-4xl text-white mb-3">
            {t('contactTitle')}
          </h2>
          <p className="text-navy-400">{t('contactSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-navy-800 border border-navy-700 rounded-2xl p-8 space-y-6">
          <div>
            <Label className="text-navy-200 font-rajdhani font-semibold mb-2 block">{t('nameLabel')}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('namePlaceholder')}
              required
              className="bg-navy-700 border-navy-600 text-white placeholder:text-navy-500 focus:border-gold-400"
            />
          </div>
          <div>
            <Label className="text-navy-200 font-rajdhani font-semibold mb-2 block">{t('emailLabel')}</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              required
              className="bg-navy-700 border-navy-600 text-white placeholder:text-navy-500 focus:border-gold-400"
            />
          </div>
          <div>
            <Label className="text-navy-200 font-rajdhani font-semibold mb-2 block">{t('messageLabel')}</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('messagePlaceholder')}
              required
              rows={5}
              className="bg-navy-700 border-navy-600 text-white placeholder:text-navy-500 focus:border-gold-400 resize-none"
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gold-400 hover:bg-gold-500 text-navy-900 font-rajdhani font-bold tracking-wide text-lg py-6"
          >
            {isPending ? t('submittingBtn') : t('submitBtn')}
          </Button>
        </form>
      </div>
    </section>
  );
}
