// Enums
export type AdFormat = 'BANNER' | 'NATIVE_CARD' | 'PROMOTED_LISTING' | 'FEED_CARD' | 'VIDEO'
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
  ad_formats: AdFormat[]
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
  ad_format: AdFormat
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

// Banner Ad content structure
export interface BannerAdContent {
  headlines: string[]
  descriptions: string[]
  cta_suggestions: string[]
  image_brief: string
}

// Native Card Ad content structure
export interface NativeCardAdContent {
  headlines: string[]
  body_texts: string[]
  cta_suggestions: string[]
  image_brief: string
  angle_summary: string
}

// Promoted Listing Ad content structure
export interface PromotedListingAdContent {
  titles: string[]
  descriptions: string[]
  price_callouts: string[]
  cta_suggestions: string[]
}

// Feed Card Ad content structure
export interface FeedCardAdContent {
  headlines: string[]
  body_texts: string[]
  cta_suggestions: string[]
  image_brief: string
  angle_summary: string
}

// Video Ad content structure
export interface VideoAdContent {
  hooks: string[]
  scripts: string[]
  captions: string[]
  cta_suggestions: string[]
  video_brief: string
}

export interface AdFormatContent {
  banner_ads?: BannerAdContent
  native_card_ads?: NativeCardAdContent
  promoted_listing_ads?: PromotedListingAdContent
  feed_card_ads?: FeedCardAdContent
  video_ads?: VideoAdContent
}
