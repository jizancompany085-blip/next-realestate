import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { mockProperties } from '@/lib/properties';
import { ensureDbSeeded } from '@/lib/db/seed-helper';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDbSeeded();

    const { id } = await params;
    const numId = Number(id);

    const p = await prisma.property.findUnique({
      where: { id: numId },
    });

    if (!p) {
      const fallback = mockProperties.find((item) => item.id === numId);
      if (fallback) return NextResponse.json(fallback);
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    let feats: string[] = [];
    let featsAr: string[] = [];
    let images: string[] = [];
    try { feats = JSON.parse(p.features || '[]'); } catch {}
    try { featsAr = JSON.parse(p.featuresAr || '[]'); } catch {}
    try { images = JSON.parse(p.images || '[]'); } catch {}

    const formatted = {
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
      images,
      latitude: p.latitude,
      longitude: p.longitude,
      featured: p.featured,
      rating: p.rating,
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : undefined,
      features: feats,
      featuresAr: featsAr,
    };

    return NextResponse.json(formatted);
  } catch (error) {
    const { id } = await params;
    const fallback = mockProperties.find((item) => item.id === Number(id));
    if (fallback) return NextResponse.json(fallback);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}
