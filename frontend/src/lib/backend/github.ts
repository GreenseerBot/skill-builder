import { Connector } from './types';

export const githubConnector: Connector = {
  id: 'github',
  name: 'GitHub',
  icon: '🐙',
  description: 'GitHub — repositories, issues, pull requests, and code search',
  authType: 'bearer',
  authEnvVar: 'GITHUB_TOKEN',
  baseUrl: 'https://api.github.com',
  defaultHeaders: {
    'Authorization': 'Bearer ${GITHUB_TOKEN}',
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  },
  endpoints: [
    {
      id: 'github-create-issue',
      name: 'Create Issue',
      method: 'POST',
      path: '/repos/{owner}/{repo}/issues',
      description: 'Create a new issue in a repository',
      params: [
        { name: 'owner', type: 'string', required: true, in: 'path', description: 'Repository owner' },
        { name: 'repo', type: 'string', required: true, in: 'path', description: 'Repository name' },
        { name: 'title', type: 'string', required: true, description: 'Issue title' },
        { name: 'body', type: 'string', required: false, description: 'Issue body (Markdown)' },
        { name: 'labels', type: 'array', required: false, description: 'Label names to apply' },
        { name: 'assignees', type: 'array', required: false, description: 'Usernames to assign' }
      ],
      responseFields: [
        { name: 'id', type: 'number', description: 'Issue ID' },
        { name: 'number', type: 'number', description: 'Issue number' },
        { name: 'html_url', type: 'string', description: 'URL to the issue' },
        { name: 'state', type: 'string', description: 'open or closed' }
      ]
    },
    {
      id: 'github-list-prs',
      name: 'List Pull Requests',
      method: 'GET',
      path: '/repos/{owner}/{repo}/pulls',
      description: 'List pull requests for a repository',
      params: [
        { name: 'owner', type: 'string', required: true, in: 'path', description: 'Repository owner' },
        { name: 'repo', type: 'string', required: true, in: 'path', description: 'Repository name' },
        { name: 'state', type: 'string', required: false, description: 'open, closed, all' },
        { name: 'sort', type: 'string', required: false, description: 'created, updated, popularity' }
      ],
      responseFields: [
        { name: '[].id', type: 'number', description: 'PR ID' },
        { name: '[].number', type: 'number', description: 'PR number' },
        { name: '[].title', type: 'string', description: 'PR title' },
        { name: '[].state', type: 'string', description: 'open or closed' },
        { name: '[].html_url', type: 'string', description: 'URL to the PR' }
      ]
    },
    {
      id: 'github-create-pr',
      name: 'Create Pull Request',
      method: 'POST',
      path: '/repos/{owner}/{repo}/pulls',
      description: 'Create a new pull request',
      params: [
        { name: 'owner', type: 'string', required: true, in: 'path', description: 'Repository owner' },
        { name: 'repo', type: 'string', required: true, in: 'path', description: 'Repository name' },
        { name: 'title', type: 'string', required: true, description: 'PR title' },
        { name: 'body', type: 'string', required: false, description: 'PR description' },
        { name: 'head', type: 'string', required: true, description: 'Branch with changes' },
        { name: 'base', type: 'string', required: true, description: 'Branch to merge into' }
      ],
      responseFields: [
        { name: 'id', type: 'number', description: 'PR ID' },
        { name: 'number', type: 'number', description: 'PR number' },
        { name: 'html_url', type: 'string', description: 'URL to the PR' }
      ]
    },
    {
      id: 'github-get-repo',
      name: 'Get Repository',
      method: 'GET',
      path: '/repos/{owner}/{repo}',
      description: 'Get repository details',
      params: [
        { name: 'owner', type: 'string', required: true, in: 'path', description: 'Repository owner' },
        { name: 'repo', type: 'string', required: true, in: 'path', description: 'Repository name' }
      ],
      responseFields: [
        { name: 'id', type: 'number', description: 'Repository ID' },
        { name: 'full_name', type: 'string', description: 'owner/repo' },
        { name: 'description', type: 'string', description: 'Repository description' },
        { name: 'default_branch', type: 'string', description: 'Default branch name' },
        { name: 'stargazers_count', type: 'number', description: 'Star count' }
      ]
    },
    {
      id: 'github-search-code',
      name: 'Search Code',
      method: 'GET',
      path: '/search/code',
      description: 'Search for code across repositories',
      params: [
        { name: 'q', type: 'string', required: true, description: 'Search query (e.g. "addClass repo:jquery/jquery")' },
        { name: 'per_page', type: 'number', required: false, description: 'Results per page (max 100)' }
      ],
      responseFields: [
        { name: 'total_count', type: 'number', description: 'Total matches' },
        { name: 'items', type: 'array', description: 'Matching code results with path, repository, url' }
      ]
    }
  ]
};
