export interface EndpointParam {
  name: string;
  type: string;
  required: boolean;
  in?: string;
  description: string;
}

export interface ResponseField {
  name: string;
  type: string;
  description: string;
}

export interface Endpoint {
  id: string;
  name: string;
  method: string;
  path?: string;
  description: string;
  params?: EndpointParam[];
  responseFields?: ResponseField[];
}

export interface Connector {
  id: string;
  name: string;
  icon: string;
  description: string;
  authType?: string;
  authEnvVar?: string;
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  endpoints: Endpoint[];
}

export interface WorkflowStep {
  id: string;
  connectorId: string;
  endpointId: string;
  config: Record<string, any>;
  outputAlias?: string;
  order: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}
