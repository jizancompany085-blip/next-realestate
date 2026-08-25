'use client';

import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import type { City } from '@/lib/types';
import { useLocale } from '@/components/locale-provider';
import { properties } from '@/lib/properties';
import { cn } from '@/lib/utils';

interface CityCardProps {
  city: City;
  className?: string;
}

const FALLBACK_CITY_IMAGE = 'https://images.pexels.com/photos/38096888/pexels-photo-38096888.jpeg?auto=compress&cs=tinysrgb&w=800';

export function CityCard({ city, className }: CityCardProps) {
  const { locale } = useLocale();
  const count = properties.filter((p) => p.city.toLowerCase() === city.name.toLowerCase()).length;
  const name = locale === 'ar' ? city.nameAr : city.name;
  const region = locale === 'ar' ? city.regionAr : city.region;

  return (
    <Link
      href={`/cities/${city.slug}`}
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-card border border-border transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1',
        className
      )}
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={city.image || FALLBACK_CITY_IMAGE}
          alt={name}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_CITY_IMAGE;
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <div className="flex items-center gap-1.5 text-white/80 text-xs mb-1">
          <MapPin className="h-3 w-3" />
          <span>{region}</span>
        </div>
        <h3 className="text-lg font-bold text-white">{name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-white/70">
            {count} {locale === 'ar' ? 'عقار' : 'properties'}
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white group-hover:bg-primary transition-all">
            {locale === 'ar' ? <ArrowRight className="h-4 w-4 rotate-180" /> : <ArrowRight className="h-4 w-4" />}
          </span>
        </div>
      </div>
    </Link>
  );
}
