import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { mockProperties } from '@/lib/properties';
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
      where.type = { equals: type };
    }
    if (purpose && purpose !== 'all') {
      where.purpose = { equals: purpose };
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { titleAr: { contains: search } },
        { cityName: { contains: search } },
        { districtName: { contains: search } },
      ];
    }

    const list = await prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const formatted = list.map((p) => {
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
        type: p.type,
        purpose: p.purpose,
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
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching public properties:', error);
    return NextResponse.json(mockProperties);
  }
}
