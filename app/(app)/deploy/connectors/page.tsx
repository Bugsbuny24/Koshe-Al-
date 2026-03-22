import { PlannedModulePage } from '@/components/common/PlannedModulePage';

export default function DeployConnectorsPage() {
  return (
    <PlannedModulePage
      title="Deploy Connectors"
      version="V6"
      summary="Connect and configure deployment targets. Supports Vercel, Netlify, static export, and custom webhooks."
      status="scaffolded"
      plannedCapabilities={[
        'Vercel connector',
        'Netlify connector',
        'Static export',
        'Generic webhook',
        'Connection management',
      ]}
      dependsOn={['deploy']}
      ownerLayer="delivery"
      flagKey="V6_DEPLOY_CONNECTORS"
    />
  );
}
