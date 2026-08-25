import type { Metadata } from 'next';
import { getCityBySlug, getDistrictBySlug } from '@/lib/cities';
import { DistrictDetailClient } from '@/components/district-detail-client';

interface PageProps {
  params: Promise<{ city: string; district: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug, district: districtSlug } = await params;
  const city = getCityBySlug(citySlug);
  const district = getDistrictBySlug(citySlug, districtSlug);
  if (!city || !district) {
    return { title: 'District Not Found — NFT Real Estate' };
  }
  return {
    title: `Properties in ${district.name}, ${city.name} — NFT Real Estate`,
    description: `Browse properties for sale and rent in ${district.name}, ${city.name}. Find villas, apartments, houses, and more in ${district.name}.`,
    keywords: [`${district.name} real estate`, `properties in ${district.name}`, `${city.name} property`, 'Saudi Arabia real estate'],
  };
}

export default async function DistrictPage({ params }: PageProps) {
  const { city, district } = await params;
  return <DistrictDetailClient citySlug={city} districtSlug={district} />;
}
