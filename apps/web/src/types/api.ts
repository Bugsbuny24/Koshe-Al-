// Enums
export type Platform = 'GOOGLE' | 'META' | 'TIKTOK'
export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
export type CampaignObjective = 'TRAFFIC' | 'LEADS' | 'SALES' | 'ENGAGEMENT' | 'AWARENESS'
export type ToneOfVoice = 'PROFESSIONAL' | 'PREMIUM' | 'CASUAL' | 'AGGRESSIVE' | 'EDUCATIONAL'

// Entities
export interface User {
  id: string
  email: string
  full_name: string
  created_at: string
}

export interface Workspace {
  id: string
  name: string
  slug: string
}

export interface Brand {
  id: string
  name: string
  description: string
  website_url: string
  created_at: string
}

export interface Product {
  id: string
  brand_id: string
  name: string
  description: string
  category: string
  price_point: string
  created_at: string
}

export interface Audience {
  id: string
  name: string
  age_range: string
  gender: string
  interests: string[]
  locations: string[]
  languages: string[]
}

export interface CampaignBrief {
  id: string
  name: string
  brand_id: string
  product_id?: string
  audience_id?: string
  product_description: string
  website_url: string
  country_region: string
  language: string
  objective: CampaignObjective
  tone: ToneOfVoice
  platforms: Platform[]
  offer: string
  budget_range: string
  landing_page_angle: string
  cta_preference: string
  special_notes?: string
  created_at: string
}

export interface GenerationJob {
  id: string
  campaign_brief_id: string
  status: JobStatus
  error_message?: string
  created_at: string
}

export interface GeneratedAdVariant {
  id: string
  platform: Platform
  variant_type: string
  content: Record<string, unknown>
  is_favorite: boolean
}

export interface GeneratedAdSet {
  id: string
  campaign_brief_id: string
  raw_json: Record<string, unknown>
  variants: GeneratedAdVariant[]
  created_at: string
}

// API Response wrappers
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
}

export interface ApiError {
  detail: string
  status?: number
}

// Google Ads content structure
export interface GoogleAdsContent {
  headlines: string[]
  descriptions: string[]
  keyword_themes: string[]
  sitelink_ideas: Array<{ title: string; description: string }>
  callout_ideas: string[]
}

// Meta Ads content structure
export interface MetaAdsContent {
  primary_texts: string[]
  headlines: string[]
  cta_suggestions: string[]
  image_creative_brief: string
  angle_summary: string
}

// TikTok Ads content structure
export interface TikTokAdsContent {
  hooks: string[]
  short_scripts: string[]
  captions: string[]
  cta_suggestions: string[]
  ugc_brief: string
  video_prompt: string
}

export interface PlatformContent {
  google?: GoogleAdsContent
  meta?: MetaAdsContent
  tiktok?: TikTokAdsContent
}
