from typing import Optional, List
from pydantic import BaseModel


class SitelinkIdea(BaseModel):
    title: str
    description: str


class GoogleAdsOutput(BaseModel):
    headlines: List[str] = []
    descriptions: List[str] = []
    keyword_themes: List[str] = []
    sitelink_ideas: List[SitelinkIdea] = []
    callout_ideas: List[str] = []


class MetaAdsOutput(BaseModel):
    primary_texts: List[str] = []
    headlines: List[str] = []
    cta_suggestions: List[str] = []
    image_creative_brief: str = ""
    angle_summary: str = ""


class TikTokAdsOutput(BaseModel):
    hooks: List[str] = []
    short_scripts: List[str] = []
    captions: List[str] = []
    cta_suggestions: List[str] = []
    ugc_brief: str = ""
    video_prompt: str = ""


class FullAdGenOutput(BaseModel):
    google_ads: Optional[GoogleAdsOutput] = None
    meta_ads: Optional[MetaAdsOutput] = None
    tiktok_ads: Optional[TikTokAdsOutput] = None
    brand_safe_summary: str = ""
    compliance_notes: str = ""
    rewrite_suggestions: List[str] = []
    creative_directions: List[str] = []
