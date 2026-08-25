'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { mockProperties } from '@/lib/properties';
import { cities as fallbackCities } from '@/lib/cities';
import type { City, Property, PropertyPurpose, PropertyType } from '@/lib/types';
import { PropertyCard } from '@/components/property-card';
import { PropertyMap } from '@/components/property-map';
import { useLocale } from '@/components/locale-provider';
import { t, formatPropertyType } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PropertyListingProps {
  defaultPurpose?: PropertyPurpose;
  title?: string;
  description?: string;
}

const propertyTypes: PropertyType[] = ['Apartment', 'Villa', 'House', 'Land', 'Commercial', 'Office', 'Shop'];

export function PropertyListing({ defaultPurpose, title, description }: PropertyListingProps) {
  const { locale } = useLocale();
  const searchParams = useSearchParams();

  const [propertiesList, setPropertiesList] = useState<Property[]>(mockProperties);
  const [citiesList, setCitiesList] = useState<City[]>(fallbackCities);

  const [purpose, setPurpose] = useState<string>(
    searchParams.get('purpose') || defaultPurpose || 'all'
  );
  const [city, setCity] = useState<string>(searchParams.get('city') || 'all');
  const [type, setType] = useState<string>(searchParams.get('type') || 'all');
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'priceAsc' | 'priceDesc'>('newest');
  const [focusedPropertyId, setFocusedPropertyId] = useState<number | null>(null);

  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleMarkerClick = (id: number) => {
    setFocusedPropertyId(id);
    const cardEl = cardRefs.current[id];
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  useEffect(() => {
    fetch('/api/properties')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPropertiesList(data);
        }
      })
      .catch(() => {});

    fetch('/api/cities')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCitiesList(data);
        }
      })
      .catch(() => {});
  }, []);

  const filteredProperties = useMemo(() => {
    return propertiesList
      .filter((p) => {
        if (purpose !== 'all' && p.purpose.toLowerCase() !== purpose.toLowerCase()) return false;
        if (city !== 'all' && p.city.toLowerCase() !== city.toLowerCase()) return false;
        if (type !== 'all' && p.type.toLowerCase() !== type.toLowerCase()) return false;
        if (search) {
          const q = search.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q) || (p.titleAr && p.titleAr.includes(q));
          const matchCity = p.city.toLowerCase().includes(q) || (p.cityAr && p.cityAr.includes(q));
          const matchDistrict = p.district.toLowerCase().includes(q) || (p.districtAr && p.districtAr.includes(q));
          if (!matchTitle && !matchCity && !matchDistrict) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      });
  }, [propertiesList, purpose, city, type, search, sortBy]);

  const resetFilters = () => {
    setPurpose(defaultPurpose || 'all');
    setCity('all');
    setType('all');
    setSearch('');
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">{title || t(locale, 'properties')}</h1>
        <p className="text-muted-foreground mt-1">
          {description || `${filteredProperties.length} ${locale === 'ar' ? 'عقار متاح' : 'properties available'}`}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t(locale, 'searchLocationPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Purpose */}
          <Select value={purpose} onValueChange={setPurpose}>
            <SelectTrigger>
              <SelectValue placeholder={t(locale, 'buyTab')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{locale === 'ar' ? 'الكل (شراء وإيجار)' : 'All (Sale & Rent)'}</SelectItem>
              <SelectItem value="Sale">{t(locale, 'forSale')}</SelectItem>
              <SelectItem value="Rent">{t(locale, 'forRent')}</SelectItem>
            </SelectContent>
          </Select>

          {/* City */}
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger>
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

          {/* Type */}
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
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

          {/* Reset */}
          <Button variant="outline" onClick={resetFilters} className="w-full">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {t(locale, 'resetFilters')}
          </Button>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border text-sm flex-wrap gap-3">
          <div className="text-muted-foreground">
            {filteredProperties.length} {locale === 'ar' ? 'نتيجة' : 'results'}
          </div>

          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="w-[180px] h-9 text-xs">
                <SelectValue placeholder={t(locale, 'sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t(locale, 'newest')}</SelectItem>
                <SelectItem value="priceAsc">{t(locale, 'priceLowHigh')}</SelectItem>
                <SelectItem value="priceDesc">{t(locale, 'priceHighLow')}</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex rounded-lg border border-border p-1 bg-muted">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
                }`}
              >
                {locale === 'ar' ? 'شبكة' : 'Grid'}
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  viewMode === 'map' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
                }`}
              >
                {locale === 'ar' ? 'خريطة' : 'Map'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredProperties.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Scrollable cards list */}
            <div className="lg:col-span-5 max-h-[680px] overflow-y-auto space-y-4 pr-1 p-1 rounded-2xl">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  ref={(el) => {
                    cardRefs.current[property.id] = el;
                  }}
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
            {/* Map */}
            <div className="lg:col-span-7 sticky top-20">
              <PropertyMap
                properties={filteredProperties}
                focusedPropertyId={focusedPropertyId}
                onMarkerClick={handleMarkerClick}
                height="680px"
              />
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-card border border-border">
          <p className="text-lg font-semibold mb-2">{t(locale, 'noResults')}</p>
          <p className="text-muted-foreground mb-4">{t(locale, 'noResultsDesc')}</p>
          <Button onClick={resetFilters}>{t(locale, 'resetFilters')}</Button>
        </div>
      )}
    </div>
  );
}

