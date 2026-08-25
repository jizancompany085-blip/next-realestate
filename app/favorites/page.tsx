'use client';

import Link from 'next/link';
import { Heart, Search } from 'lucide-react';
import { PropertyCard } from '@/components/property-card';
import { useLocale } from '@/components/locale-provider';
import { useFavorites } from '@/hooks/use-favorites';
import { t } from '@/lib/i18n';
import { properties } from '@/lib/properties';
import { Button } from '@/components/ui/button';

export default function FavoritesPage() {
  const { locale } = useLocale();
  const { favorites, mounted } = useFavorites();

  const savedProperties = properties.filter((p) => favorites.includes(p.id));

  if (!mounted) {
    return (
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 w-48 shimmer rounded-lg mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 shimmer rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Heart className="h-7 w-7 text-primary" />
          {t(locale, 'favoritesTitle')}
        </h1>
        <p className="text-muted-foreground mt-1">{t(locale, 'favoritesDesc')}</p>
      </div>

      {savedProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {savedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t(locale, 'noFavorites')}</h3>
          <p className="text-muted-foreground mb-6">{t(locale, 'noFavoritesDesc')}</p>
          <Link href="/properties">
            <Button>
              <Search className="h-4 w-4 mr-2" />
              {t(locale, 'browseProperties')}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
