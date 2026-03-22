export type FunnelStage = 'awareness' | 'interest' | 'consideration' | 'intent' | 'conversion' | 'retention';
export type OfferType = 'product' | 'service' | 'subscription' | 'bundle' | 'upsell' | 'cross_sell';
export type GrowthAssetType = 'landing_page' | 'email_sequence' | 'social_content' | 'case_study' | 'proposal' | 'pitch_deck';
export type RevenueSignalType = 'pipeline_growth' | 'conversion_rate' | 'average_deal_size' | 'churn_risk' | 'expansion_opportunity';

export type RevenueSignal = {
  id: string;
  type: RevenueSignalType;
  title: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  period: string;
  insight?: string;
};

export type FunnelDefinition = {
  id: string;
  name: string;
  description: string;
  stages: FunnelStageConfig[];
  target_audience: string;
  created_at: string;
};

export type FunnelStageConfig = {
  stage: FunnelStage;
  name: string;
  description: string;
  conversion_target?: number;
  assets: string[];
};

export type OfferDefinition = {
  id: string;
  type: OfferType;
  name: string;
  description: string;
  value_proposition: string;
  target_segment: string;
  price_range?: string;
  status: 'draft' | 'active' | 'archived';
};

export type GrowthAsset = {
  id: string;
  type: GrowthAssetType;
  name: string;
  description: string;
  funnel_stages: FunnelStage[];
  status: 'planned' | 'in_progress' | 'ready' | 'deployed';
};
