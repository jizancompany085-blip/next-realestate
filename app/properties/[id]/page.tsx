import type { Metadata } from 'next';
import { getPropertyById } from '@/lib/properties';
import { PropertyDetailClient } from '@/components/property-detail-client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = getPropertyById(Number(id));
  if (!property) {
    return { title: 'Property Not Found — NFT Real Estate' };
  }
  return {
    title: `${property.title} — NFT Real Estate`,
    description: property.description,
    keywords: [property.type, property.city, property.district, 'Saudi Arabia real estate', property.purpose],
    openGraph: {
      title: property.title,
      description: property.description,
      images: [{ url: property.image }],
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <PropertyDetailClient propertyId={Number(id)} />;
}
