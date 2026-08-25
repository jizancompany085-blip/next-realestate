export type PropertyType = 'Apartment' | 'Villa' | 'House' | 'Land' | 'Commercial' | 'Office' | 'Shop';
export type PropertyPurpose = 'Sale' | 'Rent';

export interface Property {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  type: PropertyType;
  purpose: PropertyPurpose;
  city: string;
  cityAr: string;
  district: string;
  districtAr: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  images?: string[];
  features?: string[];
  featuresAr?: string[];
  latitude: number;
  longitude: number;
  featured?: boolean;
  createdAt?: string;
  rating?: number;
}

export interface District {
  slug: string;
  name: string;
  nameAr: string;
  city: string;
  cityAr: string;
  latitude: number;
  longitude: number;
}

export interface City {
  slug: string;
  name: string;
  nameAr: string;
  region: string;
  regionAr: string;
  image: string;
  latitude: number;
  longitude: number;
  popularDistricts: District[];
}
