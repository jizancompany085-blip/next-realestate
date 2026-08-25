import { prisma } from './db/prisma';
import type { Property } from './types';

export const mockProperties: Property[] = [
  {
    id: 1,
    title: 'Luxury Villa in Hittin with Swimming Pool',
    titleAr: 'فيلا فاخرة في حي حطين مع مسبح خاص',
    description: 'Modern 5-bedroom villa featuring luxury architectural design, private swimming pool, driver room, maid room, smart home system, and spacious garden in prestegious Hittin district.',
    descriptionAr: 'فيلا حديثة مكونة من 5 غرف نوم بتصميم معماري فاخر، مسبح خاص، غرفة سائق، غرفة خادمة، نظام منزل ذكي، وحديقة واسعة في حي حطين الراقي.',
    price: 4500000,
    type: 'Villa',
    purpose: 'Sale',
    city: 'Riyadh',
    cityAr: 'الرياض',
    district: 'Hittin',
    districtAr: 'حطين',
    bedrooms: 5,
    bathrooms: 6,
    area: 550,
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    latitude: 24.7725,
    longitude: 46.6042,
    featured: true,
    rating: 4.9,
    createdAt: '2026-02-15',
    features: ['Pool', 'Garden', 'Smart Home', 'Driver Room', 'Elevator', 'Garage'],
    featuresAr: ['مسبح', 'حديقة', 'منزل ذكي', 'غرفة سائق', 'مصعد', 'كراج'],
  },
  {
    id: 2,
    title: 'Contemporary Apartment in Al Shati Seafront',
    titleAr: 'شقة معاصرة على كورنيش الشاطئ',
    description: 'High-end 3-bedroom apartment with full sea views of the Red Sea. Located in a luxury tower in Al Shati, featuring gym, pool, and 24/7 security.',
    descriptionAr: 'شقة فاخرة من 3 غرف نوم مع إطلالة كاملة على البحر الأحمر. تقع في برج راقٍ بحي الشاطئ، وتوفر نادٍ رياضي، مسبح، وأمن 24 ساعة.',
    price: 180000,
    type: 'Apartment',
    purpose: 'Rent',
    city: 'Jeddah',
    cityAr: 'جدة',
    district: 'Al Shati',
    districtAr: 'الشاطئ',
    bedrooms: 3,
    bathrooms: 3,
    area: 220,
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    latitude: 21.5956,
    longitude: 39.1171,
    featured: true,
    rating: 4.8,
    createdAt: '2026-02-18',
    features: ['Sea View', 'Gym', 'Shared Pool', 'Parking', 'Security'],
    featuresAr: ['إطلالة بحرية', 'نادي رياضي', 'مسبح مشترك', 'موقف سيارات', 'حراسة أمنية'],
  },
  {
    id: 3,
    title: 'Modern Office Space in KAFD Area',
    titleAr: 'مكتب حديث في منطقة المركز المالي KAFD',
    description: 'Grade A office space in North Riyadh. Fully fitted out with glass partitions, central AC, fiber optics, and dedicated underground parking spots.',
    descriptionAr: 'مقر مكتبي فئة A شمال الرياض. مجهز بالكامل بفاصل زجاجية، تكييف مركزي، ألياف بصرية، ومواقف سيارات خاصة.',
    price: 320000,
    type: 'Office',
    purpose: 'Rent',
    city: 'Riyadh',
    cityAr: 'الرياض',
    district: 'Al Olaya',
    districtAr: 'العليا',
    bedrooms: 0,
    bathrooms: 2,
    area: 310,
    image: 'https://images.pexels.com/photos/260689/pexels-photo-260689.jpeg?auto=compress&cs=tinysrgb&w=800',
    latitude: 24.6946,
    longitude: 46.6845,
    featured: true,
    rating: 4.7,
    createdAt: '2026-02-20',
    features: ['Fiber Optics', 'Central AC', 'Underground Parking', '24/7 Access'],
    featuresAr: ['ألياف بصرية', 'تكييف مركزي', 'مواقف سفلى', 'دخول 24/7'],
  },
  {
    id: 4,
    title: 'Prime Residential Land plot in Al Malqa',
    titleAr: 'أرض سكنية متميزة في حي الملقا',
    description: 'Prime corner land plot suitable for a private palace or dual villa project. North facing on 20m street in Al Malqa.',
    descriptionAr: 'قطعة أرض زاوية ممتازة تصلح لبناء قصر خاص أو مشروع فيلتين. واجهة شمالية على شارع بعرض 20م في حي الملقا.',
    price: 3800000,
    type: 'Land',
    purpose: 'Sale',
    city: 'Riyadh',
    cityAr: 'الرياض',
    district: 'Al Malqa',
    districtAr: 'الملقا',
    bedrooms: 0,
    bathrooms: 0,
    area: 750,
    image: 'https://images.pexels.com/photos/534220/pexels-photo-534220.jpeg?auto=compress&cs=tinysrgb&w=800',
    latitude: 24.8118,
    longitude: 46.6111,
    featured: false,
    rating: 4.6,
    createdAt: '2026-02-10',
    features: ['Corner Plot', '20m Street', 'Electricity Connected', 'Water Connected'],
    featuresAr: ['قطعة زاوية', 'شارع 20 متر', 'مخدومة بالكهرباء', 'مخدومة بالماء'],
  },
  {
    id: 5,
    title: 'Sea Front Duplex Villa in Corniche Khobar',
    titleAr: 'فيلا دوبلكس على كورنيش الخبر',
    description: 'Stunning 4-bedroom beachfront duplex with panoramic view, private yard, maid suite and premium marble finishes.',
    descriptionAr: 'فيلا دوبلكس رائعة بـ 4 غرف نوم واجهة بحرية مع إطلالة بانورامية، حوش خاص، جناح خادمة وتشطيبات رخام فاخرة.',
    price: 3100000,
    type: 'Villa',
    purpose: 'Sale',
    city: 'Khobar',
    cityAr: 'الخبر',
    district: 'Corniche',
    districtAr: 'الكورنيش',
    bedrooms: 4,
    bathrooms: 5,
    area: 420,
    image: 'https://images.pexels.com/photos/206172/pexels-photo-206172.jpeg?auto=compress&cs=tinysrgb&w=800',
    latitude: 26.2234,
    longitude: 50.2185,
    featured: true,
    rating: 4.9,
    createdAt: '2026-02-14',
    features: ['Sea View', 'Marble Floors', 'Covered Parking', 'Maid Suite'],
    featuresAr: ['إطلالة بحرية', 'أرضيات رخام', 'موقف مظلل', 'جناح خادمة'],
  },
  {
    id: 6,
    title: 'Spacious Family Apartment in Al Aziziyah',
    titleAr: 'شقة عائلية واسعة في حي العزيزية',
    description: 'Renovated 4-bedroom apartment close to Al-Haram, equipped with modern kitchen, split ACs and elevator.',
    descriptionAr: 'شقة محدثة مكونة من 4 غرف نوم بالقرب من الحرم المكي، مجهزة بمطبخ حديث، تكييف سبليت ومصعد.',
    price: 75000,
    type: 'Apartment',
    purpose: 'Rent',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    district: 'Al Aziziyah',
    districtAr: 'العزيزية',
    bedrooms: 4,
    bathrooms: 3,
    area: 190,
    image: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800',
    latitude: 21.4123,
    longitude: 39.8654,
    featured: false,
    rating: 4.5,
    createdAt: '2026-02-05',
    features: ['Elevator', 'Near Haram', 'Equipped Kitchen', 'Split AC'],
    featuresAr: ['مصعد', 'قريبة من الحرم', 'مطبخ مجهز', 'تكييف سبليت'],
  },
];

