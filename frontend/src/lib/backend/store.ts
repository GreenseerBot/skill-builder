import { Workflow } from './types';

// In-memory store (resets on cold start, fine for demo)
const workflows = new Map<string, Workflow>();

// Seed demo
workflows.set('demo-workflow', {
  id: 'demo-workflow',
  name: 'GitHub Issue → Notion Task',
  description: 'When a GitHub issue is created, log it as a task in Notion',
  steps: [
    { id: 's1', connectorId: 'github', endpointId: 'github-create-issue', config: { owner: 'myorg', repo: 'myrepo', title: 'Bug: {{trigger.title}}' }, outputAlias: 'ghIssue', order: 0 },
    { id: 's2', connectorId: 'notion', endpointId: 'notion-create-page', config: { 'parent.database_id': '{{env.NOTION_DB_ID}}', 'properties': '{"Name": {"title": [{"text": {"content": "{{ghIssue.response.title}}"}}]}}' }, outputAlias: 'notionPage', order: 1 }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export { workflows };
