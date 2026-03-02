'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { api } from '@/lib/api';
import { MethodBadge } from './MethodBadge';
import { Endpoint } from '@/lib/types';

export function ConnectorPanel() {
  const { connectors, setConnectors, endpointCache, cacheEndpoints } = useStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getConnectors().then(setConnectors).catch(console.error);
  }, [setConnectors]);

  const toggle = async (id: string) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (!endpointCache[id]) {
      const eps = await api.getEndpoints(id);
      cacheEndpoints(id, eps);
    }
  };

  const filtered = connectors.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.endpoints.some(e => e.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-72 border-r border-[#2a2a2e] bg-[#111113] flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-[#2a2a2e]">
        <h2 className="text-sm font-semibold text-[#8b8b8e] uppercase tracking-wider mb-3">Connectors</h2>
        <input
          type="text"
          placeholder="Search endpoints..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 bg-[#0a0a0b] border border-[#2a2a2e] rounded-lg text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#6366f1]"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {filtered.map(c => (
          <div key={c.id} className="mb-1">
            <button
              onClick={() => toggle(c.id)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-[#1a1a1e] transition-colors text-left"
            >
              <span className="text-lg">{c.icon}</span>
              <span className="text-sm font-medium flex-1">{c.name}</span>
              <span className="text-xs text-[#555]">{c.endpoints.length}</span>
              <svg className={`w-4 h-4 text-[#555] transition-transform ${expanded === c.id ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            {expanded === c.id && (
              <div className="ml-2 space-y-1 mt-1">
                {(endpointCache[c.id] || c.endpoints).filter(e =>
                  !search || e.name.toLowerCase().includes(search.toLowerCase())
                ).map((ep: Endpoint) => (
                  <div
                    key={ep.id}
                    draggable
                    onDragStart={e => {
                      e.dataTransfer.setData('application/json', JSON.stringify({ connectorId: c.id, endpointId: ep.id, connectorIcon: c.icon, endpointName: ep.name, method: ep.method }));
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#1a1a1e] border border-[#2a2a2e] cursor-grab hover:border-[#6366f1]/50 transition-colors group"
                  >
                    <MethodBadge method={ep.method} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{ep.name}</div>
                      <div className="text-[10px] text-[#555] truncate">{ep.description}</div>
                    </div>
                    <svg className="w-3 h-3 text-[#333] group-hover:text-[#555]" fill="currentColor" viewBox="0 0 24 24"><circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
