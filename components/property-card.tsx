'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bed, Bath, Maximize, MapPin, Star, Heart } from 'lucide-react';
import type { Property } from '@/lib/types';
import { useLocale } from '@/components/locale-provider';
import { t, formatPrice, formatArea, formatPropertyType } from '@/lib/i18n';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  id?: string;
  property: Property;
  onHover?: (id: number | null) => void;
  onClick?: (id: number) => void;
  className?: string;
}

export function PropertyCard({ id, property, onHover, onClick, className }: PropertyCardProps) {
  const { locale } = useLocale();
  const { isFavorite, toggleFavorite, mounted } = useFavorites();
  const [imgLoaded, setImgLoaded] = useState(false);

  const isFav = mounted && isFavorite(property.id);
  const title = locale === 'ar' ? property.titleAr : property.title;
  const city = locale === 'ar' ? property.cityAr : property.city;
  const district = locale === 'ar' ? property.districtAr : property.district;

  return (
    <Link
      href={`/properties/${property.id}`}
      id={id}
      className={cn(
        'group block overflow-hidden rounded-2xl bg-card border border-border transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1',
        className
      )}
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onClick?.(property.id)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {!imgLoaded && <div className="absolute inset-0 shimmer" />}
        <img
          src={property.image}
          alt={title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            setImgLoaded(true);
            (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800';
          }}
          className={cn(
            'h-full w-full object-cover transition-transform duration-500 group-hover:scale-110',
            imgLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* Purpose badge */}
        <div className="absolute top-3 left-3">
          <span
            className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md',
              property.purpose === 'Sale' ? 'bg-primary' : 'bg-blue-600'
            )}
          >
            {property.purpose === 'Sale' ? t(locale, 'forSale') : t(locale, 'forRent')}
          </span>
        </div>

        {/* Type badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
            {formatPropertyType(property.type, locale)}
          </span>
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:scale-110 transition-transform"
          aria-label={isFav ? t(locale, 'removeFavorite') : t(locale, 'addFavorite')}
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-all',
              isFav ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
            )}
          />
        </button>

        {/* Rating */}
        {property.rating && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-sm">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{property.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{district}, {city}</span>
        </div>

        {/* Price */}
        <div className="mt-3">
          <span className="text-lg font-bold text-primary">
            {formatPrice(property.price, locale, property.purpose)}
          </span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            <span>{formatArea(property.area, locale)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
