import { Connector } from './types';

export const jiraConnector: Connector = {
  id: 'jira',
  name: 'Jira',
  icon: '🎫',
  description: 'Jira — issue tracking, project management, and agile workflows',
  authType: 'basic',
  authEnvVar: 'JIRA_API_TOKEN',
  baseUrl: 'https://{domain}.atlassian.net/rest/api/3',
  defaultHeaders: {
    'Authorization': 'Basic ${JIRA_AUTH_BASE64}',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  endpoints: [
    {
      id: 'jira-create-issue',
      name: 'Create Issue',
      method: 'POST',
      path: '/issue',
      description: 'Create a new Jira issue (bug, story, task, epic)',
      params: [
        { name: 'fields.project.key', type: 'string', required: true, description: 'Project key (e.g. "PROJ")' },
        { name: 'fields.summary', type: 'string', required: true, description: 'Issue title' },
        { name: 'fields.issuetype.name', type: 'string', required: true, description: 'Bug, Story, Task, Epic' },
        { name: 'fields.description', type: 'object', required: false, description: 'ADF description content' },
        { name: 'fields.priority.name', type: 'string', required: false, description: 'Highest, High, Medium, Low, Lowest' },
        { name: 'fields.assignee.accountId', type: 'string', required: false, description: 'Assignee account ID' }
      ],
      responseFields: [
        { name: 'id', type: 'string', description: 'Issue ID' },
        { name: 'key', type: 'string', description: 'Issue key (e.g. PROJ-123)' },
        { name: 'self', type: 'string', description: 'API URL of the issue' }
      ]
    },
    {
      id: 'jira-search-issues',
      name: 'Search Issues (JQL)',
      method: 'POST',
      path: '/search',
      description: 'Search issues using JQL queries',
      params: [
        { name: 'jql', type: 'string', required: true, description: 'JQL query string' },
        { name: 'maxResults', type: 'number', required: false, description: 'Max results (default 50)' },
        { name: 'fields', type: 'array', required: false, description: 'Fields to return' }
      ],
      responseFields: [
        { name: 'issues', type: 'array', description: 'Matching issues' },
        { name: 'total', type: 'number', description: 'Total matching issues' },
        { name: 'maxResults', type: 'number', description: 'Page size' }
      ]
    },
    {
      id: 'jira-transition-issue',
      name: 'Transition Issue',
      method: 'POST',
      path: '/issue/{issueIdOrKey}/transitions',
      description: 'Move an issue to a different status (e.g. In Progress, Done)',
      params: [
        { name: 'issueIdOrKey', type: 'string', required: true, in: 'path', description: 'Issue key (e.g. PROJ-123)' },
        { name: 'transition.id', type: 'string', required: true, description: 'Target transition ID' }
      ],
      responseFields: []
    },
    {
      id: 'jira-add-comment',
      name: 'Add Comment',
      method: 'POST',
      path: '/issue/{issueIdOrKey}/comment',
      description: 'Add a comment to an issue',
      params: [
        { name: 'issueIdOrKey', type: 'string', required: true, in: 'path', description: 'Issue key' },
        { name: 'body', type: 'object', required: true, description: 'Comment body in ADF format' }
      ],
      responseFields: [
        { name: 'id', type: 'string', description: 'Comment ID' },
        { name: 'created', type: 'string', description: 'Creation timestamp' },
        { name: 'author.displayName', type: 'string', description: 'Author name' }
      ]
    },
    {
      id: 'jira-get-project',
      name: 'Get Project',
      method: 'GET',
      path: '/project/{projectIdOrKey}',
      description: 'Get project details',
      params: [
        { name: 'projectIdOrKey', type: 'string', required: true, in: 'path', description: 'Project key or ID' }
      ],
      responseFields: [
        { name: 'id', type: 'string', description: 'Project ID' },
        { name: 'key', type: 'string', description: 'Project key' },
        { name: 'name', type: 'string', description: 'Project name' },
        { name: 'lead.displayName', type: 'string', description: 'Project lead' }
      ]
    }
  ]
};
