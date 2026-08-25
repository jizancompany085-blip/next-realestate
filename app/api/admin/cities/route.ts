import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { name: 'asc' },
      include: {
        popularDistricts: true,
        _count: { select: { properties: true } },
      },
    });
    return NextResponse.json(cities);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, nameAr, region, regionAr, image, latitude, longitude } = await request.json();

    if (!name || !nameAr) {
      return NextResponse.json({ error: 'Name and NameAr are required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-');

    const city = await prisma.city.create({
      data: {
        slug,
        name,
        nameAr,
        region: region || `${name} Province`,
        regionAr: regionAr || `منطقة ${nameAr}`,
        image: image || 'https://images.pexels.com/photos/38096888/pexels-photo-38096888.jpeg',
        latitude: Number(latitude || 24.7136),
        longitude: Number(longitude || 46.6753),
      },
    });

    return NextResponse.json(city, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create city' }, { status: 500 });
  }
}
