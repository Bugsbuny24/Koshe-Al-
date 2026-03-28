from app.ai.schemas import (
    FullAdGenOutput, BannerAdOutput, NativeCardAdOutput,
    PromotedListingAdOutput, FeedCardAdOutput, VideoAdOutput,
)
from app.models.campaign import AdFormat


def get_mock_output(brief) -> FullAdGenOutput:
    ad_formats = brief.ad_formats or []
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

    if AdFormat.BANNER.value in ad_formats or "BANNER" in ad_formats:
        output.banner_ads = BannerAdOutput(
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
            ],
            descriptions=[
                f"Discover {product}. Start today and see results. No commitment required.",
                f"Join thousands of happy customers. {name} delivers real value every time.",
                f"Fast, reliable, and affordable. Try {name} risk-free with our 30-day guarantee.",
                f"Don't miss out. Limited-time offer on {name}. Click to learn more.",
            ],
            cta_suggestions=["Learn More", "Get Started", "Try Free", "Shop Now"],
            image_brief=f"Clean banner with product imagery and brand colors. Bold headline overlaid on a vibrant background.",
        )

    if AdFormat.NATIVE_CARD.value in ad_formats or "NATIVE_CARD" in ad_formats:
        output.native_card_ads = NativeCardAdOutput(
            headlines=[
                f"Why {name} is the Smarter Choice",
                f"How {name} Saves You Time Every Day",
                f"{name}: The Solution You've Been Looking For",
                f"Thousands Trust {name} — Here's Why",
                f"Upgrade Your Results with {name}",
            ],
            body_texts=[
                f"Struggling with the status quo? {name} changes everything. Our {product} helps you achieve more in less time.",
                f"Why settle for less? {name} gives you the tools to succeed. Built for people who demand results.",
                f"Join 10,000+ customers who made the switch to {name}. {product} — trusted, proven, and easy to use.",
            ],
            cta_suggestions=["Learn More", "Get Started", "See How It Works"],
            image_brief=f"Authentic lifestyle image showing the product in natural use. Feature a confident person achieving a goal.",
            angle_summary=f"Empowerment and efficiency — helping the audience overcome their key pain points with {product}.",
        )

    if AdFormat.PROMOTED_LISTING.value in ad_formats or "PROMOTED_LISTING" in ad_formats:
        output.promoted_listing_ads = PromotedListingAdOutput(
            titles=[
                f"{name} — Official Listing",
                f"Buy {name} | Best Price Guaranteed",
                f"{name} | Fast & Reliable",
                f"Top-Rated {name} | Shop Now",
                f"{name} | Trusted by 10,000+",
            ],
            descriptions=[
                f"Discover {product}. Competitive pricing, fast delivery, and outstanding support.",
                f"Top-rated {name}. No hidden fees. Satisfaction guaranteed or your money back.",
                f"The best {product} on the market. Trusted by thousands of satisfied customers.",
            ],
            price_callouts=["Starting from $49", "Free trial available", "30-day money-back guarantee", "No setup fees"],
            cta_suggestions=["Shop Now", "View Listing", "Get Price"],
        )

    if AdFormat.FEED_CARD.value in ad_formats or "FEED_CARD" in ad_formats:
        output.feed_card_ads = FeedCardAdOutput(
            headlines=[
                f"Transform Your Results with {name}",
                f"The {product} That Actually Works",
                f"Stop Wasting Time — Try {name}",
                f"Real Results with {name}",
                f"Join the {name} Community Today",
            ],
            body_texts=[
                f"⚡ Limited offer: Get {name} at our best price yet. {product} is trusted by 10,000+ customers worldwide. Don't miss your chance to level up.",
                f"Real talk — {name} is the {product} you didn't know you needed. Powerful, intuitive, and built for results.",
                f"Tired of solutions that overpromise? {name} delivers. See why thousands of customers choose us every month.",
            ],
            cta_suggestions=["Learn More", "Start Free Trial", "Get Started"],
            image_brief=f"Bright, energetic image showing the product in use. Feature a smiling person achieving success with bold brand colors.",
            angle_summary=f"Social proof and transformation — showing how {product} helps real people achieve real results.",
        )

    if AdFormat.VIDEO.value in ad_formats or "VIDEO" in ad_formats:
        output.video_ads = VideoAdOutput(
            hooks=[
                f"Wait... you haven't tried {name} yet? 😱",
                f"This changed everything for us 👀",
                f"POV: You finally found the solution you needed",
                f"I wish I knew about {name} sooner",
                f"Stop scrolling — this is actually important",
            ],
            scripts=[
                f"[Opens with surprised look] Okay so hear me out. We were struggling with [problem] for years. Then we discovered {name}. [Shows product] Three weeks later? [Shows result]. Check the link — seriously.",
                f"[Fast cuts] Problem. Problem. Problem. [Pause] Solution: {name}. [Demo] Simple, right? This actually works. Go check it out.",
                f"[Talking to camera] Real talk — {name} is the {product} we didn't know we needed. Here's why. [3 quick points]. That's it. That's why.",
            ],
            captions=[
                f"This is your sign to try {name} 🔥 {product} that actually delivers. #fyp #{name.replace(' ', '')}",
                f"Game changer alert 🚨 {name} is the {product} everyone's talking about. Don't sleep on this! #trending",
                f"Obsessed with {name} right now 💯 {product} for anyone who wants real results. #recommended",
            ],
            cta_suggestions=["Visit our site", "Start free trial", "Learn more"],
            video_brief=f"15-30 second video. Start with a hook showing a relatable problem. Cut to product reveal with upbeat music. Show 2-3 quick benefits with text overlays. End with clear CTA and product shot.",
        )

    return output
