import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, nameAr, region, regionAr, image, latitude, longitude } = body;

    const slug = name ? name.toLowerCase().replace(/\s+/g, '-') : undefined;

    const city = await prisma.city.update({
      where: { id },
      data: {
        ...(name && { name, slug }),
        ...(nameAr && { nameAr }),
        ...(region !== undefined && { region }),
        ...(regionAr !== undefined && { regionAr }),
        ...(image && { image }),
        ...(latitude !== undefined && { latitude: Number(latitude) }),
        ...(longitude !== undefined && { longitude: Number(longitude) }),
      },
    });

    return NextResponse.json(city);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update city' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.city.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete city' }, { status: 500 });
  }
}
