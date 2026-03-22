export type CapabilityStatus = 'planned' | 'scaffolded' | 'active';

export type ModuleStage = 'concept' | 'scaffold' | 'beta' | 'stable';

export type RoadmapVersion =
  | 'v1'
  | 'v2'
  | 'v3'
  | 'v4'
  | 'v5'
  | 'v6'
  | 'v7'
  | 'v8'
  | 'v9'
  | 'v10'
  | 'v11'
  | 'v12'
  | 'v13'
  | 'v14'
  | 'v15'
  | 'v16'
  | 'v17'
  | 'v18'
  | 'v19'
  | 'v20';

export type LayerOwner =
  | 'intake'
  | 'planning'
  | 'production'
  | 'delivery'
  | 'intelligence';

export type FutureModuleDescriptor = {
  id: string;
  name: string;
  version: RoadmapVersion;
  stage: ModuleStage;
  status: CapabilityStatus;
  summary: string;
  owner_layer: LayerOwner;
  route_prefix: string;
  planned_capabilities: string[];
  depends_on: string[];
  flag_key: string;
};

export type DBTableStage = 'active_core' | 'scaffolded' | 'risky_excluded';

export type DBRiskLevel = 'safe' | 'regulated' | 'prohibited';

export type DBModuleDescriptor = {
  module: string;
  version_range: [RoadmapVersion, RoadmapVersion] | [RoadmapVersion];
  table_names: string[];
  stage: DBTableStage;
  risk_level: DBRiskLevel;
  active: boolean;
  migration_file?: string;
};
