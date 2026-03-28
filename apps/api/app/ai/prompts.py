from app.models.campaign import CampaignBrief, Platform


def build_generation_prompt(brief: CampaignBrief) -> str:
    platforms = brief.platforms or []
    platform_instructions = []

    if Platform.GOOGLE.value in platforms or "GOOGLE" in platforms:
        platform_instructions.append("""
For Google Ads, generate:
- "google_ads": {
    "headlines": [10-15 headlines, max 30 chars each],
    "descriptions": [4 descriptions, max 90 chars each],
    "keyword_themes": [8-12 keyword theme ideas],
    "sitelink_ideas": [{"title": "...", "description": "..."}, ...] (4-6 sitelinks),
    "callout_ideas": [6-8 callout extensions, max 25 chars each]
  }""")

    if Platform.META.value in platforms or "META" in platforms:
        platform_instructions.append("""
For Meta Ads, generate:
- "meta_ads": {
    "primary_texts": [3 primary text variations, 100-300 chars each],
    "headlines": [5 headline variations, max 40 chars each],
    "cta_suggestions": [3 CTA button text options],
    "image_creative_brief": "description of ideal image/creative",
    "angle_summary": "the core marketing angle being used"
  }""")

    if Platform.TIKTOK.value in platforms or "TIKTOK" in platforms:
        platform_instructions.append("""
For TikTok Ads, generate:
- "tiktok_ads": {
    "hooks": [5 attention-grabbing opening lines for video],
    "short_scripts": [3 short 15-30 second video scripts],
    "captions": [3 caption variations with hashtags],
    "cta_suggestions": [3 CTA options],
    "ugc_brief": "brief for user-generated content creators",
    "video_prompt": "detailed video concept and direction"
  }""")

    platform_section = "\n".join(platform_instructions) if platform_instructions else "Generate ads for all platforms."

    return f"""You are an expert digital advertising copywriter and strategist.

Generate high-converting ad copy for the following campaign brief. Return ONLY valid JSON with no markdown code blocks.

CAMPAIGN BRIEF:
- Campaign Name: {brief.name}
- Objective: {brief.objective.value if hasattr(brief.objective, 'value') else brief.objective}
- Tone of Voice: {brief.tone.value if hasattr(brief.tone, 'value') else brief.tone}
- Target Platforms: {', '.join(platforms)}
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
{platform_section}

Also include these top-level fields in the JSON:
- "brand_safe_summary": brief summary of the brand-safe approach taken
- "compliance_notes": any compliance or legal considerations
- "rewrite_suggestions": [3-5 suggestions for improving the copy]
- "creative_directions": [3-5 creative direction ideas for visuals]

Return ONLY valid JSON, no explanation, no markdown code blocks.
"""


def build_regeneration_prompt(brief: CampaignBrief, platform: str) -> str:
    return f"""You are an expert digital advertising copywriter.

Regenerate fresh ad copy for the {platform} platform only for the following campaign:
- Campaign Name: {brief.name}
- Objective: {brief.objective.value if hasattr(brief.objective, 'value') else brief.objective}
- Tone: {brief.tone.value if hasattr(brief.tone, 'value') else brief.tone}
- Product: {brief.product_description or 'Not specified'}
- Special Notes: {brief.special_notes or 'None'}

Return ONLY valid JSON with the {platform.lower()}_ads key containing fresh variations.
Make them notably different from typical outputs - be creative and bold.
"""
