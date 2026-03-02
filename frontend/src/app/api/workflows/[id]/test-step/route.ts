import { NextResponse } from 'next/server';
import { workflows } from '@/lib/backend/store';
import { connectorsMap } from '@/lib/backend/index';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const wf = workflows.get(id);
  if (!wf) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const { stepId } = await req.json();
  const step = wf.steps.find(s => s.id === stepId);
  if (!step) return NextResponse.json({ error: 'Step not found' }, { status: 404 });
  const connector = connectorsMap.get(step.connectorId);
  const endpoint = connector?.endpoints.find(e => e.id === step.endpointId);
  return NextResponse.json({
    dryRun: true,
    step: { connectorName: connector?.name, endpointName: endpoint?.name, method: endpoint?.method, url: `${connector?.baseUrl}${endpoint?.path}` },
    config: step.config,
    message: 'Dry run — no actual API call made'
  });
}
