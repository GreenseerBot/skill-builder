'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { api } from '@/lib/api';
import { ConnectorPanel } from '@/components/ConnectorPanel';
import { WorkflowCanvas } from '@/components/WorkflowCanvas';
import { StepDetail } from '@/components/StepDetail';

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const { currentWorkflow, setCurrentWorkflow, updateWorkflowMeta } = useStore();

  useEffect(() => {
    api.getWorkflow(params.id as string).then(setCurrentWorkflow).catch(() => router.push('/'));
  }, [params.id, setCurrentWorkflow, router]);

  const save = async () => {
    if (!currentWorkflow) return;
    await api.updateWorkflow(currentWorkflow.id, currentWorkflow);
  };

  if (!currentWorkflow) return <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-[#555]">Loading...</div>;

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0b]">
      {/* Top bar */}
      <header className="border-b border-[#2a2a2e] px-4 py-3 flex items-center gap-4 shrink-0">
        <button onClick={() => router.push('/')} className="text-[#555] hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1 flex items-center gap-3">
          <input
            value={currentWorkflow.name}
            onChange={e => updateWorkflowMeta(e.target.value, currentWorkflow.description)}
            className="bg-transparent text-sm font-semibold focus:outline-none border-b border-transparent focus:border-[#6366f1] px-1 py-0.5"
          />
          <span className="text-[10px] text-[#444]">{currentWorkflow.steps.length} steps</span>
        </div>
        <button onClick={save} className="px-3 py-1.5 text-xs bg-[#1a1a1e] border border-[#2a2a2e] rounded-lg hover:border-[#3a3a3e] transition-colors">Save</button>
        <button onClick={() => { save(); router.push(`/builder/${currentWorkflow.id}/generate`); }} className="px-3 py-1.5 text-xs bg-[#6366f1] text-white rounded-lg hover:bg-[#5558e6] transition-colors">Generate SKILL.md</button>
      </header>

      {/* Three panel layout */}
      <div className="flex-1 flex overflow-hidden">
        <ConnectorPanel />
        <WorkflowCanvas />
        <StepDetail />
      </div>
    </div>
  );
}
