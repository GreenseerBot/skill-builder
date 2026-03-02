import { Connector } from './types';

export const notionConnector: Connector = {
  id: 'notion',
  name: 'Notion',
  icon: '📝',
  description: 'Notion workspace — pages, databases, and content management',
  authType: 'bearer',
  authEnvVar: 'NOTION_API_KEY',
  baseUrl: 'https://api.notion.com/v1',
  defaultHeaders: {
    'Authorization': 'Bearer ${NOTION_API_KEY}',
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
  },
  endpoints: [
    {
      id: 'notion-create-page',
      name: 'Create Page',
      method: 'POST',
      path: '/pages',
      description: 'Create a new page in a database or as a child of another page',
      params: [
        { name: 'parent.database_id', type: 'string', required: true, description: 'ID of the parent database' },
        { name: 'properties', type: 'object', required: true, description: 'Page properties matching database schema' },
        { name: 'children', type: 'array', required: false, description: 'Block content for the page body' }
      ],
      responseFields: [
        { name: 'id', type: 'string', description: 'Created page ID' },
        { name: 'url', type: 'string', description: 'URL to the page' },
        { name: 'created_time', type: 'string', description: 'ISO 8601 timestamp' },
        { name: 'properties', type: 'object', description: 'Page properties' }
      ]
    },
    {
      id: 'notion-query-database',
      name: 'Query Database',
      method: 'POST',
      path: '/databases/{database_id}/query',
      description: 'Query a database with optional filters and sorts',
      params: [
        { name: 'database_id', type: 'string', required: true, in: 'path', description: 'Database ID' },
        { name: 'filter', type: 'object', required: false, description: 'Filter conditions' },
        { name: 'sorts', type: 'array', required: false, description: 'Sort conditions' },
        { name: 'page_size', type: 'number', required: false, description: 'Results per page (max 100)' }
      ],
      responseFields: [
        { name: 'results', type: 'array', description: 'Array of page objects' },
        { name: 'has_more', type: 'boolean', description: 'Whether more results exist' },
        { name: 'next_cursor', type: 'string', description: 'Cursor for pagination' }
      ]
    },
    {
      id: 'notion-update-page',
      name: 'Update Page',
      method: 'PATCH',
      path: '/pages/{page_id}',
      description: 'Update page properties or archive a page',
      params: [
        { name: 'page_id', type: 'string', required: true, in: 'path', description: 'Page ID to update' },
        { name: 'properties', type: 'object', required: false, description: 'Properties to update' },
        { name: 'archived', type: 'boolean', required: false, description: 'Set to true to archive' }
      ],
      responseFields: [
        { name: 'id', type: 'string', description: 'Page ID' },
        { name: 'last_edited_time', type: 'string', description: 'Last edit timestamp' }
      ]
    },
    {
      id: 'notion-create-database',
      name: 'Create Database',
      method: 'POST',
      path: '/databases',
      description: 'Create a new database as a child of a page',
      params: [
        { name: 'parent.page_id', type: 'string', required: true, description: 'Parent page ID' },
        { name: 'title', type: 'array', required: true, description: 'Rich text array for database title' },
        { name: 'properties', type: 'object', required: true, description: 'Property schema definitions' }
      ],
      responseFields: [
        { name: 'id', type: 'string', description: 'Database ID' },
        { name: 'url', type: 'string', description: 'URL to the database' }
      ]
    },
    {
      id: 'notion-search',
      name: 'Search',
      method: 'POST',
      path: '/search',
      description: 'Search across all pages and databases',
      params: [
        { name: 'query', type: 'string', required: false, description: 'Search query text' },
        { name: 'filter.value', type: 'string', required: false, description: '"page" or "database"' },
        { name: 'sort.direction', type: 'string', required: false, description: '"ascending" or "descending"' }
      ],
      responseFields: [
        { name: 'results', type: 'array', description: 'Matching pages/databases' },
        { name: 'has_more', type: 'boolean', description: 'More results available' }
      ]
    }
  ]
};
