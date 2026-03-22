import { PlannedModulePage } from '@/components/common/PlannedModulePage';

export default function OffersPage() {
  return (
    <PlannedModulePage
      title="Offer System"
      version="V10"
      summary="Define, manage, and deploy offers across products, services, subscriptions, and bundles."
      status="scaffolded"
      plannedCapabilities={[
        'Offer definition builder',
        'Offer type registry',
        'Segment targeting',
        'Pricing configuration',
        'Offer status lifecycle',
      ]}
      dependsOn={['execution', 'production']}
      ownerLayer="production"
      flagKey="V10_REVENUE_OPERATOR"
    />
  );
}
