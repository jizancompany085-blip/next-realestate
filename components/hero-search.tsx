'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocale } from '@/components/locale-provider';
import { t, formatPropertyType } from '@/lib/i18n';
import { cities as fallbackCities } from '@/lib/cities';
import type { City, PropertyPurpose, PropertyType } from '@/lib/types';

const propertyTypes: PropertyType[] = ['Apartment', 'Villa', 'House', 'Land', 'Commercial', 'Office', 'Shop'];

export function HeroSearch() {
  const { locale } = useLocale();
  const router = useRouter();
  const [purpose, setPurpose] = useState<PropertyPurpose>('Sale');
  const [city, setCity] = useState('all');
  const [type, setType] = useState('all');
  const [search, setSearch] = useState('');
  const [citiesList, setCitiesList] = useState<City[]>(fallbackCities);

  useEffect(() => {
    fetch('/api/cities')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCitiesList(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('purpose', purpose);
    if (city !== 'all') params.set('city', city);
    if (type !== 'all') params.set('type', type);
    if (search) params.set('search', search);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Buy/Rent tab toggle */}
      <div className="flex w-full max-w-xs p-1 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20 mb-4 shadow-xl">
        <button
          type="button"
          onClick={() => setPurpose('Sale')}
          className={`flex-1 py-2.5 px-6 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
            purpose === 'Sale'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400/50'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          {t(locale, 'buyTab')}
        </button>
        <button
          type="button"
          onClick={() => setPurpose('Rent')}
          className={`flex-1 py-2.5 px-6 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
            purpose === 'Rent'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400/50'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          {t(locale, 'rentTab')}
        </button>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 text-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Location search */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {t(locale, 'searchLocation')}
            </label>
            <Input
              type="text"
              placeholder={t(locale, 'searchLocationPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-border text-foreground"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          {/* City select */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {t(locale, 'allCities')}
            </label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="border-border text-foreground">
                <SelectValue placeholder={t(locale, 'allCities')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t(locale, 'allCities')}</SelectItem>
                {citiesList.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {locale === 'ar' ? c.nameAr : c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Property type */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Home className="h-3 w-3" />
              {t(locale, 'propertyType')}
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="border-border text-foreground">
                <SelectValue placeholder={t(locale, 'allTypes')}>
                  {type !== 'all' ? formatPropertyType(type, locale) : t(locale, 'allTypes')}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t(locale, 'allTypes')}</SelectItem>
                {propertyTypes.map((pt) => (
                  <SelectItem key={pt} value={pt}>
                    {formatPropertyType(pt, locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search button */}
          <div className="space-y-1.5 flex items-end">
            <Button
              onClick={handleSearch}
              className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              size="lg"
            >
              <Search className="h-4 w-4 mr-2" />
              {t(locale, 'searchButton')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
