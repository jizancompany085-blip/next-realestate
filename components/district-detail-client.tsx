'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, MapPin } from 'lucide-react';
import { PropertyCard } from '@/components/property-card';
import { PropertyMap } from '@/components/property-map';
import { DistrictInfoCard } from '@/components/district-info-card';
import { useLocale } from '@/components/locale-provider';
import { t } from '@/lib/i18n';
import { getCityBySlug, getDistrictBySlug } from '@/lib/cities';
import { getPropertiesByDistrict } from '@/lib/properties';

export function DistrictDetailClient({ citySlug, districtSlug }: { citySlug: string; districtSlug: string }) {
  const { locale } = useLocale();
  const [focusedPropertyId, setFocusedPropertyId] = useState<number | null>(null);

  const city = getCityBySlug(citySlug);
  const district = getDistrictBySlug(citySlug, districtSlug);
  if (!city || !district) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">District Not Found</h1>
      </div>
    );
  }

  const [districtProperties, setDistrictProperties] = useState<any[]>(() =>
    getPropertiesByDistrict(city.name, district.name)
  );

  useEffect(() => {
    fetch(`/api/properties?city=${encodeURIComponent(city.name)}&search=${encodeURIComponent(district.name)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) {
          setDistrictProperties(data);
        }
      })
      .catch(() => {});
  }, [city.name, district.name]);

  const districtName = locale === 'ar' ? district.nameAr : district.name;
  const cityName = locale === 'ar' ? city.nameAr : city.name;

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">{t(locale, 'home')}</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/cities" className="hover:text-primary">{t(locale, 'cities')}</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/cities/${city.slug}`} className="hover:text-primary">{cityName}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">{districtName}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <MapPin className="h-4 w-4" />
          <span>{districtName}, {cityName}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">
          {t(locale, 'propertiesIn')} {districtName}
        </h1>
        <p className="text-muted-foreground mt-1">
          {districtProperties.length} {locale === 'ar' ? 'عقار متاح' : 'properties available'}
        </p>
      </div>

      {districtProperties.length > 0 && (
        <div className="mb-8">
          <PropertyMap
            properties={districtProperties}
            focusedPropertyId={focusedPropertyId}
            onMarkerClick={(id) => {
              setFocusedPropertyId(id);
              const el = document.getElementById(`district-card-${id}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }}
            center={[district.longitude, district.latitude]}
            zoom={13}
            height="400px"
          />
        </div>
      )}

      {/* District Info Card matching user screenshot */}
      <DistrictInfoCard
        districtName={district.name}
        districtNameAr={district.nameAr}
        cityName={city.name}
        cityNameAr={city.nameAr}
      />

      {districtProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {districtProperties.map((property) => (
            <div
              key={property.id}
              id={`district-card-${property.id}`}
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
