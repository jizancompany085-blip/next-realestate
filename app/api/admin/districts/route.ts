import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: Request) {
  try {
    const { cityId, name, nameAr, latitude, longitude } = await request.json();

    if (!cityId || !name || !nameAr) {
      return NextResponse.json({ error: 'cityId, name and nameAr are required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-');

    const district = await prisma.district.create({
      data: {
        cityId,
        slug,
        name,
        nameAr,
        latitude: Number(latitude || 24.7136),
        longitude: Number(longitude || 46.6753),
      },
    });

    return NextResponse.json(district, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create district' }, { status: 500 });
  }
}
