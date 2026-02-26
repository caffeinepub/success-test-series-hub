import { useState } from 'react';
import { Send, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { useSubmitContact } from '../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const { mutate: submitContact, isPending } = useSubmitContact();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    submitContact(
      { name: name.trim(), email: email.trim(), message: message.trim() },
      {
        onSuccess: () => {
          setSuccess(true);
          setName('');
          setEmail('');
          setMessage('');
          toast.success('Message sent successfully!', {
            description: "We'll get back to you soon.",
          });
        },
        onError: () => {
          toast.error('Failed to send message. Please try again.');
        },
      }
    );
  };

  return (
    <section id="contact" className="py-16 bg-navy-mid">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-4xl font-bold text-foreground mb-2">
            Contact <span className="text-gold">Us</span>
          </h2>
          <p className="text-muted-foreground">Have questions? We'd love to hear from you.</p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="card-navy p-8">
            {success ? (
              <div className="text-center py-8 animate-fade-in">
                <CheckCircle2 size={56} className="text-success mx-auto mb-4" />
                <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-6">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-gold hover:underline text-sm font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="contact-name" className="text-foreground font-semibold text-sm">
                    Name
                  </Label>
                  <Input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="bg-navy-deep border-border text-foreground placeholder:text-muted-foreground focus:border-gold/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-email" className="text-foreground font-semibold text-sm">
                    Email
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="bg-navy-deep border-border text-foreground placeholder:text-muted-foreground focus:border-gold/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-message" className="text-foreground font-semibold text-sm">
                    Message
                  </Label>
                  <Textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    rows={5}
                    required
                    className="bg-navy-deep border-border text-foreground placeholder:text-muted-foreground resize-none focus:border-gold/60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending || !name.trim() || !email.trim() || !message.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 bg-success text-success-foreground font-bold py-3 rounded-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
