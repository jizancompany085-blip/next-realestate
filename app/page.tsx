'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, Home, Landmark, Store, Briefcase, Warehouse, TreePine, ArrowRight, MapPin } from 'lucide-react';
import { HeroSearch } from '@/components/hero-search';
import { CityCard } from '@/components/city-card';
import { PropertyCard } from '@/components/property-card';
import { PropertyCarousel } from '@/components/property-carousel';
import { PropertyMap } from '@/components/property-map';
import { useLocale } from '@/components/locale-provider';
import { t } from '@/lib/i18n';
import { cities as fallbackCities } from '@/lib/cities';
import type { City } from '@/lib/types';
import { getFeaturedProperties, getLatestProperties, properties } from '@/lib/properties';
import type { PropertyType } from '@/lib/types';
import { Button } from '@/components/ui/button';

const categoryIcons: Record<string, typeof Building2> = {
  Apartment: Home,
  Villa: Building2,
  House: Landmark,
  Land: TreePine,
  Commercial: Store,
  Office: Briefcase,
  Shop: Warehouse,
};

export default function HomePage() {
  const { locale } = useLocale();
  const [focusedPropertyId, setFocusedPropertyId] = useState<number | null>(null);
  const [citiesList, setCitiesList] = useState<City[]>(fallbackCities);
  const [propertiesList, setPropertiesList] = useState<any[]>(properties);

  useEffect(() => {
    fetch('/api/cities')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCitiesList(data);
        }
      })
      .catch(() => {});

    fetch('/api/properties')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPropertiesList(data);
        }
      })
      .catch(() => {});
  }, []);

  const featured = propertiesList.filter((p) => p.featured);
  const latest = propertiesList.slice(0, 8);
  const popularCities = citiesList.slice(0, 8);
  const allDistricts = citiesList.flatMap((c) => c.popularDistricts || []).slice(0, 10);

  const propertyTypes: { type: PropertyType; label: string; labelAr: string }[] = [
    { type: 'Apartment', label: 'Apartment', labelAr: 'شقة' },
    { type: 'Villa', label: 'Villa', labelAr: 'فيلا' },
    { type: 'House', label: 'House', labelAr: 'منزل' },
    { type: 'Land', label: 'Land', labelAr: 'أرض' },
    { type: 'Commercial', label: 'Commercial', labelAr: 'تجاري' },
    { type: 'Office', label: 'Office', labelAr: 'مكتب' },
    { type: 'Shop', label: 'Shop', labelAr: 'محل' },
  ];

  const categoryCounts = propertyTypes.map((pt) => ({
    ...pt,
    count: propertiesList.filter((p) => p.type === pt.type).length,
  }));

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/38096888/pexels-photo-38096888.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Saudi Arabia skyline"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/60 to-slate-900/80" />
        </div>

        <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
              <MapPin className="h-4 w-4" />
              <span>{locale === 'ar' ? 'كل المدن السعودية' : 'All Saudi Cities'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance max-w-4xl mx-auto leading-tight">
              {t(locale, 'heroTitle')}
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl mx-auto">
              {t(locale, 'heroSubtitle')}
            </p>
          </div>

          <HeroSearch />
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-16 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{t(locale, 'popularCities')}</h2>
            <p className="text-muted-foreground mt-1">{t(locale, 'popularCitiesDesc')}</p>
          </div>
          <Link href="/cities">
            <Button variant="outline" className="hidden sm:flex">
              {locale === 'ar' ? 'عرض الكل' : 'View All'}
              <ArrowRight className={locale === 'ar' ? 'h-4 w-4 mr-2 rotate-180' : 'h-4 w-4 ml-2'} />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {popularCities.map((city) => (
            <CityCard key={city.slug} city={city} />
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PropertyCarousel
            properties={featured}
            title={t(locale, 'featuredProperties')}
            description={t(locale, 'featuredPropertiesDesc')}
          />
        </div>
      </section>

      {/* Latest Properties */}
      <section className="py-16 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{t(locale, 'latestProperties')}</h2>
            <p className="text-muted-foreground mt-1">{t(locale, 'latestPropertiesDesc')}</p>
          </div>
          <Link href="/properties">
            <Button variant="outline" className="hidden sm:flex">
              {locale === 'ar' ? 'عرض الكل' : 'View All'}
              <ArrowRight className={locale === 'ar' ? 'h-4 w-4 mr-2 rotate-180' : 'h-4 w-4 ml-2'} />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {latest.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">{t(locale, 'interactiveMap')}</h2>
            <p className="text-muted-foreground mt-1">{t(locale, 'interactiveMapDesc')}</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 sticky top-20">
              <PropertyMap
                properties={propertiesList}
                focusedPropertyId={focusedPropertyId}
                onMarkerClick={(id) => {
                  setFocusedPropertyId(id);
                  const el = document.getElementById(`home-card-${id}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }}
                height="500px"
              />
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto p-1 rounded-2xl">
              {propertiesList.slice(0, 8).map((property) => (
                <div
                  key={property.id}
                  id={`home-card-${property.id}`}
                  onMouseEnter={() => setFocusedPropertyId(property.id)}
                  onClick={() => setFocusedPropertyId(property.id)}
                  className={`transition-all duration-300 rounded-2xl cursor-pointer ${
                    focusedPropertyId === property.id
                      ? 'ring-2 ring-emerald-500 shadow-xl border-emerald-500 bg-emerald-500/5 scale-[1.01]'
                      : 'hover:border-primary/40'
                  }`}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Districts */}
      <section className="py-16 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{t(locale, 'popularDistricts')}</h2>
          <p className="text-muted-foreground mt-1">{t(locale, 'popularDistrictsDesc')}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {allDistricts.map((district) => {
            const city = citiesList.find((c) => c.name === district.city);
            return (
              <Link
                key={`${district.city}-${district.slug}`}
                href={`/cities/${city?.slug}/${district.slug}`}
                className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">{locale === 'ar' ? district.nameAr : district.name}</p>
                  <p className="text-xs text-muted-foreground">{locale === 'ar' ? district.cityAr : district.city}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">{t(locale, 'categories')}</h2>
            <p className="text-muted-foreground mt-1">{t(locale, 'categoriesDesc')}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {categoryCounts.map((cat) => {
              const Icon = categoryIcons[cat.type] || Building2;
              return (
                <Link
                  key={cat.type}
                  href={`/properties?type=${cat.type}`}
                  className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all mb-3">
                    <Icon className="h-7 w-7" />
                  </div>
                  <p className="font-medium text-sm">{locale === 'ar' ? cat.labelAr : cat.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.count} {locale === 'ar' ? 'عقار' : 'listings'}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-teal-700 via-emerald-700 to-teal-800">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t(locale, 'ctaTitle')}
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            {t(locale, 'ctaDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                {t(locale, 'browseProperties')}
                <ArrowRight className={locale === 'ar' ? 'h-4 w-4 mr-2 rotate-180' : 'h-4 w-4 ml-2'} />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white">
                {t(locale, 'contactUs')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
