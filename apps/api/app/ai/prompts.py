from app.models.campaign import CampaignBrief, AdFormat


def build_generation_prompt(brief: CampaignBrief) -> str:
    ad_formats = brief.ad_formats or []
    format_instructions = []

    if AdFormat.BANNER.value in ad_formats or "BANNER" in ad_formats:
        format_instructions.append("""
For Banner Ads, generate:
- "banner_ads": {
    "headlines": [8-12 short headlines, max 30 chars each],
    "descriptions": [4 descriptions, max 90 chars each],
    "cta_suggestions": [4-6 CTA button text options],
    "image_brief": "description of ideal banner image/creative"
  }""")

    if AdFormat.NATIVE_CARD.value in ad_formats or "NATIVE_CARD" in ad_formats:
        format_instructions.append("""
For Native Card Ads, generate:
- "native_card_ads": {
    "headlines": [5-8 headline variations, max 60 chars each],
    "body_texts": [3 body text variations, 100-200 chars each],
    "cta_suggestions": [3-4 CTA options],
    "image_brief": "description of ideal native card image",
    "angle_summary": "the core marketing angle being used"
  }""")

    if AdFormat.PROMOTED_LISTING.value in ad_formats or "PROMOTED_LISTING" in ad_formats:
        format_instructions.append("""
For Promoted Listing Ads, generate:
- "promoted_listing_ads": {
    "titles": [5-8 listing title variations, max 80 chars each],
    "descriptions": [3 short descriptions, max 120 chars each],
    "price_callouts": [3-4 price or offer callout lines],
    "cta_suggestions": [3 CTA options]
  }""")

    if AdFormat.FEED_CARD.value in ad_formats or "FEED_CARD" in ad_formats:
        format_instructions.append("""
For Feed Card Ads, generate:
- "feed_card_ads": {
    "headlines": [5-8 headline variations, max 60 chars each],
    "body_texts": [3 body text variations, 150-300 chars each],
    "cta_suggestions": [3-4 CTA options],
    "image_brief": "description of ideal feed card image",
    "angle_summary": "the core marketing angle"
  }""")

    if AdFormat.VIDEO.value in ad_formats or "VIDEO" in ad_formats:
        format_instructions.append("""
For Video Ads, generate:
- "video_ads": {
    "hooks": [5 attention-grabbing opening lines for video],
    "scripts": [3 short 15-30 second video scripts],
    "captions": [3 caption variations],
    "cta_suggestions": [3 CTA options],
    "video_brief": "detailed video concept and direction"
  }""")

    format_section = "\n".join(format_instructions) if format_instructions else "Generate ads for all formats."

    return f"""You are an expert digital advertising copywriter and strategist for a proprietary ad network.

Generate high-converting ad copy for the following campaign brief. Return ONLY valid JSON with no markdown code blocks.

CAMPAIGN BRIEF:
- Campaign Name: {brief.name}
- Objective: {brief.objective.value if hasattr(brief.objective, 'value') else brief.objective}
- Tone of Voice: {brief.tone.value if hasattr(brief.tone, 'value') else brief.tone}
- Ad Formats: {', '.join(ad_formats)}
- Product/Service Description: {brief.product_description or 'Not specified'}
- Website URL: {brief.website_url or 'Not specified'}
- Country/Region: {brief.country_region or 'Not specified'}
- Language: {brief.language or 'English'}
- Special Offer: {brief.offer or 'None'}
- Budget Range: {brief.budget_range or 'Not specified'}
- Landing Page Angle: {brief.landing_page_angle or 'Not specified'}
- Preferred CTA: {brief.cta_preference or 'Not specified'}
- Special Notes: {brief.special_notes or 'None'}

INSTRUCTIONS:
{format_section}

Also include these top-level fields in the JSON:
- "brand_safe_summary": brief summary of the brand-safe approach taken
- "compliance_notes": any compliance or legal considerations
- "rewrite_suggestions": [3-5 suggestions for improving the copy]
- "creative_directions": [3-5 creative direction ideas for visuals]

Return ONLY valid JSON, no explanation, no markdown code blocks.
"""


def build_regeneration_prompt(brief: CampaignBrief, ad_format: str) -> str:
    return f"""You are an expert digital advertising copywriter for a proprietary ad network.

Regenerate fresh ad copy for the {ad_format} format only for the following campaign:
- Campaign Name: {brief.name}
- Objective: {brief.objective.value if hasattr(brief.objective, 'value') else brief.objective}
- Tone: {brief.tone.value if hasattr(brief.tone, 'value') else brief.tone}
- Product: {brief.product_description or 'Not specified'}
- Special Notes: {brief.special_notes or 'None'}

Return ONLY valid JSON with the {ad_format.lower()}_ads key containing fresh variations.
Make them notably different from typical outputs — be creative and bold.
"""
