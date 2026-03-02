import { Workflow, WorkflowStep } from './types';
import { connectorsMap } from './index';

export function generateSkillMd(workflow: Workflow): string {
  const lines: string[] = [];
  const envVars = new Set<string>();

  // Collect env vars
  for (const step of workflow.steps) {
    const connector = connectorsMap.get(step.connectorId);
    if (connector) {
      envVars.add(connector.authEnvVar);
      // Extract env vars from headers
      Object.values(connector.defaultHeaders).forEach(v => {
        const match = v.match(/\$\{(\w+)\}/);
        if (match) envVars.add(match[1]);
      });
    }
  }

  // Frontmatter
  lines.push(`# ${workflow.name}`);
  lines.push('');
  lines.push(`> ${workflow.description || 'Auto-generated skill from Visual Skill Builder'}`);
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');

  // Setup
  lines.push('## Setup');
  lines.push('');
  lines.push('### Required Environment Variables');
  lines.push('');
  envVars.forEach(v => lines.push(`- \`${v}\``));
  lines.push('');
  lines.push('Ensure these are set in `~/.openclaw/.env` before running.');
  lines.push('');

  // Connectors used
  const usedConnectors = new Set<string>();
  workflow.steps.forEach(s => usedConnectors.add(s.connectorId));
  lines.push('### Connectors');
  lines.push('');
  usedConnectors.forEach(cId => {
    const c = connectorsMap.get(cId);
    if (c) lines.push(`- ${c.icon} **${c.name}** — ${c.description}`);
  });
  lines.push('');

  // Workflow steps
  lines.push('## Workflow Steps');
  lines.push('');

  const sortedSteps = [...workflow.steps].sort((a, b) => a.order - b.order);

  sortedSteps.forEach((step, idx) => {
    const connector = connectorsMap.get(step.connectorId);
    const endpoint = connector?.endpoints.find(e => e.id === step.endpointId);
    if (!connector || !endpoint) return;

    const stepNum = idx + 1;
    const alias = step.outputAlias || `step${stepNum}`;

    lines.push(`### Step ${stepNum}: ${connector.icon} ${endpoint.name}`);
    lines.push('');
    lines.push(`**${endpoint.method}** \`${connector.baseUrl}${endpoint.path}\``);
    lines.push('');
    lines.push(endpoint.description);
    lines.push('');

    // Config values
    const configEntries = Object.entries(step.config || {}).filter(([_, v]) => v !== '' && v !== undefined);
    if (configEntries.length > 0) {
      lines.push('**Parameters:**');
      lines.push('');
      configEntries.forEach(([key, val]) => {
        lines.push(`- \`${key}\`: \`${val}\``);
      });
      lines.push('');
    }

    // Curl command
    lines.push('**Curl Command:**');
    lines.push('');
    lines.push('```bash');
    const curlLines = buildCurl(connector, endpoint, step, sortedSteps, idx);
    lines.push(curlLines);
    lines.push('```');
    lines.push('');

    // Output
    if (endpoint.responseFields.length > 0) {
      lines.push(`**Output** (alias: \`${alias}\`):`);
      lines.push('');
      endpoint.responseFields.forEach(f => {
        lines.push(`- \`{{${alias}.response.${f.name}}}\` — ${f.description} (\`${f.type}\`)`);
      });
      lines.push('');
    }

    if (idx < sortedSteps.length - 1) {
      lines.push('---');
      lines.push('');
    }
  });

  // Instructions
  lines.push('## Instructions');
  lines.push('');
  lines.push('Execute the steps above in order. Each step\'s output fields can be referenced');
  lines.push('by subsequent steps using the `{{alias.response.field}}` syntax.');
  lines.push('');
  lines.push('If a step fails, stop execution and report the error with the step number and response.');

  return lines.join('\n');
}

function buildCurl(connector: any, endpoint: any, step: WorkflowStep, allSteps: WorkflowStep[], idx: number): string {
  let url = `${connector.baseUrl}${endpoint.path}`;

  // Substitute path params from config
  const config = step.config || {};
  for (const [key, val] of Object.entries(config)) {
    const pathParam = endpoint.params.find((p: any) => p.name === key && p.in === 'path');
    if (pathParam) {
      url = url.replace(`{${key}}`, String(val));
    }
  }

  const parts: string[] = [`curl -X ${endpoint.method} '${url}'`];

  // Headers
  for (const [hk, hv] of Object.entries(connector.defaultHeaders)) {
    parts.push(`  -H '${hk}: ${hv}'`);
  }

  // Body params (non-path)
  if (['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
    const bodyParams = Object.entries(config).filter(([key]) => {
      const p = endpoint.params.find((ep: any) => ep.name === key);
      return !p || p.in !== 'path';
    });
    if (bodyParams.length > 0) {
      const body: Record<string, any> = {};
      bodyParams.forEach(([k, v]) => {
        // Support nested keys like "fields.project.key"
        const keys = k.split('.');
        let obj = body;
        keys.forEach((part, i) => {
          if (i === keys.length - 1) {
            obj[part] = v;
          } else {
            obj[part] = obj[part] || {};
            obj = obj[part];
          }
        });
      });
      parts.push(`  -d '${JSON.stringify(body, null, 2)}'`);
    }
  }

  return parts.join(' \\\n');
}
