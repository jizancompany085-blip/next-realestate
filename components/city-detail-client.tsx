'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, MapPin } from 'lucide-react';
import { PropertyCard } from '@/components/property-card';
import { PropertyMap } from '@/components/property-map';
import { useLocale } from '@/components/locale-provider';
import { t } from '@/lib/i18n';
import { getCityBySlug } from '@/lib/cities';
import { getPropertiesByCity } from '@/lib/properties';
import type { City } from '@/lib/types';

export function CityDetailClient({ citySlug }: { citySlug: string }) {
  const { locale } = useLocale();
  const [focusedPropertyId, setFocusedPropertyId] = useState<number | null>(null);
  const fallback = getCityBySlug(citySlug);
  const [city, setCity] = useState<City | undefined>(fallback);

  useEffect(() => {
    fetch('/api/cities')
      .then((res) => (res.ok ? res.json() : null))
      .then((list: City[]) => {
        if (Array.isArray(list)) {
          const found = list.find((c) => c.slug.toLowerCase() === citySlug.toLowerCase());
          if (found) setCity(found);
        }
      })
      .catch(() => {});
  }, [citySlug]);

  if (!city) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">City Not Found</h1>
      </div>
    );
  }

  const [cityProperties, setCityProperties] = useState<any[]>(() => getPropertiesByCity(city.name));

  useEffect(() => {
    fetch(`/api/properties?city=${encodeURIComponent(city.name)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) {
          setCityProperties(data);
        }
      })
      .catch(() => {});
  }, [city.name]);

  const cityName = locale === 'ar' ? city.nameAr : city.name;
  const regionName = locale === 'ar' ? city.regionAr : city.region;

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">{t(locale, 'home')}</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/cities" className="hover:text-primary">{t(locale, 'cities')}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">{cityName}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <MapPin className="h-4 w-4" />
          <span>{regionName}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">
          {t(locale, 'propertiesIn')} {cityName}
        </h1>
        <p className="text-muted-foreground mt-1">
          {cityProperties.length} {locale === 'ar' ? 'عقار متاح' : 'properties available'}
        </p>
      </div>

      {cityProperties.length > 0 && (
        <div className="mb-8">
          <PropertyMap
            properties={cityProperties}
            focusedPropertyId={focusedPropertyId}
            onMarkerClick={(id) => {
              setFocusedPropertyId(id);
              const el = document.getElementById(`city-card-${id}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }}
            center={[city.longitude, city.latitude]}
            zoom={11}
            height="400px"
          />
        </div>
      )}

      {city.popularDistricts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">{t(locale, 'districtsIn')} {cityName}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {city.popularDistricts.map((district) => (
              <Link
                key={district.slug}
                href={`/cities/${city.slug}/${district.slug}`}
                className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">{locale === 'ar' ? district.nameAr : district.name}</p>
                  <p className="text-xs text-muted-foreground">{cityName}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {cityProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cityProperties.map((property) => (
            <div
              key={property.id}
              id={`city-card-${property.id}`}
              onMouseEnter={() => setFocusedPropertyId(property.id)}
              onClick={() => setFocusedPropertyId(property.id)}
              className={`transition-all duration-300 rounded-2xl cursor-pointer ${
                focusedPropertyId === property.id
                  ? 'ring-2 ring-emerald-500 shadow-xl border-emerald-500 bg-emerald-500/5 scale-[1.01]'
                  : ''
              }`}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold mb-2">{t(locale, 'noResults')}</p>
          <p className="text-muted-foreground">{t(locale, 'noResultsDesc')}</p>
        </div>
      )}
    </div>
  );
}
