'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Property } from '@/lib/types';
import { PropertyCard } from '@/components/property-card';
import { useLocale } from '@/components/locale-provider';
import { Button } from '@/components/ui/button';

interface PropertyCarouselProps {
  properties: Property[];
  title: string;
  description?: string;
}

export function PropertyCarousel({ properties, title, description }: PropertyCarouselProps) {
  const { locale } = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      const actualScroll = locale === 'ar' ? -scrollAmount : scrollAmount;
      scrollRef.current.scrollBy({ left: actualScroll, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="rounded-full"
            aria-label="Scroll left"
          >
            <ChevronLeft className={locale === 'ar' ? 'rotate-180' : ''} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="rounded-full"
            aria-label="Scroll right"
          >
            <ChevronRight className={locale === 'ar' ? 'rotate-180' : ''} />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {properties.map((property) => (
          <div key={property.id} className="min-w-[280px] sm:min-w-[320px] max-w-[340px] flex-shrink-0 snap-start">
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </div>
  );
}
