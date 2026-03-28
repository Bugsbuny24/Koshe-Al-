from app.ai.schemas import FullAdGenOutput, GoogleAdsOutput, MetaAdsOutput, TikTokAdsOutput, SitelinkIdea
from app.models.campaign import Platform


def get_mock_output(brief) -> FullAdGenOutput:
    platforms = brief.platforms or []
    product = brief.product_description or "our product"
    name = brief.name or "Campaign"

    output = FullAdGenOutput(
        brand_safe_summary=f"Brand-safe messaging focused on the core value proposition of {product}.",
        compliance_notes="Ensure all claims are substantiated. Avoid superlatives without evidence.",
        rewrite_suggestions=[
            "Test a question-based headline to increase curiosity",
            "Add social proof numbers if available",
            "Try a more urgent CTA for conversion campaigns",
            "A/B test emotional vs. rational appeals",
            "Consider seasonal messaging variations",
        ],
        creative_directions=[
            "Clean, minimal design with strong typography",
            "Lifestyle imagery showing product in real-world use",
            "Before/after split creative",
            "Bold color blocks with white text for mobile",
            "User-generated content style for authenticity",
        ],
    )

    if Platform.GOOGLE.value in platforms or "GOOGLE" in platforms:
        output.google_ads = GoogleAdsOutput(
            headlines=[
                f"Get {name} Today",
                "Save Time & Money",
                "Trusted by Thousands",
                f"Try {name} Free",
                "No Hidden Fees",
                "Fast & Reliable",
                "Start in Minutes",
                "Join 10,000+ Users",
                "Best Value Guaranteed",
                "Limited Time Offer",
                f"{name} — Official Site",
                "Shop Now & Save",
            ],
            descriptions=[
                f"Discover {product}. Start today and see results. No commitment required.",
                f"Join thousands of happy customers. {name} delivers real value every time.",
                f"Fast, reliable, and affordable. Try {name} risk-free with our 30-day guarantee.",
                f"Don't miss out. Limited-time offer on {name}. Click to learn more.",
            ],
            keyword_themes=[
                product, name, "best solution", "affordable option", "top rated",
                "buy online", "fast delivery", "customer reviews", "free trial",
            ],
            sitelink_ideas=[
                SitelinkIdea(title="Pricing Plans", description="Flexible plans for every budget"),
                SitelinkIdea(title="Customer Reviews", description="See what users are saying"),
                SitelinkIdea(title="Free Trial", description="Try it free for 30 days"),
                SitelinkIdea(title="Contact Us", description="We're here to help 24/7"),
            ],
            callout_ideas=[
                "Free Shipping", "24/7 Support", "Money-Back Guarantee",
                "No Setup Fees", "Trusted Brand", "Fast Results",
            ],
        )

    if Platform.META.value in platforms or "META" in platforms:
        output.meta_ads = MetaAdsOutput(
            primary_texts=[
                f"Struggling with the status quo? {name} changes everything. Our {product} helps you achieve more in less time. Join thousands who made the switch. 👇",
                f"Why settle for less? {name} gives you the tools to succeed. {product} — built for people who demand results. Try it today and feel the difference.",
                f"⚡ Limited offer: Get {name} at our best price yet. {product} is trusted by 10,000+ customers worldwide. Don't miss your chance to level up.",
            ],
            headlines=[
                f"Try {name} Today",
                "Results Guaranteed",
                f"Get {name} Now",
                "Transform Your Results",
                "Join the Revolution",
            ],
            cta_suggestions=["Shop Now", "Learn More", "Get Started"],
            image_creative_brief=f"Bright, energetic image showing the product in use. Feature a smiling person achieving success. Use brand colors with a clear value proposition overlaid.",
            angle_summary=f"Empowerment and transformation — helping the target audience overcome their key pain points with {product}.",
        )

    if Platform.TIKTOK.value in platforms or "TIKTOK" in platforms:
        output.tiktok_ads = TikTokAdsOutput(
            hooks=[
                f"Wait... you haven't tried {name} yet? 😱",
                f"This changed everything for me 👀",
                f"POV: You finally found the solution you needed",
                f"I wish I knew about {name} sooner",
                f"Stop scrolling — this is actually important",
            ],
            short_scripts=[
                f"[Opens with surprised face] Okay so hear me out. I've been struggling with [problem] for years. Then someone told me about {name}. [Shows product] Three weeks later? [Shows result]. The link is in my bio, seriously.",
                f"[Fast cuts] Problem. Problem. Problem. [Pause] Solution: {name}. [Demo] Simple, right? I'm not even joking, this works. Go check it out.",
                f"[Talking to camera] Real talk — {name} is the {product} I didn't know I needed. Here's why. [3 quick points]. That's it. That's why. #ad",
            ],
            captions=[
                f"This is your sign to try {name} 🔥 {product} that actually delivers. Link in bio! #fyp #{name.replace(' ', '')}",
                f"Game changer alert 🚨 {name} is the {product} everyone's talking about. Don't sleep on this! #viral #trending",
                f"Obsessed with {name} rn 💯 {product} for anyone who wants real results. Comment 'INFO' for the link! #recommended",
            ],
            cta_suggestions=["Link in bio", "Shop now", "Comment for info"],
            ugc_brief=f"Looking for creators aged 22-35 to authentically showcase {name}. Show your genuine first reaction to the product, demonstrate one key benefit in a natural setting, and share your honest experience. Avoid overly polished production — keep it real and relatable.",
            video_prompt=f"15-30 second video. Start with a hook showing a relatable problem. Cut to product reveal with upbeat music. Show 2-3 quick benefits with text overlays. End with clear CTA and product shot. Use trending audio if applicable.",
        )

    return output
