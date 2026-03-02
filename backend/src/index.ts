import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { connectors, connectorsMap } from './connectors';
import { Workflow } from './types';
import { generateSkillMd } from './generate';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage
const workflows = new Map<string, Workflow>();

// Seed a demo workflow
const demoId = 'demo-workflow';
workflows.set(demoId, {
  id: demoId,
  name: 'GitHub Issue → Notion Task',
  description: 'When a GitHub issue is created, log it as a task in Notion',
  steps: [
    { id: 's1', connectorId: 'github', endpointId: 'github-create-issue', config: { owner: 'myorg', repo: 'myrepo', title: 'Bug: {{trigger.title}}' }, outputAlias: 'ghIssue', order: 0 },
    { id: 's2', connectorId: 'notion', endpointId: 'notion-create-page', config: { 'parent.database_id': '{{env.NOTION_DB_ID}}', 'properties': '{"Name": {"title": [{"text": {"content": "{{ghIssue.response.title}}"}}]}}' }, outputAlias: 'notionPage', order: 1 }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Routes
app.get('/api/connectors', (_req, res) => {
  res.json(connectors.map(c => ({ ...c, endpoints: c.endpoints.map(e => ({ id: e.id, name: e.name, method: e.method, description: e.description })) })));
});

app.get('/api/connectors/:id/endpoints', (req, res) => {
  const connector = connectorsMap.get(req.params.id);
  if (!connector) return res.status(404).json({ error: 'Connector not found' });
  res.json(connector.endpoints);
});

app.get('/api/workflows', (_req, res) => {
  res.json(Array.from(workflows.values()).map(w => ({ id: w.id, name: w.name, description: w.description, stepCount: w.steps.length, createdAt: w.createdAt, updatedAt: w.updatedAt })));
});

app.get('/api/workflows/:id', (req, res) => {
  const wf = workflows.get(req.params.id);
  if (!wf) return res.status(404).json({ error: 'Workflow not found' });
  res.json(wf);
});

app.post('/api/workflows', (req, res) => {
  const id = uuidv4();
  const now = new Date().toISOString();
  const wf: Workflow = { id, name: req.body.name || 'Untitled Workflow', description: req.body.description || '', steps: req.body.steps || [], createdAt: now, updatedAt: now };
  workflows.set(id, wf);
  res.status(201).json(wf);
});

app.put('/api/workflows/:id', (req, res) => {
  const existing = workflows.get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Workflow not found' });
  const updated: Workflow = { ...existing, ...req.body, id: existing.id, updatedAt: new Date().toISOString() };
  workflows.set(existing.id, updated);
  res.json(updated);
});

app.post('/api/workflows/:id/generate', (req, res) => {
  const wf = workflows.get(req.params.id);
  if (!wf) return res.status(404).json({ error: 'Workflow not found' });
  const md = generateSkillMd(wf);
  res.json({ markdown: md });
});

app.post('/api/workflows/:id/test-step', (req, res) => {
  const wf = workflows.get(req.params.id);
  if (!wf) return res.status(404).json({ error: 'Workflow not found' });
  const { stepId } = req.body;
  const step = wf.steps.find(s => s.id === stepId);
  if (!step) return res.status(404).json({ error: 'Step not found' });
  const connector = connectorsMap.get(step.connectorId);
  const endpoint = connector?.endpoints.find(e => e.id === step.endpointId);
  res.json({
    dryRun: true,
    step: { connectorName: connector?.name, endpointName: endpoint?.name, method: endpoint?.method, url: `${connector?.baseUrl}${endpoint?.path}` },
    config: step.config,
    message: 'Dry run — no actual API call made'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Skill Builder API running on :${PORT}`));
