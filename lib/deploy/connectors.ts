import type { ConnectorType, DeployConnector } from '@/types/deploy';

export const DEPLOY_CONNECTORS: DeployConnector[] = [
  {
    id: 'vercel',
    type: 'vercel',
    name: 'Vercel',
    description: 'Deploy to Vercel with automatic previews and production deployments.',
    icon: '▲',
    status: 'coming_soon',
  },
  {
    id: 'netlify',
    type: 'netlify',
    name: 'Netlify',
    description: 'Deploy to Netlify with CDN-backed static and serverless functions.',
    icon: '⬡',
    status: 'coming_soon',
  },
  {
    id: 'static_export',
    type: 'static_export',
    name: 'Static Export',
    description: 'Export artifacts as a static bundle for self-hosted deployments.',
    icon: '📦',
    status: 'coming_soon',
  },
  {
    id: 'generic_webhook',
    type: 'generic_webhook',
    name: 'Generic Webhook',
    description: 'Trigger any deployment pipeline via a configurable HTTP webhook.',
    icon: '🔗',
    status: 'coming_soon',
  },
];

export function getConnectorConfig(type: ConnectorType): DeployConnector | undefined {
  return DEPLOY_CONNECTORS.find((c) => c.type === type);
}
