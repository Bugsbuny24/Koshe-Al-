export type ConnectorType = 'vercel' | 'netlify' | 'static_export' | 'generic_webhook' | 'custom';
export type DeployStatus = 'idle' | 'pending' | 'deploying' | 'success' | 'failed' | 'cancelled';
export type PublishTargetType = 'web' | 'cdn' | 'api' | 'static' | 'container';

export type DeployConnector = {
  id: string;
  type: ConnectorType;
  name: string;
  description: string;
  icon: string;
  status: 'available' | 'connected' | 'coming_soon';
  config_schema?: Record<string, unknown>;
};

export type DeployTarget = {
  id: string;
  connector_id: string;
  name: string;
  url?: string;
  environment: 'production' | 'staging' | 'preview';
  status: DeployStatus;
  last_deployed_at?: string;
};

export type PublishHistory = {
  id: string;
  target_id: string;
  connector_type: ConnectorType;
  artifact_id?: string;
  status: DeployStatus;
  deployed_at: string;
  duration_seconds?: number;
  log_url?: string;
};
