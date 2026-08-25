import { Suspense } from 'react';
import { PropertyListing } from '@/components/property-listing';

export const metadata = {
  title: 'All Properties — NFT Real Estate',
  description: 'Browse all luxury properties for sale and rent across Saudi Arabia with NFT Real Estate',
};

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center">Loading properties...</div>}>
      <PropertyListing />
    </Suspense>
  );
}