export const properties: Property[] = mockProperties;

function mapDbProperty(p: any): Property {
  let feats: string[] = [];
  let featsAr: string[] = [];
  try { feats = JSON.parse(p.features || '[]'); } catch {}
  try { featsAr = JSON.parse(p.featuresAr || '[]'); } catch {}

  return {
    id: p.id,
    title: p.title,
    titleAr: p.titleAr,
    description: p.description,
    descriptionAr: p.descriptionAr,
    price: p.price,
    type: p.type as any,
    purpose: p.purpose as any,
    city: p.cityName,
    cityAr: p.cityNameAr,
    district: p.districtName,
    districtAr: p.districtNameAr,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area,
    image: p.image,
    latitude: p.latitude,
    longitude: p.longitude,
    featured: p.featured,
    rating: p.rating,
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : undefined,
    features: feats,
    featuresAr: featsAr,
  };
}

export async function getDbProperties(): Promise<Property[]> {
  try {
    const list = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (list.length === 0) return mockProperties;
    return list.map(mapDbProperty);
  } catch {
    return mockProperties;
  }
}

export function getFeaturedProperties(): Property[] {
  return properties.filter((p) => p.featured);
}

export function getLatestProperties(limit = 8): Property[] {
  return [...properties].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, limit);
}

export function getPropertyById(id: number): Property | undefined {
  return properties.find((p) => p.id === id);
}

export function getPropertiesByCity(cityName: string): Property[] {
  return properties.filter((p) => p.city.toLowerCase() === cityName.toLowerCase());
}

export function getPropertiesByDistrict(cityName: string, districtName: string): Property[] {
  return properties.filter(
    (p) => p.city.toLowerCase() === cityName.toLowerCase() && p.district.toLowerCase() === districtName.toLowerCase()
  );
}
