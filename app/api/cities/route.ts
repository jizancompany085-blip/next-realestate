import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { cities as fallbackCities } from '@/lib/cities';

export async function GET() {
  try {
    const list = await prisma.city.findMany({
      orderBy: { name: 'asc' },
      include: {
        popularDistricts: true,
        _count: { select: { properties: true } },
      },
    });

    if (list.length === 0) {
      return NextResponse.json(fallbackCities);
    }

    const formatted = list.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      nameAr: c.nameAr,
      region: c.region,
      regionAr: c.regionAr,
      image: c.image,
      latitude: c.latitude,
      longitude: c.longitude,
      popularDistricts: (c.popularDistricts || []).map((d) => ({
        id: d.id,
        slug: d.slug,
        name: d.name,
        nameAr: d.nameAr,
        city: c.name,
        cityAr: c.nameAr,
        latitude: d.latitude,
        longitude: d.longitude,
      })),
      propertyCount: c._count?.properties || 0,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching public cities:', error);
    return NextResponse.json(fallbackCities);
  }
}
