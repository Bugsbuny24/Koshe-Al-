// ─── University / Course types ───────────────────────────────────────────────

export type CourseUnit = {
  id: string;
  order: number;
  title: string;
  description: string;
  topics: string[];
};

export type CourseLevel = {
  level: string; // A1, A2, B1, B2, C1, C2
  title: string;
  description: string;
  units: CourseUnit[];
  badgeCode: string;
  badgeImageUrl: string;
  certificateImageUrl: string | null;
};

export type Department = {
  code: string; // language code
  name: string;
  nativeName: string;
  icon: string;
  description: string;
  levels: CourseLevel[];
};

// ─── Enrollment / Progress types ─────────────────────────────────────────────

export type EnrollmentStatus = "active" | "completed" | "paused";

export type EnrollmentRecord = {
  id: string;
  user_id: string;
  course_id: string;
  language_code: string;
  level: string;
  progress_percent: number;
  current_unit: number;
  completed_units_count: number;
  total_units_count: number;
  status: EnrollmentStatus;
  created_at: string;
  updated_at: string;
};

export type UnitProgressRecord = {
  id: string;
  user_id: string;
  course_id: string;
  unit_id: string;
  unit_order: number;
  completed: boolean;
  score: number | null;
  completed_at: string | null;
};

// ─── Achievement / Badge types ────────────────────────────────────────────────

export type BadgeLevel = "beginner" | "mid" | "advanced" | "master";

export type AchievementRecord = {
  id: string;
  user_id: string;
  code: string;
  title: string;
  description: string | null;
  image_url: string | null;
  level: string | null;
  earned_at: string;
};

export type BadgeDefinition = {
  code: string;
  title: string;
  description: string;
  image_url: string;
  level: string;
  progressThreshold: number; // 0-100, progress % needed
};

// ─── Certificate types ────────────────────────────────────────────────────────

export type CertificateRecord = {
  id: string;
  user_id: string;
  course_id: string;
  language_code: string;
  level: string;
  title: string;
  image_url: string | null;
  issued_at: string;
};

// ─── NFT-ready Collectible Reward types ──────────────────────────────────────

export type MintStatus = "draft" | "ready" | "minted";
export type MarketplaceStatus = "hidden" | "listed" | "sold_ready";
export type CollectibleSourceType = "badge" | "certificate";

export type CollectibleRewardRecord = {
  id: string;
  user_id: string;
  source_type: CollectibleSourceType;
  source_id: string;
  token_name: string;
  token_symbol: string;
  metadata_json: CollectibleMetadata;
  image_url: string;
  rarity: string;
  mint_status: MintStatus;
  downloadable_file_url: string | null;
  marketplace_status: MarketplaceStatus;
  created_at: string;
};

export type CollectibleMetadata = {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string | number }>;
  language?: string;
  level?: string;
  earned_at?: string;
};

export type CreateCollectiblePayload = {
  source_type: CollectibleSourceType;
  source_id: string;
  token_name: string;
  token_symbol: string;
  metadata_json: CollectibleMetadata;
  image_url: string;
  rarity: string;
  downloadable_file_url?: string;
};
