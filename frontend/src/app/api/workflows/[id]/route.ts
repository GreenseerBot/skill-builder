import { NextResponse } from 'next/server';
import { workflows } from '@/lib/backend/store';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const wf = workflows.get(id);
  if (!wf) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(wf);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = workflows.get(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await req.json();
  const updated = { ...existing, ...body, id: existing.id, updatedAt: new Date().toISOString() };
  workflows.set(id, updated);
  return NextResponse.json(updated);
}
