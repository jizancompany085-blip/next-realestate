'use client';

import { useState, useEffect } from 'react';
import { CityCard } from '@/components/city-card';
import { useLocale } from '@/components/locale-provider';
import { t } from '@/lib/i18n';
import { cities as fallbackCities } from '@/lib/cities';
import type { City } from '@/lib/types';

export default function CitiesPage() {
  const { locale } = useLocale();
  const [cities, setCities] = useState<City[]>(fallbackCities);

  useEffect(() => {
    fetch('/api/cities')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCities(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">{t(locale, 'allCitiesTitle')}</h1>
        <p className="text-muted-foreground mt-1">{t(locale, 'allCitiesDesc')}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cities.map((city) => (
          <CityCard key={city.slug} city={city} />
        ))}
      </div>
    </div>
  );
}

