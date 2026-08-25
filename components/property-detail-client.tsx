'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bed, Bath, Maximize, MapPin, Heart, Share2, Phone, CheckCircle2, ChevronRight, MessageSquare } from 'lucide-react';
import { getPropertyById, getPropertiesByCity } from '@/lib/properties';
import { PropertyCard } from '@/components/property-card';
import { PropertyMap } from '@/components/property-map';
import { DistrictInfoCard } from '@/components/district-info-card';
import { useLocale } from '@/components/locale-provider';
import { t, formatPrice, formatPropertyType } from '@/lib/i18n';
import { useFavorites } from '@/hooks/use-favorites';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function PropertyDetailClient({ propertyId }: { propertyId: number }) {
  const { locale } = useLocale();
  const { isFavorite, toggleFavorite, mounted } = useFavorites();
  const [activeImage, setActiveImage] = useState(0);
  const [property, setProperty] = useState<any>(() => getPropertyById(propertyId));

  useEffect(() => {
    fetch(`/api/properties/${propertyId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !data.error) {
          setProperty(data);
        }
      })
      .catch(() => {});
  }, [propertyId]);

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Property Not Found</h1>
      </div>
    );
  }

  const isFav = mounted && isFavorite(property.id);
  const title = locale === 'ar' ? property.titleAr : property.title;
  const description = locale === 'ar' ? property.descriptionAr : property.description;
  const city = locale === 'ar' ? property.cityAr : property.city;
  const district = locale === 'ar' ? property.districtAr : property.district;
  const features = (locale === 'ar' ? property.featuresAr : property.features) || property.features || [];

  const gallery = property.images && property.images.length > 0 ? property.images : [property.image];
  const similar = getPropertiesByCity(property.city).filter((p: any) => p.id !== property.id).slice(0, 4);

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success(locale === 'ar' ? 'تم نسخ الرابط' : 'Link copied to clipboard');
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link href="/" className="hover:text-primary">{t(locale, 'home')}</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/properties" className="hover:text-primary">{t(locale, 'properties')}</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/cities/${property.city.toLowerCase()}`} className="hover:text-primary">{city}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium truncate max-w-xs">{title}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
              {property.purpose === 'Sale' ? t(locale, 'forSale') : t(locale, 'forRent')}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted">
              {formatPropertyType(property.type, locale)}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold">{title}</h1>
          <div className="flex items-center gap-1 mt-2 text-muted-foreground text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{district}, {city}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={handleShare} className="rounded-full">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => toggleFavorite(property.id)}
            className="rounded-full"
          >
            <Heart className={isFav ? 'h-4 w-4 fill-red-500 text-red-500' : 'h-4 w-4'} />
          </Button>
          <div className="text-right">
            <p className="text-2xl md:text-3xl font-bold text-primary">
              {formatPrice(property.price, locale, property.purpose)}
            </p>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
        <div className="lg:col-span-2 aspect-[16/10] overflow-hidden rounded-2xl bg-muted relative">
          <img
            src={gallery[activeImage]}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          {gallery.slice(0, 3).map((img: string, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`aspect-[16/10] overflow-hidden rounded-xl bg-muted border-2 transition-all ${
                activeImage === idx ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${title} ${idx + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Key specs */}
          <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-card border border-border">
            {property.bedrooms > 0 && (
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-muted/50 text-center">
                <Bed className="h-6 w-6 text-primary mb-1" />
                <span className="text-lg font-bold">{property.bedrooms}</span>
                <span className="text-xs text-muted-foreground">{t(locale, 'bedrooms')}</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-muted/50 text-center">
                <Bath className="h-6 w-6 text-primary mb-1" />
                <span className="text-lg font-bold">{property.bathrooms}</span>
                <span className="text-xs text-muted-foreground">{t(locale, 'bathrooms')}</span>
              </div>
            )}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-muted/50 text-center">
              <Maximize className="h-6 w-6 text-primary mb-1" />
              <span className="text-lg font-bold">{property.area}</span>
              <span className="text-xs text-muted-foreground">{t(locale, 'sqm')}</span>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
            <h3 className="text-xl font-bold">{t(locale, 'propertyDetails')}</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{description}</p>
          </div>

          {/* Features */}
          {features.length > 0 && (
            <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
              <h3 className="text-xl font-bold">{t(locale, 'featuresAndAmenities')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {features.map((feat: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location Map */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{t(locale, 'interactiveMap')}</h3>
            <PropertyMap
              properties={[property]}
              center={[property.longitude, property.latitude]}
              zoom={14}
              height="350px"
            />
          </div>

          {/* District Information & Reviews Section */}
          <DistrictInfoCard
            districtName={property.district}
            districtNameAr={property.districtAr}
            cityName={property.city}
            cityNameAr={property.cityAr}
          />
        </div>

        {/* Sidebar contact form */}
        <div>
          <div className="sticky top-24 p-6 rounded-2xl bg-card border border-border space-y-6 shadow-lg">
            <h3 className="text-xl font-bold">{t(locale, 'contactAgent')}</h3>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-extrabold text-sm shadow-md">
                NFT
              </div>
              <div>
                <p className="font-semibold">{t(locale, 'agentName')}</p>
                <p className="text-xs text-muted-foreground">
                  {locale === 'ar' ? 'وكيل NFT العقارية المعتمد' : 'NFT Real Estate Verified Agent'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <a href="tel:+966112345678" className="w-full">
                <Button className="w-full" size="lg">
                  <Phone className="h-4 w-4 mr-2" />
                  {t(locale, 'callNow')}
                </Button>
              </a>
              <a href="https://wa.me/966112345678" target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50" size="lg">
                  <MessageSquare className="h-4 w-4 mr-2 text-green-600" />
                  {t(locale, 'whatsapp')}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similar.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">{t(locale, 'similarProperties')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
