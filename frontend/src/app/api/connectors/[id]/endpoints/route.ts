import { NextResponse } from 'next/server';
import { connectorsMap } from '@/lib/backend/index';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const connector = connectorsMap.get(id);
  if (!connector) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(connector.endpoints);
}
