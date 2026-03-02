import { NextResponse } from 'next/server';
import { connectors } from '@/lib/backend/index';

export async function GET() {
  return NextResponse.json(connectors.map(c => ({
    ...c,
    endpoints: c.endpoints.map(e => ({ id: e.id, name: e.name, method: e.method, description: e.description }))
  })));
}
