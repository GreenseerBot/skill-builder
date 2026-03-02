'use client';
import { useStore } from '@/lib/store';
import { MethodBadge } from './MethodBadge';
import { Endpoint, WorkflowStep } from '@/lib/types';

export function StepDetail() {
  const { selectedStepId, currentWorkflow, connectors, endpointCache, updateStep } = useStore();

  if (!selectedStepId || !currentWorkflow) {
    return (
      <div className="w-80 border-l border-[#2a2a2e] bg-[#111113] flex items-center justify-center p-6">
        <p className="text-sm text-[#555] text-center">Select a step to view details</p>
      </div>
    );
  }

  const step = currentWorkflow.steps.find(s => s.id === selectedStepId);
  if (!step) return null;

  const connector = connectors.find(c => c.id === step.connectorId);
  const endpoints = endpointCache[step.connectorId] || connector?.endpoints || [];
  const endpoint: Endpoint | undefined = endpoints.find((e: any) => e.id === step.endpointId);
  if (!connector || !endpoint) return null;

  const sortedSteps = [...currentWorkflow.steps].sort((a, b) => a.order - b.order);
  const stepIdx = sortedSteps.findIndex(s => s.id === step.id);

  // Build available variables from prior steps
  const availableVars: string[] = [];
  sortedSteps.slice(0, stepIdx).forEach((s, i) => {
    const alias = s.outputAlias || `step${i + 1}`;
    const c = connectors.find(c => c.id === s.connectorId);
    const ep = (endpointCache[s.connectorId] || c?.endpoints || []).find((e: any) => e.id === s.endpointId);
    ep?.responseFields?.forEach((f: any) => {
      availableVars.push(`{{${alias}.response.${f.name}}}`);
    });
  });

  const handleConfigChange = (key: string, value: string) => {
    updateStep(step.id, { config: { ...step.config, [key]: value } });
  };

  // Build curl preview
  const buildCurl = () => {
    let url = `${connector.baseUrl}${endpoint.path}`;
    for (const [k, v] of Object.entries(step.config)) {
      url = url.replace(`{${k}}`, v || `<${k}>`);
    }
    let curl = `curl -X ${endpoint.method} '${url}'`;
    if (connector.defaultHeaders) {
      for (const [hk, hv] of Object.entries(connector.defaultHeaders)) {
        curl += ` \\\n  -H '${hk}: ${hv}'`;
      }
    }
    return curl;
  };

  return (
    <div className="w-80 border-l border-[#2a2a2e] bg-[#111113] flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-[#2a2a2e]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{connector.icon}</span>
          <MethodBadge method={endpoint.method} />
          <span className="text-sm font-semibold">{endpoint.name}</span>
        </div>
        <p className="text-xs text-[#8b8b8e]">{endpoint.description}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Output alias */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-[#555] font-semibold">Output Alias</label>
          <input
            value={step.outputAlias || ''}
            onChange={e => updateStep(step.id, { outputAlias: e.target.value })}
            className="mt-1 w-full px-3 py-2 bg-[#0a0a0b] border border-[#2a2a2e] rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]"
            placeholder={`step${stepIdx + 1}`}
          />
        </div>

        {/* Parameters */}
        {endpoint.params && endpoint.params.length > 0 && (
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#555] font-semibold">Parameters</label>
            <div className="mt-2 space-y-2">
              {endpoint.params.map(p => (
                <div key={p.name}>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs text-[#ececed]">{p.name}</span>
                    {p.required && <span className="text-[9px] text-red-400">*</span>}
                    <span className="text-[10px] text-[#444]">{p.type}</span>
                  </div>
                  <input
                    value={step.config[p.name] || ''}
                    onChange={e => handleConfigChange(p.name, e.target.value)}
                    placeholder={p.description}
                    className="w-full px-3 py-1.5 bg-[#0a0a0b] border border-[#2a2a2e] rounded text-xs text-white placeholder-[#444] focus:outline-none focus:border-[#6366f1]"
                    list={`vars-${p.name}`}
                  />
                  {availableVars.length > 0 && (
                    <datalist id={`vars-${p.name}`}>
                      {availableVars.map(v => <option key={v} value={v} />)}
                    </datalist>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available variables */}
        {availableVars.length > 0 && (
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#555] font-semibold">Available Variables</label>
            <div className="mt-2 space-y-1">
              {availableVars.map(v => (
                <div key={v} className="text-[11px] text-[#6366f1] font-mono bg-[#6366f1]/5 px-2 py-1 rounded cursor-pointer hover:bg-[#6366f1]/10" onClick={() => navigator.clipboard.writeText(v)}>
                  {v}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Curl preview */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-[#555] font-semibold">Curl Preview</label>
          <pre className="mt-2 p-3 bg-[#0a0a0b] border border-[#2a2a2e] rounded-lg text-[11px] text-emerald-400 font-mono overflow-x-auto whitespace-pre-wrap">{buildCurl()}</pre>
        </div>

        {/* Response schema */}
        {endpoint.responseFields && endpoint.responseFields.length > 0 && (
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#555] font-semibold">Response Schema</label>
            <div className="mt-2 space-y-1">
              {endpoint.responseFields.map(f => (
                <div key={f.name} className="flex items-start gap-2 text-xs">
                  <code className="text-[#6366f1] shrink-0">{f.name}</code>
                  <span className="text-[#444]">{f.type}</span>
                  <span className="text-[#555]">— {f.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
