import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { ensureDbSeeded } from '@/lib/db/seed-helper';

export async function GET(request: Request) {
  try {
    await ensureDbSeeded();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const city = searchParams.get('city') || '';
    const type = searchParams.get('type') || '';
    const purpose = searchParams.get('purpose') || '';

    const where: any = {};

    if (city && city !== 'all') {
      where.cityName = { contains: city };
    }
    if (type && type !== 'all') {
      where.type = type;
    }
    if (purpose && purpose !== 'all') {
      where.purpose = purpose;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { titleAr: { contains: search } },
        { cityName: { contains: search } },
        { districtName: { contains: search } },
      ];
    }

    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        city: true,
        district: true,
      },
    });

    return NextResponse.json(properties);
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      titleAr,
      description,
      descriptionAr,
      price,
      type,
      purpose,
      cityName,
      cityNameAr,
      districtName,
      districtNameAr,
      bedrooms,
      bathrooms,
      area,
      image,
      images,
      features,
      featuresAr,
      latitude,
      longitude,
      featured,
    } = body;

    if (!title || !price || !cityName || !districtName) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    // Find or create city
    const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
    const city = await prisma.city.upsert({
      where: { slug: citySlug },
      update: { name: cityName, nameAr: cityNameAr || cityName },
      create: {
        slug: citySlug,
        name: cityName,
        nameAr: cityNameAr || cityName,
        region: `${cityName} Province`,
        regionAr: `منطقة ${cityNameAr || cityName}`,
        image: image || 'https://images.pexels.com/photos/38096888/pexels-photo-38096888.jpeg',
        latitude: latitude || 24.7136,
        longitude: longitude || 46.6753,
      },
    });

    // Find or create district
    const districtSlug = districtName.toLowerCase().replace(/\s+/g, '-');
    const district = await prisma.district.upsert({
      where: { cityId_slug: { cityId: city.id, slug: districtSlug } },
      update: { name: districtName, nameAr: districtNameAr || districtName },
      create: {
        slug: districtSlug,
        name: districtName,
        nameAr: districtNameAr || districtName,
        cityId: city.id,
        latitude: latitude || 24.7136,
        longitude: longitude || 46.6753,
      },
    });

    const property = await prisma.property.create({
      data: {
        title,
        titleAr: titleAr || title,
        description: description || '',
        descriptionAr: descriptionAr || description || '',
        price: Number(price),
        type: type || 'Apartment',
        purpose: purpose || 'Sale',
        cityId: city.id,
        districtId: district.id,
        cityName,
        cityNameAr: cityNameAr || cityName,
        districtName,
        districtNameAr: districtNameAr || districtName,
        bedrooms: Number(bedrooms || 0),
        bathrooms: Number(bathrooms || 0),
        area: Number(area || 100),
        image: image || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
        images: JSON.stringify(images || []),
        features: JSON.stringify(features || []),
        featuresAr: JSON.stringify(featuresAr || []),
        latitude: Number(latitude || 24.7136),
        longitude: Number(longitude || 46.6753),
        featured: Boolean(featured),
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error: any) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: error.message || 'Failed to create property' }, { status: 500 });
  }
}
