import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { mockProperties } from '../properties';
import { cities as fallbackCities } from '../cities';

export async function ensureDbSeeded() {
  try {
    const propCount = await prisma.property.count();
    if (propCount > 0) return;

    console.log('Auto-seeding database for admin/user sync...');

    // Seed default admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    await prisma.adminUser.upsert({
      where: { email: 'admin@nftksa.com' },
      update: {},
      create: {
        email: 'admin@nftksa.com',
        passwordHash: adminPassword,
        name: 'System Admin',
        role: 'admin',
      },
    });

    // Seed cities and districts
    for (const cData of fallbackCities) {
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

      for (const dData of cData.popularDistricts || []) {
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

    // Seed properties
    for (const pData of mockProperties) {
      const citySlug = pData.city.toLowerCase().replace(/\s+/g, '-');
      const city = await prisma.city.findFirst({
        where: { slug: citySlug },
      });

      if (!city) continue;

      const districtSlug = pData.district.toLowerCase().replace(/\s+/g, '-');
      const district = await prisma.district.findFirst({
        where: { cityId: city.id, slug: districtSlug },
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
          cityName: pData.city,
          cityNameAr: pData.cityAr,
          districtName: pData.district,
          districtNameAr: pData.districtAr,
          bedrooms: pData.bedrooms,
          bathrooms: pData.bathrooms,
          area: pData.area,
          image: pData.image,
          features: JSON.stringify(pData.features || []),
          featuresAr: JSON.stringify(pData.featuresAr || []),
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
          cityName: pData.city,
          cityNameAr: pData.cityAr,
          districtName: pData.district,
          districtNameAr: pData.districtAr,
          bedrooms: pData.bedrooms,
          bathrooms: pData.bathrooms,
          area: pData.area,
          image: pData.image,
          features: JSON.stringify(pData.features || []),
          featuresAr: JSON.stringify(pData.featuresAr || []),
          latitude: pData.latitude,
          longitude: pData.longitude,
          featured: pData.featured,
          rating: pData.rating,
        },
      });
    }
    console.log('Database auto-seeded successfully.');
  } catch (err) {
    console.error('Error during auto-seed:', err);
  }
}
