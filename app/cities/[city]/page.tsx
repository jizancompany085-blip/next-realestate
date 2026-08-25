import type { Metadata } from 'next';
import { getCityBySlug } from '@/lib/cities';
import { CityDetailClient } from '@/components/city-detail-client';

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  if (!city) {
    return { title: 'City Not Found — NFT Real Estate' };
  }
  return {
    title: `Properties in ${city.name} — NFT Real Estate`,
    description: `Browse properties for sale and rent in ${city.name}, ${city.region}. Find villas, apartments, houses, and more in ${city.name}.`,
    keywords: [`${city.name} real estate`, `properties in ${city.name}`, `${city.name} property`, 'Saudi Arabia real estate'],
  };
}

export default async function CityPage({ params }: PageProps) {
  const { city } = await params;
  return <CityDetailClient citySlug={city} />;
}
