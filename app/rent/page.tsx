import { Suspense } from 'react';
import { PropertyListing } from '@/components/property-listing';

export const metadata = {
  title: 'Properties for Rent — NFT Real Estate',
  description: 'Browse rental properties across Saudi Arabia with NFT Real Estate',
};

export default function RentPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center">Loading properties...</div>}>
      <PropertyListing defaultPurpose="Rent" title="Properties for Rent" description="Find rental properties across Saudi Arabia" />
    </Suspense>
  );
}
