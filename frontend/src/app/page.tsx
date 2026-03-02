'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface WorkflowSummary {
  id: string;
  name: string;
  description: string;
  stepCount: number;
  createdAt: string;
}

export default function Home() {
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.getWorkflows().then(setWorkflows).catch(console.error).finally(() => setLoading(false));
  }, []);

  const createNew = async () => {
    const wf = await api.createWorkflow({ name: 'New Workflow', description: '' });
    router.push(`/builder/${wf.id}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <header className="border-b border-[#2a2a2e] px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6366f1] flex items-center justify-center text-white font-bold text-sm">S</div>
            <h1 className="text-lg font-semibold">OpenClaw Skill Builder</h1>
          </div>
          <button onClick={createNew} className="px-4 py-2 bg-[#6366f1] hover:bg-[#5558e6] text-white text-sm font-medium rounded-lg transition-colors">
            + New Workflow
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-10">
        <h2 className="text-sm font-semibold text-[#8b8b8e] uppercase tracking-wider mb-6">Saved Workflows</h2>
        {loading ? (
          <div className="text-[#555] text-sm">Loading...</div>
        ) : workflows.length === 0 ? (
          <div className="border border-dashed border-[#2a2a2e] rounded-xl p-12 text-center">
            <p className="text-[#555] text-sm mb-4">No workflows yet. Create your first one.</p>
            <button onClick={createNew} className="px-4 py-2 bg-[#6366f1] text-white text-sm rounded-lg">Create Workflow</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map(wf => (
              <div
                key={wf.id}
                onClick={() => router.push(`/builder/${wf.id}`)}
                className="p-5 rounded-xl border border-[#2a2a2e] bg-[#111113] hover:border-[#3a3a3e] cursor-pointer transition-colors group"
              >
                <h3 className="text-sm font-semibold group-hover:text-[#6366f1] transition-colors">{wf.name}</h3>
                <p className="text-xs text-[#555] mt-1 line-clamp-2">{wf.description || 'No description'}</p>
                <div className="flex items-center gap-3 mt-4 text-[10px] text-[#444]">
                  <span>{wf.stepCount} steps</span>
                  <span>·</span>
                  <span>{new Date(wf.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
