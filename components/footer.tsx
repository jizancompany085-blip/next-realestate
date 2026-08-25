'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLocale } from '@/components/locale-provider';
import { t } from '@/lib/i18n';
import { cities } from '@/lib/cities';

export function Footer() {
  const pathname = usePathname();
  const { locale } = useLocale();

  if (pathname?.startsWith('/admin')) {
    return null;
  }
  const popularCities = cities.slice(0, 6);

  return (
    <footer className="border-t bg-card mt-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                NFT <span className="text-primary">{locale === 'ar' ? 'العقارية' : 'Real Estate'}</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(locale, 'aboutDesc')}
            </p>
            <div className="flex gap-3 mt-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                  aria-label="Social media"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t(locale, 'quickLinks')}</h3>
            <ul className="space-y-2">
              {[
                { href: '/', key: 'home' as const },
                { href: '/properties', key: 'properties' as const },
                { href: '/buy', key: 'buy' as const },
                { href: '/rent', key: 'rent' as const },
                { href: '/favorites', key: 'favorites' as const },
                { href: '/contact', key: 'contact' as const },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t(locale, link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Locations */}
          <div>
            <h3 className="font-semibold mb-4">{t(locale, 'popularLocations')}</h3>
            <ul className="space-y-2">
              {popularCities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/cities/${city.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    {locale === 'ar' ? city.nameAr : city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">{t(locale, 'contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span dir="ltr">+966 11 234 5678</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@nftrealestate.sa</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>
                  {locale === 'ar'
                    ? 'طريق الملك فهد، الرياض، المملكة العربية السعودية'
                    : 'King Fahd Road, Riyadh, Saudi Arabia'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} NFT Real Estate. {t(locale, 'copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
