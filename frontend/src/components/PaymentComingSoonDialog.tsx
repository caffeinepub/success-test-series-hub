import { Wallet, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useTranslation } from '@/hooks/useTranslation';

interface PaymentComingSoonDialogProps {
  open: boolean;
  onClose: () => void;
  testTitle?: string;
  price?: number;
}

export default function PaymentComingSoonDialog({
  open,
  onClose,
  testTitle,
  price,
}: PaymentComingSoonDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-navy-mid border-border text-foreground max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center">
                <Wallet className="h-8 w-8 text-gold" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-sky/20 border border-sky/40 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-sky" />
              </div>
            </div>
          </div>
          <DialogTitle className="font-heading text-gold text-xl text-center">
            {t('paymentComingSoon')}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center space-y-2">
            {testTitle && price !== undefined && (
              <div className="bg-accent/30 border border-border rounded-lg px-4 py-3 mb-3">
                <p className="text-foreground font-semibold text-sm">{testTitle}</p>
                <p className="text-gold font-heading font-bold text-2xl mt-1">₹{price}</p>
              </div>
            )}
            <p>{t('paymentComingSoonMsg')}</p>
            <p className="text-xs text-muted-foreground mt-2">{t('paymentContactMsg')}</p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-2">
          <Button
            onClick={onClose}
            className="bg-gold hover:bg-gold-light text-navy-deep font-heading font-bold tracking-wide px-8"
          >
            {t('close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
