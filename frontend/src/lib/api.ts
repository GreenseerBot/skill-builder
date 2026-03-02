const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function f(path: string, opts?: RequestInit) {
  const res = await fetch(`${API}${path}`, { ...opts, headers: { 'Content-Type': 'application/json', ...opts?.headers } });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getConnectors: () => f('/api/connectors'),
  getEndpoints: (id: string) => f(`/api/connectors/${id}/endpoints`),
  getWorkflows: () => f('/api/workflows'),
  getWorkflow: (id: string) => f(`/api/workflows/${id}`),
  createWorkflow: (data: any) => f('/api/workflows', { method: 'POST', body: JSON.stringify(data) }),
  updateWorkflow: (id: string, data: any) => f(`/api/workflows/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  generate: (id: string) => f(`/api/workflows/${id}/generate`, { method: 'POST' }),
  testStep: (id: string, stepId: string) => f(`/api/workflows/${id}/test-step`, { method: 'POST', body: JSON.stringify({ stepId }) }),
};
