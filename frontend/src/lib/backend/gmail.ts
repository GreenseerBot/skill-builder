import { Connector } from './types';

export const gmailConnector: Connector = {
  id: 'gmail',
  name: 'Gmail',
  icon: '📧',
  description: 'Gmail — send, search, and manage email messages',
  authType: 'bearer',
  authEnvVar: 'GOOGLE_ACCESS_TOKEN',
  baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me',
  defaultHeaders: {
    'Authorization': 'Bearer ${GOOGLE_ACCESS_TOKEN}',
    'Content-Type': 'application/json'
  },
  endpoints: [
    {
      id: 'gmail-send',
      name: 'Send Email',
      method: 'POST',
      path: '/messages/send',
      description: 'Send an email message',
      params: [
        { name: 'raw', type: 'string', required: true, description: 'Base64url-encoded RFC 2822 email' },
        { name: 'threadId', type: 'string', required: false, description: 'Thread ID to reply to' }
      ],
      responseFields: [
        { name: 'id', type: 'string', description: 'Message ID' },
        { name: 'threadId', type: 'string', description: 'Thread ID' },
        { name: 'labelIds', type: 'array', description: 'Applied labels' }
      ]
    },
    {
      id: 'gmail-search',
      name: 'Search Messages',
      method: 'GET',
      path: '/messages',
      description: 'Search messages with Gmail query syntax',
      params: [
        { name: 'q', type: 'string', required: false, description: 'Gmail search query (e.g. "from:user@example.com")' },
        { name: 'maxResults', type: 'number', required: false, description: 'Max messages to return' },
        { name: 'labelIds', type: 'array', required: false, description: 'Filter by label IDs' }
      ],
      responseFields: [
        { name: 'messages', type: 'array', description: 'Array of {id, threadId}' },
        { name: 'resultSizeEstimate', type: 'number', description: 'Estimated total results' }
      ]
    },
    {
      id: 'gmail-get-message',
      name: 'Get Message',
      method: 'GET',
      path: '/messages/{id}',
      description: 'Get a specific email message with full content',
      params: [
        { name: 'id', type: 'string', required: true, in: 'path', description: 'Message ID' },
        { name: 'format', type: 'string', required: false, description: 'full, metadata, minimal, raw' }
      ],
      responseFields: [
        { name: 'id', type: 'string', description: 'Message ID' },
        { name: 'snippet', type: 'string', description: 'Short text preview' },
        { name: 'payload.headers', type: 'array', description: 'Email headers (From, To, Subject, Date)' },
        { name: 'payload.body.data', type: 'string', description: 'Base64url body content' }
      ]
    },
    {
      id: 'gmail-list-labels',
      name: 'List Labels',
      method: 'GET',
      path: '/labels',
      description: 'List all labels in the mailbox',
      params: [],
      responseFields: [
        { name: 'labels', type: 'array', description: 'Array of label objects with id, name, type' }
      ]
    },
    {
      id: 'gmail-create-draft',
      name: 'Create Draft',
      method: 'POST',
      path: '/drafts',
      description: 'Create an email draft',
      params: [
        { name: 'message.raw', type: 'string', required: true, description: 'Base64url-encoded RFC 2822 email' },
        { name: 'message.threadId', type: 'string', required: false, description: 'Thread to attach draft to' }
      ],
      responseFields: [
        { name: 'id', type: 'string', description: 'Draft ID' },
        { name: 'message.id', type: 'string', description: 'Underlying message ID' }
      ]
    }
  ]
};
