from typing import Optional, List
from pydantic import BaseModel


class BannerAdOutput(BaseModel):
    headlines: List[str] = []
    descriptions: List[str] = []
    cta_suggestions: List[str] = []
    image_brief: str = ""


class NativeCardAdOutput(BaseModel):
    headlines: List[str] = []
    body_texts: List[str] = []
    cta_suggestions: List[str] = []
    image_brief: str = ""
    angle_summary: str = ""


class PromotedListingAdOutput(BaseModel):
    titles: List[str] = []
    descriptions: List[str] = []
    price_callouts: List[str] = []
    cta_suggestions: List[str] = []


class FeedCardAdOutput(BaseModel):
    headlines: List[str] = []
    body_texts: List[str] = []
    cta_suggestions: List[str] = []
    image_brief: str = ""
    angle_summary: str = ""


class VideoAdOutput(BaseModel):
    hooks: List[str] = []
    scripts: List[str] = []
    captions: List[str] = []
    cta_suggestions: List[str] = []
    video_brief: str = ""


class FullAdGenOutput(BaseModel):
    banner_ads: Optional[BannerAdOutput] = None
    native_card_ads: Optional[NativeCardAdOutput] = None
    promoted_listing_ads: Optional[PromotedListingAdOutput] = None
    feed_card_ads: Optional[FeedCardAdOutput] = None
    video_ads: Optional[VideoAdOutput] = None
    brand_safe_summary: str = ""
    compliance_notes: str = ""
    rewrite_suggestions: List[str] = []
    creative_directions: List[str] = []
