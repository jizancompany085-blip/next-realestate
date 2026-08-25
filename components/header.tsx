'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Heart, Building2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/components/locale-provider';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', key: 'home' as const },
  { href: '/properties', key: 'properties' as const },
  { href: '/buy', key: 'buy' as const },
  { href: '/rent', key: 'rent' as const },
  { href: '/cities', key: 'cities' as const },
  { href: '/contact', key: 'contact' as const },
];

export function Header() {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Do not render public website header on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'glass border-b border-border/40 shadow-sm'
          : 'bg-background/95 backdrop-blur-sm'
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-transform group-hover:scale-105">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 dark:from-emerald-400 dark:to-white bg-clip-text text-transparent">
                NFT <span className="text-foreground font-bold">{locale === 'ar' ? 'العقارية' : 'Real Estate'}</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                    isActive
                      ? 'text-primary bg-accent'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {t(locale, link.key)}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/favorites"
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-accent transition-all"
              aria-label={t(locale, 'favorites')}
            >
              <Heart className="h-5 w-5" />
            </Link>

            <button
              onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-all"
              aria-label="Toggle language"
            >
              <Globe className="h-4 w-4" />
              <span>{locale === 'en' ? 'العربية' : 'English'}</span>
            </button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 pt-2 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-4 py-3 text-sm font-medium rounded-lg transition-all',
                      isActive
                        ? 'text-primary bg-accent'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {t(locale, link.key)}
                  </Link>
                );
              })}
              <Link
                href="/favorites"
                className="px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                {t(locale, 'favorites')}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
