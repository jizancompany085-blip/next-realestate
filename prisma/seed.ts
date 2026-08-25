import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const citiesData = [
  {
    slug: 'riyadh',
    name: 'Riyadh',
    nameAr: 'الرياض',
    region: 'Riyadh Province',
    regionAr: 'منطقة الرياض',
    image: 'https://images.pexels.com/photos/38096888/pexels-photo-38096888.jpeg?auto=compress&cs=tinysrgb&w=800',
    latitude: 24.7136,
    longitude: 46.6753,
    districts: [
      { slug: 'al-olaya', name: 'Al Olaya', nameAr: 'العليا', latitude: 24.6946, longitude: 46.6845 },
      { slug: 'al-malqa', name: 'Al Malqa', nameAr: 'اللقاء', latitude: 24.8118, longitude: 46.6111 },
      { slug: 'al-yasmin', name: 'Al Yasmin', nameAr: 'الياسمين', latitude: 24.8322, longitude: 46.6433 },
      { slug: 'an-nakheel', name: 'An Nakheel', nameAr: 'النخيل', latitude: 24.7431, longitude: 46.6214 },
      { slug: 'hittin', name: 'Hittin', nameAr: 'حطين', latitude: 24.7725, longitude: 46.6042 },
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
    districts: [
      { slug: 'al-shati', name: 'Al Shati', nameAr: 'الشاطئ', latitude: 21.5956, longitude: 39.1171 },
      { slug: 'al-hamra', name: 'Al Hamra', nameAr: 'الحمراء', latitude: 21.5229, longitude: 39.1627 },
      { slug: 'obhur-al-shamaliyah', name: 'North Obhur', nameAr: 'أبحر الشمالية', latitude: 21.7583, longitude: 39.1235 },
      { slug: 'al-rawdah', name: 'Al Rawdah', nameAr: 'الروضة', latitude: 21.5645, longitude: 39.1554 },
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
    districts: [
      { slug: 'al-shatea', name: 'Al Shatea', nameAr: 'الشاطئ', latitude: 26.4521, longitude: 50.1132 },
      { slug: 'al-faisaliyah', name: 'Al Faisaliyah', nameAr: 'الفيصلية', latitude: 26.4112, longitude: 50.0764 },
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
    districts: [
      { slug: 'al-hizam-al-thahabi', name: 'Al Hizam Al Thahabi', nameAr: 'الحزام الذهبي', latitude: 26.2415, longitude: 50.2031 },
      { slug: 'corniche', name: 'Corniche', nameAr: 'الكورنيش', latitude: 26.2234, longitude: 50.2185 },
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
    districts: [
      { slug: 'al-aziziyah', name: 'Al Aziziyah', nameAr: 'العزيزية', latitude: 21.4123, longitude: 39.8654 },
      { slug: 'al-shobikah', name: 'Al Shobikah', nameAr: 'الشبيكة', latitude: 21.4231, longitude: 39.8214 },
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
    districts: [
      { slug: 'al-hizam', name: 'Al Hizam', nameAr: 'الحزام', latitude: 24.4712, longitude: 39.6123 },
    ],
  },
];

const propertiesData = [
  {
    id: 1,
    title: 'Luxury Villa in Hittin with Swimming Pool',
    titleAr: 'فيلا فاخرة في حي حطين مع مسبح خاص',
    description: 'Modern 5-bedroom villa featuring luxury architectural design, private swimming pool, driver room, maid room, smart home system, and spacious garden in prestegious Hittin district.',
    descriptionAr: 'فيلا حديثة مكونة من 5 غرف نوم بتصميم معماري فاخر، مسبح خاص، غرفة سائق، غرفة خادمة، نظام منزل ذكي، وحديقة واسعة في حي حطين الراقي.',
    price: 4500000,
    type: 'Villa',
    purpose: 'Sale',
    cityName: 'Riyadh',
    cityNameAr: 'الرياض',
    districtName: 'Hittin',
    districtNameAr: 'حطين',
    bedrooms: 5,
    bathrooms: 6,
    area: 550,
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: JSON.stringify(['Pool', 'Garden', 'Smart Home', 'Driver Room', 'Elevator', 'Garage']),
    featuresAr: JSON.stringify(['مسبح', 'حديقة', 'منزل ذكي', 'غرفة سائق', 'مصعد', 'كراج']),
    latitude: 24.7725,
    longitude: 46.6042,
    featured: true,
    rating: 4.9,
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
    cityName: 'Jeddah',
    cityNameAr: 'جدة',
    districtName: 'Al Shati',
    districtNameAr: 'الشاطئ',
    bedrooms: 3,
    bathrooms: 3,
    area: 220,
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: JSON.stringify(['Sea View', 'Gym', 'Shared Pool', 'Parking', 'Security']),
    featuresAr: JSON.stringify(['إطلالة بحرية', 'نادي رياضي', 'مسبح مشترك', 'موقف سيارات', 'حراسة أمنية']),
    latitude: 21.5956,
    longitude: 39.1171,
    featured: true,
    rating: 4.8,
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
    cityName: 'Riyadh',
    cityNameAr: 'الرياض',
    districtName: 'Al Olaya',
    districtNameAr: 'العليا',
    bedrooms: 0,
    bathrooms: 2,
    area: 310,
    image: 'https://images.pexels.com/photos/260689/pexels-photo-260689.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: JSON.stringify(['Fiber Optics', 'Central AC', 'Underground Parking', '24/7 Access']),
    featuresAr: JSON.stringify(['ألياف بصرية', 'تكييف مركزي', 'مواقف سفلى', 'دخول 24/7']),
    latitude: 24.6946,
    longitude: 46.6845,
    featured: true,
    rating: 4.7,
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
    cityName: 'Riyadh',
    cityNameAr: 'الرياض',
    districtName: 'Al Malqa',
    districtNameAr: 'الملقا',
    bedrooms: 0,
    bathrooms: 0,
    area: 750,
    image: 'https://images.pexels.com/photos/534220/pexels-photo-534220.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: JSON.stringify(['Corner Plot', '20m Street', 'Electricity Connected', 'Water Connected']),
    featuresAr: JSON.stringify(['قطعة زاوية', 'شارع 20 متر', 'مخدومة بالكهرباء', 'مخدومة بالماء']),
    latitude: 24.8118,
    longitude: 46.6111,
    featured: false,
    rating: 4.6,
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
    cityName: 'Khobar',
    cityNameAr: 'الخبر',
    districtName: 'Corniche',
    districtNameAr: 'الكورنيش',
    bedrooms: 4,
    bathrooms: 5,
    area: 420,
    image: 'https://images.pexels.com/photos/206172/pexels-photo-206172.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: JSON.stringify(['Sea View', 'Marble Floors', 'Covered Parking', 'Maid Suite']),
    featuresAr: JSON.stringify(['إطلالة بحرية', 'أرضيات رخام', 'موقف مظلل', 'جناح خادمة']),
    latitude: 26.2234,
    longitude: 50.2185,
    featured: true,
    rating: 4.9,
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
    cityName: 'Makkah',
    cityNameAr: 'مكة المكرمة',
    districtName: 'Al Aziziyah',
    districtNameAr: 'العزيزية',
    bedrooms: 4,
    bathrooms: 3,
    area: 190,
    image: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: JSON.stringify(['Elevator', 'Near Haram', 'Equipped Kitchen', 'Split AC']),
    featuresAr: JSON.stringify(['مصعد', 'قريبة من الحرم', 'مطبخ مجهز', 'تكييف سبليت']),
    latitude: 21.4123,
    longitude: 39.8654,
    featured: false,
    rating: 4.5,
  },
];

async function main() {
  console.log('Seeding database...');

  // Seed default admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.adminUser.upsert({
    where: { email: 'admin@NFTksa.com' },
    update: {},
    create: {
      email: 'admin@NFTksa.com',
      passwordHash: adminPassword,
      name: 'System Admin',
      role: 'admin',
    },
  });
  console.log('Admin user seeded: admin@NFTksa.com / admin123');

  // Seed cities and districts
  for (const cData of citiesData) {
    const city = await prisma.city.upsert({
      where: { slug: cData.slug },
      update: {
        name: cData.name,
        nameAr: cData.nameAr,
        region: cData.region,
        regionAr: cData.regionAr,
        image: cData.image,
        latitude: cData.latitude,
        longitude: cData.longitude,
      },
      create: {
        slug: cData.slug,
        name: cData.name,
        nameAr: cData.nameAr,
        region: cData.region,
        regionAr: cData.regionAr,
        image: cData.image,
        latitude: cData.latitude,
        longitude: cData.longitude,
      },
    });

    for (const dData of cData.districts) {
      await prisma.district.upsert({
        where: {
          cityId_slug: {
            cityId: city.id,
            slug: dData.slug,
          },
        },
        update: {
          name: dData.name,
          nameAr: dData.nameAr,
          latitude: dData.latitude,
          longitude: dData.longitude,
        },
        create: {
          slug: dData.slug,
          name: dData.name,
          nameAr: dData.nameAr,
          cityId: city.id,
          latitude: dData.latitude,
          longitude: dData.longitude,
        },
      });
    }
  }

  console.log('Cities & Districts seeded');

  // Seed properties
  for (const pData of propertiesData) {
    const city = await prisma.city.findFirst({
      where: { name: { equals: pData.cityName } },
    });

    if (!city) continue;

    const district = await prisma.district.findFirst({
      where: { cityId: city.id, name: { equals: pData.districtName } },
    });

    await prisma.property.upsert({
      where: { id: pData.id },
      update: {
        title: pData.title,
        titleAr: pData.titleAr,
        description: pData.description,
        descriptionAr: pData.descriptionAr,
        price: pData.price,
        type: pData.type,
        purpose: pData.purpose,
        cityId: city.id,
        districtId: district?.id,
        cityName: pData.cityName,
        cityNameAr: pData.cityNameAr,
        districtName: pData.districtName,
        districtNameAr: pData.districtNameAr,
        bedrooms: pData.bedrooms,
        bathrooms: pData.bathrooms,
        area: pData.area,
        image: pData.image,
        features: pData.features,
        featuresAr: pData.featuresAr,
        latitude: pData.latitude,
        longitude: pData.longitude,
        featured: pData.featured,
        rating: pData.rating,
      },
      create: {
        id: pData.id,
        title: pData.title,
        titleAr: pData.titleAr,
        description: pData.description,
        descriptionAr: pData.descriptionAr,
        price: pData.price,
        type: pData.type,
        purpose: pData.purpose,
        cityId: city.id,
        districtId: district?.id,
        cityName: pData.cityName,
        cityNameAr: pData.cityNameAr,
        districtName: pData.districtName,
        districtNameAr: pData.districtNameAr,
        bedrooms: pData.bedrooms,
        bathrooms: pData.bathrooms,
        area: pData.area,
        image: pData.image,
        features: pData.features,
        featuresAr: pData.featuresAr,
        latitude: pData.latitude,
        longitude: pData.longitude,
        featured: pData.featured,
        rating: pData.rating,
      },
    });
  }

  console.log('Properties seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
