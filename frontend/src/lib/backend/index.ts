import { notionConnector } from './notion';
import { jiraConnector } from './jira';
import { sheetsConnector } from './sheets';
import { gmailConnector } from './gmail';
import { githubConnector } from './github';
import { Connector } from './types';

export const connectors: Connector[] = [
  notionConnector,
  jiraConnector,
  sheetsConnector,
  gmailConnector,
  githubConnector
];

export const connectorsMap = new Map<string, Connector>(
  connectors.map(c => [c.id, c])
);
