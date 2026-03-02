import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Connector, Endpoint, Workflow, WorkflowStep } from './types';

interface Store {
  connectors: Connector[];
  endpointCache: Record<string, Endpoint[]>;
  currentWorkflow: Workflow | null;
  selectedStepId: string | null;
  setConnectors: (c: Connector[]) => void;
  cacheEndpoints: (connectorId: string, endpoints: Endpoint[]) => void;
  setCurrentWorkflow: (w: Workflow | null) => void;
  setSelectedStep: (id: string | null) => void;
  addStep: (step: WorkflowStep) => void;
  updateStep: (stepId: string, updates: Partial<WorkflowStep>) => void;
  removeStep: (stepId: string) => void;
  reorderSteps: (fromIndex: number, toIndex: number) => void;
  updateWorkflowMeta: (name: string, description: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      connectors: [],
      endpointCache: {},
      currentWorkflow: null,
      selectedStepId: null,
      setConnectors: (connectors) => set({ connectors }),
      cacheEndpoints: (connectorId, endpoints) => set(s => ({ endpointCache: { ...s.endpointCache, [connectorId]: endpoints } })),
      setCurrentWorkflow: (w) => set({ currentWorkflow: w, selectedStepId: null }),
      setSelectedStep: (id) => set({ selectedStepId: id }),
      addStep: (step) => set(s => {
        if (!s.currentWorkflow) return s;
        return { currentWorkflow: { ...s.currentWorkflow, steps: [...s.currentWorkflow.steps, step], updatedAt: new Date().toISOString() } };
      }),
      updateStep: (stepId, updates) => set(s => {
        if (!s.currentWorkflow) return s;
        return { currentWorkflow: { ...s.currentWorkflow, steps: s.currentWorkflow.steps.map(st => st.id === stepId ? { ...st, ...updates } : st), updatedAt: new Date().toISOString() } };
      }),
      removeStep: (stepId) => set(s => {
        if (!s.currentWorkflow) return s;
        const steps = s.currentWorkflow.steps.filter(st => st.id !== stepId).map((st, i) => ({ ...st, order: i }));
        return { currentWorkflow: { ...s.currentWorkflow, steps, updatedAt: new Date().toISOString() }, selectedStepId: s.selectedStepId === stepId ? null : s.selectedStepId };
      }),
      reorderSteps: (from, to) => set(s => {
        if (!s.currentWorkflow) return s;
        const steps = [...s.currentWorkflow.steps].sort((a, b) => a.order - b.order);
        const [moved] = steps.splice(from, 1);
        steps.splice(to, 0, moved);
        return { currentWorkflow: { ...s.currentWorkflow, steps: steps.map((st, i) => ({ ...st, order: i })), updatedAt: new Date().toISOString() } };
      }),
      updateWorkflowMeta: (name, description) => set(s => {
        if (!s.currentWorkflow) return s;
        return { currentWorkflow: { ...s.currentWorkflow, name, description, updatedAt: new Date().toISOString() } };
      }),
    }),
    { name: 'skill-builder-store', partialize: (s) => ({ endpointCache: s.endpointCache }) }
  )
);
