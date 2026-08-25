'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/components/locale-provider';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';

export default function ContactPage() {
  const { locale } = useLocale();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      toast.success(
        locale === 'ar' ? 'تم إرسال رسالتك بنجاح' : 'Your message has been sent successfully'
      );
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch {
      toast.error(
        locale === 'ar' ? 'حدث خطأ أثناء الإرسال' : 'Failed to send message. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold">{t(locale, 'contactTitle')}</h1>
        <p className="text-muted-foreground mt-1">{t(locale, 'contactDesc')}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Contact info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">{t(locale, 'ourOffice')}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{locale === 'ar' ? 'العنوان' : 'Address'}</p>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ar'
                      ? 'طريق الملك فهد، الرياض، المملكة العربية السعودية'
                      : 'King Fahd Road, Riyadh, Saudi Arabia'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t(locale, 'phone')}</p>
                  <p className="text-sm text-muted-foreground" dir="ltr">+966 11 234 5678</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t(locale, 'email')}</p>
                  <p className="text-sm text-muted-foreground">info@NFTksa.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden border border-border h-[300px] bg-muted">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=46.65%2C24.68%2C46.70%2C24.74&layer=mapnik&marker=24.7136%2C46.6753"
              className="h-full w-full"
              loading="lazy"
              title="Office location"
            />
          </div>
        </div>

        {/* Contact form */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t(locale, 'name')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={locale === 'ar' ? 'اسمك' : 'Your name'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t(locale, 'email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t(locale, 'phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+966 5X XXX XXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">{t(locale, 'message')}</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                placeholder={locale === 'ar' ? 'رسالتك...' : 'Your message...'}
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full" size="lg">
              <Send className="h-4 w-4 mr-2" />
              {submitting ? 'Sending...' : t(locale, 'sendMessage')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
