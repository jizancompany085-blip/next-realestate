import type { City, District } from './types';
import { prisma } from './db/prisma';

export const cities: City[] = [
  {
    slug: 'riyadh',
    name: 'Riyadh',
    nameAr: 'الرياض',
    region: 'Riyadh Province',
    regionAr: 'منطقة الرياض',
    image: 'https://images.pexels.com/photos/38096888/pexels-photo-38096888.jpeg?auto=compress&cs=tinysrgb&w=800',
    latitude: 24.7136,
    longitude: 46.6753,
    popularDistricts: [
      { slug: 'al-olaya', name: 'Al Olaya', nameAr: 'العليا', city: 'Riyadh', cityAr: 'الرياض', latitude: 24.6946, longitude: 46.6845 },
      { slug: 'al-malqa', name: 'Al Malqa', nameAr: 'اللقاء', city: 'Riyadh', cityAr: 'الرياض', latitude: 24.8118, longitude: 46.6111 },
      { slug: 'al-yasmin', name: 'Al Yasmin', nameAr: 'الياسمين', city: 'Riyadh', cityAr: 'الرياض', latitude: 24.8322, longitude: 46.6433 },
      { slug: 'an-nakheel', name: 'An Nakheel', nameAr: 'النخيل', city: 'Riyadh', cityAr: 'الرياض', latitude: 24.7431, longitude: 46.6214 },
      { slug: 'hittin', name: 'Hittin', nameAr: 'حطين', city: 'Riyadh', cityAr: 'الرياض', latitude: 24.7725, longitude: 46.6042 },
    ],
  },
  {
    slug: 'jeddah',
    name: 'Jeddah',
    nameAr: 'جدة',
    region: 'Makkah Province',
    regionAr: 'منطقة مكة المكرمة',
    image: 'https://images.pexels.com/photos/15729780/pexels-photo-15729780/free-photo-of-modern-skyscrapers-and-palm-trees-in-city.jpeg?auto=compress&cs=tinysrgb&w=800',
    latitude: 21.5433,
    longitude: 39.1728,
    popularDistricts: [
      { slug: 'al-shati', name: 'Al Shati', nameAr: 'الشاطئ', city: 'Jeddah', cityAr: 'جدة', latitude: 21.5956, longitude: 39.1171 },
      { slug: 'al-hamra', name: 'Al Hamra', nameAr: 'الحمراء', city: 'Jeddah', cityAr: 'جدة', latitude: 21.5229, longitude: 39.1627 },
      { slug: 'obhur-al-shamaliyah', name: 'North Obhur', nameAr: 'أبحر الشمالية', city: 'Jeddah', cityAr: 'جدة', latitude: 21.7583, longitude: 39.1235 },
      { slug: 'al-rawdah', name: 'Al Rawdah', nameAr: 'الروضة', city: 'Jeddah', cityAr: 'جدة', latitude: 21.5645, longitude: 39.1554 },
    ],
  },
  {
    slug: 'dammam',
    name: 'Dammam',
    nameAr: 'الدمام',
    region: 'Eastern Province',
    regionAr: 'المنطقة الشرقية',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
    latitude: 26.4207,
    longitude: 50.0888,
    popularDistricts: [
      { slug: 'al-shatea', name: 'Al Shatea', nameAr: 'الشاطئ', city: 'Dammam', cityAr: 'الدمام', latitude: 26.4521, longitude: 50.1132 },
      { slug: 'al-faisaliyah', name: 'Al Faisaliyah', nameAr: 'الفيصلية', city: 'Dammam', cityAr: 'الدمام', latitude: 26.4112, longitude: 50.0764 },
    ],
  },
  {
    slug: 'khobar',
    name: 'Khobar',
    nameAr: 'الخبر',
    region: 'Eastern Province',
    regionAr: 'المنطقة الشرقية',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    latitude: 26.2172,
    longitude: 50.1971,
    popularDistricts: [
      { slug: 'al-hizam-al-thahabi', name: 'Al Hizam Al Thahabi', nameAr: 'الحزام الذهبي', city: 'Khobar', cityAr: 'الخبر', latitude: 26.2415, longitude: 50.2031 },
      { slug: 'corniche', name: 'Corniche', nameAr: 'الكورنيش', city: 'Khobar', cityAr: 'الخبر', latitude: 26.2234, longitude: 50.2185 },
    ],
  },
  {
    slug: 'makkah',
    name: 'Makkah',
    nameAr: 'مكة المكرمة',
    region: 'Makkah Province',
    regionAr: 'منطقة مكة المكرمة',
    image: 'https://images.pexels.com/photos/11029272/pexels-photo-11029272.jpeg?auto=compress&cs=tinysrgb&w=800',
    latitude: 21.3891,
    longitude: 39.8579,
    popularDistricts: [
      { slug: 'al-aziziyah', name: 'Al Aziziyah', nameAr: 'العزيزية', city: 'Makkah', cityAr: 'مكة المكرمة', latitude: 21.4123, longitude: 39.8654 },
      { slug: 'al-shobikah', name: 'Al Shobikah', nameAr: 'الشبيكة', city: 'Makkah', cityAr: 'مكة المكرمة', latitude: 21.4231, longitude: 39.8214 },
    ],
  },
  {
    slug: 'madinah',
    name: 'Madinah',
    nameAr: 'المدينة المنورة',
    region: 'Madinah Province',
    regionAr: 'منطقة المدينة المنورة',
    image: 'https://images.pexels.com/photos/13560613/pexels-photo-13560613.jpeg?auto=compress&cs=tinysrgb&w=800',
    latitude: 24.5247,
    longitude: 39.5692,
    popularDistricts: [
      { slug: 'al-hizam', name: 'Al Hizam', nameAr: 'الحزام', city: 'Madinah', cityAr: 'المدينة المنورة', latitude: 24.4712, longitude: 39.6123 },
    ],
  },
];

export async function getDbCities(): Promise<City[]> {
  try {
    const list = await prisma.city.findMany({
      orderBy: { name: 'asc' },
      include: { popularDistricts: true },
    });

    if (list.length === 0) return cities;

    return list.map((c: any) => ({
      slug: c.slug,
      name: c.name,
      nameAr: c.nameAr,
      region: c.region,
      regionAr: c.regionAr,
      image: c.image,
      latitude: c.latitude,
      longitude: c.longitude,
      popularDistricts: (c.popularDistricts || []).map((d: any) => ({
        slug: d.slug,
        name: d.name,
        nameAr: d.nameAr,
        city: c.name,
        cityAr: c.nameAr,
        latitude: d.latitude,
        longitude: d.longitude,
      })),
    }));
  } catch {
    return cities;
  }
}

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

export function getDistrictBySlug(citySlug: string, districtSlug: string): District | undefined {
  const city = getCityBySlug(citySlug);
  return city?.popularDistricts.find((d) => d.slug.toLowerCase() === districtSlug.toLowerCase());
}
