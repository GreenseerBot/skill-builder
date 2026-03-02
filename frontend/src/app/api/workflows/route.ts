import { NextResponse } from 'next/server';
import { workflows } from '@/lib/backend/store';
import { Workflow } from '@/lib/backend/types';
import { randomUUID } from 'crypto';

export async function GET() {
  return NextResponse.json(Array.from(workflows.values()).map(w => ({
    id: w.id, name: w.name, description: w.description, stepCount: w.steps.length, createdAt: w.createdAt, updatedAt: w.updatedAt
  })));
}

export async function POST(req: Request) {
  const body = await req.json();
  const id = randomUUID();
  const now = new Date().toISOString();
  const wf: Workflow = { id, name: body.name || 'Untitled', description: body.description || '', steps: body.steps || [], createdAt: now, updatedAt: now };
  workflows.set(id, wf);
  return NextResponse.json(wf, { status: 201 });
}
