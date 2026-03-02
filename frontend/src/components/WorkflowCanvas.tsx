'use client';
import { useStore } from '@/lib/store';
import { MethodBadge } from './MethodBadge';
import { WorkflowStep } from '@/lib/types';

export function WorkflowCanvas() {
  const { currentWorkflow, addStep, selectedStepId, setSelectedStep, removeStep, connectors, endpointCache } = useStore();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const newStep: WorkflowStep = {
        id: `step-${Date.now()}`,
        connectorId: data.connectorId,
        endpointId: data.endpointId,
        config: {},
        outputAlias: `step${(currentWorkflow?.steps.length || 0) + 1}`,
        order: currentWorkflow?.steps.length || 0,
      };
      addStep(newStep);
    } catch {}
  };

  const steps = [...(currentWorkflow?.steps || [])].sort((a, b) => a.order - b.order);

  const getInfo = (step: WorkflowStep) => {
    const c = connectors.find(c => c.id === step.connectorId);
    const eps = endpointCache[step.connectorId] || c?.endpoints || [];
    const ep = eps.find((e: any) => e.id === step.endpointId);
    return { icon: c?.icon || '?', connectorName: c?.name || '', endpointName: ep?.name || step.endpointId, method: ep?.method || 'GET' };
  };

  return (
    <div
      className="flex-1 bg-[#0a0a0b] overflow-y-auto"
      onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
      onDrop={handleDrop}
    >
      <div className="max-w-xl mx-auto py-8 px-4">
        {steps.length === 0 ? (
          <div className="border-2 border-dashed border-[#2a2a2e] rounded-xl p-12 text-center">
            <div className="text-4xl mb-3">🔧</div>
            <p className="text-[#8b8b8e] text-sm">Drag endpoints from the left panel to build your workflow</p>
          </div>
        ) : (
          <div className="space-y-0">
            {steps.map((step, idx) => {
              const info = getInfo(step);
              const isSelected = selectedStepId === step.id;
              return (
                <div key={step.id}>
                  <div
                    onClick={() => setSelectedStep(step.id)}
                    className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${isSelected ? 'border-[#6366f1] bg-[#6366f1]/5 shadow-lg shadow-[#6366f1]/10' : 'border-[#2a2a2e] bg-[#111113] hover:border-[#3a3a3e]'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1a1a1e] flex items-center justify-center text-lg">{info.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <MethodBadge method={info.method} />
                          <span className="text-sm font-medium">{info.endpointName}</span>
                        </div>
                        <div className="text-xs text-[#555] mt-0.5">{info.connectorName} · {step.outputAlias || `step${idx + 1}`}</div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-[#555] bg-[#1a1a1e] px-2 py-1 rounded">Step {idx + 1}</span>
                        <button onClick={e => { e.stopPropagation(); removeStep(step.id); }} className="p-1 hover:bg-red-500/20 rounded text-[#555] hover:text-red-400 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                    {Object.keys(step.config).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#2a2a2e]">
                        {Object.entries(step.config).slice(0, 3).map(([k, v]) => (
                          <div key={k} className="text-xs text-[#555] truncate"><span className="text-[#6366f1]">{k}</span>: {String(v)}</div>
                        ))}
                        {Object.keys(step.config).length > 3 && <div className="text-[10px] text-[#444]">+{Object.keys(step.config).length - 3} more</div>}
                      </div>
                    )}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="flex justify-center py-1">
                      <div className="w-px h-8 bg-[#2a2a2e] relative">
                        <svg className="w-3 h-3 text-[#2a2a2e] absolute -bottom-1.5 -left-[5px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16l-6-6h12z"/></svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
