'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Home,
  Building2,
  MapPin,
  MessageSquare,
  Plus,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Eye,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/components/locale-provider';
import { t, formatPrice } from '@/lib/i18n';
import { toast } from 'sonner';

interface Property {
  id: number;
  title: string;
  titleAr: string;
  price: number;
  type: string;
  purpose: string;
  cityName: string;
  districtName: string;
  featured: boolean;
  createdAt: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
  property?: { title: string };
}

export default function AdminDashboardPage() {
  const { locale } = useLocale();
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [citiesCount, setCitiesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [propsRes, inqRes, citiesRes] = await Promise.all([
        fetch('/api/admin/properties'),
        fetch('/api/admin/inquiries'),
        fetch('/api/admin/cities'),
      ]);

      if (propsRes.ok) setProperties(await propsRes.json());
      if (inqRes.ok) setInquiries(await inqRes.json());
      if (citiesRes.ok) {
        const cData = await citiesRes.json();
        setCitiesCount(cData.length);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const forSaleCount = properties.filter((p) => p.purpose === 'Sale').length;
  const forRentCount = properties.filter((p) => p.purpose === 'Rent').length;
  const unreadInquiriesCount = inquiries.filter((i) => i.status === 'UNREAD').length;
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {t(locale, 'dashboardOverview')}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {locale === 'ar'
              ? 'مرحباً بك! هذه نظرة عامة شاملة على سوق العقارات.'
              : 'Welcome back! Here is a summary of your real estate marketplace.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/properties/new">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2 shadow-lg shadow-emerald-600/20">
              <Plus className="h-4 w-4" /> {t(locale, 'addProperty')}
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Properties */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t(locale, 'totalProperties')}
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Home className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{properties.length}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-medium">{forSaleCount} {t(locale, 'forSale')}</span>
            <span>•</span>
            <span className="text-blue-400 font-medium">{forRentCount} {t(locale, 'forRent')}</span>
          </div>
        </div>

        {/* Cities Covered */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t(locale, 'saudiCities')}
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{citiesCount}</p>
          <p className="text-xs text-slate-400 mt-2">
            {locale === 'ar' ? 'المدن والمدن الرئيسية النشطة' : 'Active Saudi Metropolises'}
          </p>
        </div>

        {/* Inquiries Inbox */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t(locale, 'customerInquiries')}
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{inquiries.length}</p>
          <div className="flex items-center gap-2 mt-2 text-xs">
            {unreadInquiriesCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
                {unreadInquiriesCount} {locale === 'ar' ? 'غير مقروء' : 'Unread'}
              </span>
            ) : (
              <span className="text-slate-400">
                {locale === 'ar' ? 'تم قراءة جميع الرسائل' : 'All messages read'}
              </span>
            )}
          </div>
        </div>

        {/* Featured Listings */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t(locale, 'featuredPropertiesTitle')}
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Star className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">
            {properties.filter((p) => p.featured).length}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {locale === 'ar' ? 'معروضة في الصفحة الرئيسية' : 'Highlighted on Homepage'}
          </p>
        </div>
      </div>

      {/* Main Tables Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Properties (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{t(locale, 'recentListings')}</h2>
            <Link
              href="/admin/properties"
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              {locale === 'ar' ? 'عرض الكل' : 'View All'} <ArrowIcon className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                {locale === 'ar' ? 'جاري التحميل...' : 'Loading properties...'}
              </div>
            ) : properties.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                {locale === 'ar' ? 'لا توجد عقارات.' : 'No properties found.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start text-sm text-slate-300">
                  <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-4 text-start">{t(locale, 'properties')}</th>
                      <th className="p-4 text-start">{t(locale, 'cities')}</th>
                      <th className="p-4 text-start">{locale === 'ar' ? 'السعر' : 'Price'}</th>
                      <th className="p-4 text-start">{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                      <th className="p-4 text-end">{locale === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {properties.slice(0, 5).map((prop) => (
                      <tr key={prop.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-medium text-white max-w-xs truncate">
                          {locale === 'ar' ? prop.titleAr || prop.title : prop.title}
                        </td>
                        <td className="p-4 text-slate-400 text-xs">
                          {locale === 'ar' ? prop.districtName : prop.districtName},{' '}
                          {locale === 'ar' ? prop.cityName : prop.cityName}
                        </td>
                        <td className="p-4 font-semibold text-emerald-400">
                          {formatPrice(prop.price, locale, prop.purpose as any)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                              prop.purpose === 'Sale'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {prop.purpose === 'Sale' ? t(locale, 'forSale') : t(locale, 'forRent')}
                          </span>
                        </td>
                        <td className="p-4 text-end space-x-2 rtl:space-x-reverse">
                          <Link href={`/properties/${prop.id}`} target="_blank">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/properties/${prop.id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-400">
                              <TrendingUp className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Recent Inquiries (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{t(locale, 'recentInquiries')}</h2>
            <Link
              href="/admin/inquiries"
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              {locale === 'ar' ? 'صندوق الوارد' : 'Inbox'} <ArrowIcon className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            {loading ? (
              <div className="p-4 text-center text-slate-400 text-sm">
                {locale === 'ar' ? 'جاري التحميل...' : 'Loading inquiries...'}
              </div>
            ) : inquiries.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">
                {locale === 'ar' ? 'لا توجد رسائل جديدة.' : 'No messages yet.'}
              </div>
            ) : (
              inquiries.slice(0, 4).map((inq) => (
                <div
                  key={inq.id}
                  className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 hover:border-slate-700 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{inq.name}</span>
                    <span className="text-slate-500">
                      {new Date(inq.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{inq.message}</p>
                  {inq.property && (
                    <div className="text-[10px] text-emerald-400 font-medium truncate">
                      {locale === 'ar' ? 'بخصوص:' : 'Re:'} {inq.property.title}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
