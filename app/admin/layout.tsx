'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Building2,
  LayoutDashboard,
  Home,
  MapPin,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Plus,
  Globe,
  Palette,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/components/locale-provider';
import { AdminThemeProvider, useAdminTheme, AdminTheme } from '@/components/admin-theme-provider';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale, dir } = useLocale();
  const { theme, setTheme } = useAdminTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  // Skip layout wrapper for login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const sidebarLinks = [
    { href: '/admin', key: 'adminDashboard' as const, icon: LayoutDashboard, exact: true },
    { href: '/admin/properties', key: 'adminProperties' as const, icon: Home },
    { href: '/admin/cities', key: 'adminCities' as const, icon: MapPin },
    { href: '/admin/inquiries', key: 'adminInquiries' as const, icon: MessageSquare },
    { href: '/admin/settings', key: 'adminSettings' as const, icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      toast.success(locale === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully');
      router.push('/admin/login');
      router.refresh();
    } catch {
      toast.error('Logout failed');
    }
  };

  const themeClasses = {
    dark: {
      bg: 'bg-slate-950 text-slate-100',
      sidebar: 'bg-slate-900/90 border-slate-800',
      header: 'bg-slate-900 border-slate-800',
      main: 'bg-slate-950',
    },
    light: {
      bg: 'bg-slate-100 text-slate-900',
      sidebar: 'bg-white border-slate-200 text-slate-900 shadow-sm',
      header: 'bg-white border-slate-200',
      main: 'bg-slate-50',
    },
    blue: {
      bg: 'bg-slate-950 text-blue-100',
      sidebar: 'bg-blue-950/90 border-blue-900 text-blue-100',
      header: 'bg-blue-950 border-blue-900',
      main: 'bg-slate-950',
    },
    black: {
      bg: 'bg-black text-neutral-100',
      sidebar: 'bg-neutral-900 border-neutral-800 text-neutral-100',
      header: 'bg-neutral-900 border-neutral-800',
      main: 'bg-black',
    },
  }[theme];

  return (
    <div dir={dir} className={cn('min-h-screen flex flex-col md:flex-row transition-colors duration-300', themeClasses.bg)}>
      {/* Sidebar Desktop */}
      <aside className={cn('hidden md:flex flex-col w-64 border-r ltr:border-r rtl:border-r-0 rtl:border-l p-4 shrink-0 transition-colors', themeClasses.sidebar)}>
        {/* Logo */}
        <div className="flex items-center justify-between px-3 py-3 mb-6 border-b border-slate-800/40">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight">NFT KSA</span>
              <span className="block text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                {t(locale, 'adminConsole')}
              </span>
            </div>
          </Link>

          {/* Language Toggle */}
          <button
            onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg bg-slate-800/60 border border-slate-700 text-slate-300 hover:text-white transition-all"
            title="Switch Language"
          >
            <Globe className="h-3.5 w-3.5 text-emerald-400" />
            <span>{locale === 'en' ? 'عربي' : 'EN'}</span>
          </button>
        </div>

        {/* Theme Picker Dropdown */}
        <div className="mb-4 relative">
          <button
            onClick={() => setShowThemePicker(!showThemePicker)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-emerald-500/40 transition-all"
          >
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-emerald-400" />
              <span>
                {locale === 'ar' ? 'المظهر:' : 'Theme:'}{' '}
                <strong className="capitalize">{theme}</strong>
              </span>
            </div>
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          </button>

          {showThemePicker && (
            <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-50 space-y-1">
              {[
                { id: 'dark', label: locale === 'ar' ? 'داكن (Slate)' : 'Dark Slate', icon: Moon },
                { id: 'black', label: locale === 'ar' ? 'أسود فاخر (OLED)' : 'OLED Black', icon: Sparkles },
                { id: 'blue', label: locale === 'ar' ? 'أزرق ملكي (Navy)' : 'Royal Navy', icon: Sparkles },
                { id: 'light', label: locale === 'ar' ? 'فاتح (White)' : 'Clean Light', icon: Sun },
              ].map((tItem) => {
                const Icon = tItem.icon;
                return (
                  <button
                    key={tItem.id}
                    onClick={() => {
                      setTheme(tItem.id as AdminTheme);
                      setShowThemePicker(false);
                      toast.success(`Theme changed to ${tItem.id}`);
                    }}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-all text-start',
                      theme === tItem.id
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tItem.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all',
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{t(locale, link.key)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Add & View Public Site */}
        <div className="my-4 pt-4 border-t border-slate-800/40 space-y-2">
          <Link href="/admin/properties/new">
            <Button className="w-full bg-slate-800/80 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-semibold justify-start gap-2">
              <Plus className="h-4 w-4" />
              <span>{t(locale, 'addProperty')}</span>
            </Button>
          </Link>
          <Link href="/" target="_blank">
            <Button variant="ghost" className="w-full text-slate-400 hover:text-slate-200 text-xs justify-start gap-2">
              <ExternalLink className="h-4 w-4" />
              <span>{t(locale, 'viewPublicSite')}</span>
            </Button>
          </Link>
        </div>

        {/* User Profile & Logout */}
        <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0">
              AD
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold truncate">{t(locale, 'adminUser')}</p>
              <p className="text-[10px] text-slate-400 truncate">admin@NFTksa.com</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            title={t(locale, 'logout')}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className={cn('md:hidden flex items-center justify-between p-4 border-b sticky top-0 z-50', themeClasses.header)}>
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm">NFT KSA Admin</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-slate-800/60 text-slate-300"
          >
            <Globe className="h-3.5 w-3.5 text-emerald-400" />
            <span>{locale === 'en' ? 'عربي' : 'EN'}</span>
          </button>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className={cn('md:hidden border-b p-4 space-y-2', themeClasses.header)}>
          {sidebarLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all',
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{t(locale, link.key)}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Main Content */}
      <main className={cn('flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-colors', themeClasses.main)}>
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminThemeProvider>
  );
}
