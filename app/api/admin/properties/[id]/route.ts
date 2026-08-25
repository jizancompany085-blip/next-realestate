import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
      include: { city: true, district: true },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Optional city update
    let cityId: string | undefined;
    let districtId: string | undefined;

    if (cityName) {
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
      cityId = city.id;

      if (districtName) {
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
        districtId = district.id;
      }
    }

    const updated = await prisma.property.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }),
        ...(titleAr && { titleAr }),
        ...(description !== undefined && { description }),
        ...(descriptionAr !== undefined && { descriptionAr }),
        ...(price !== undefined && { price: Number(price) }),
        ...(type && { type }),
        ...(purpose && { purpose }),
        ...(cityId && { cityId }),
        ...(districtId && { districtId }),
        ...(cityName && { cityName }),
        ...(cityNameAr && { cityNameAr }),
        ...(districtName && { districtName }),
        ...(districtNameAr && { districtNameAr }),
        ...(bedrooms !== undefined && { bedrooms: Number(bedrooms) }),
        ...(bathrooms !== undefined && { bathrooms: Number(bathrooms) }),
        ...(area !== undefined && { area: Number(area) }),
        ...(image && { image }),
        ...(images !== undefined && { images: JSON.stringify(images) }),
        ...(features !== undefined && { features: JSON.stringify(features) }),
        ...(featuresAr !== undefined && { featuresAr: JSON.stringify(featuresAr) }),
        ...(latitude !== undefined && { latitude: Number(latitude) }),
        ...(longitude !== undefined && { longitude: Number(longitude) }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: error.message || 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.property.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
