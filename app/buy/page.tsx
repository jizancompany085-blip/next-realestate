import { Suspense } from 'react';
import { PropertyListing } from '@/components/property-listing';

export const metadata = {
  title: 'Properties for Sale — NFT Real Estate',
  description: 'Browse properties for sale across Saudi Arabia with NFT Real Estate',
};

export default function BuyPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center">Loading properties...</div>}>
      <PropertyListing defaultPurpose="Sale" title="Properties for Sale" description="Find your dream property to buy across Saudi Arabia" />
    </Suspense>
  );
}
