import csv
import io
import json
from datetime import datetime, timezone
from typing import Any, Dict
from app.models.generation import GeneratedAdSet


class ExportService:
    @staticmethod
    def to_json(ad_set: GeneratedAdSet) -> str:
        return json.dumps(ad_set.raw_json, indent=2, default=str)

    @staticmethod
    def to_markdown(ad_set: GeneratedAdSet) -> str:
        raw = ad_set.raw_json
        lines = [f"# Ad Set Export\n\n**Generated:** {datetime.now(timezone.utc).isoformat()}\n"]

        if "banner_ads" in raw:
            b = raw["banner_ads"]
            lines.append("## Banner Ads\n")
            if b.get("headlines"):
                lines.append("### Headlines\n")
                for h in b["headlines"]:
                    lines.append(f"- {h}")
                lines.append("")
            if b.get("descriptions"):
                lines.append("### Descriptions\n")
                for d in b["descriptions"]:
                    lines.append(f"- {d}")
                lines.append("")
            if b.get("cta_suggestions"):
                lines.append("### CTA Suggestions\n")
                for c in b["cta_suggestions"]:
                    lines.append(f"- {c}")
                lines.append("")
            if b.get("image_brief"):
                lines.append(f"### Image Brief\n\n{b['image_brief']}\n")

        if "native_card_ads" in raw:
            n = raw["native_card_ads"]
            lines.append("## Native Card Ads\n")
            if n.get("headlines"):
                lines.append("### Headlines\n")
                for h in n["headlines"]:
                    lines.append(f"- {h}")
                lines.append("")
            if n.get("body_texts"):
                lines.append("### Body Texts\n")
                for i, t in enumerate(n["body_texts"], 1):
                    lines.append(f"---\n**Body {i}:** {t}\n")
            if n.get("cta_suggestions"):
                lines.append("### CTA Suggestions\n")
                for c in n["cta_suggestions"]:
                    lines.append(f"- {c}")
                lines.append("")
            if n.get("angle_summary"):
                lines.append(f"### Angle Summary\n\n{n['angle_summary']}\n")
            if n.get("image_brief"):
                lines.append(f"### Image Brief\n\n{n['image_brief']}\n")

        if "promoted_listing_ads" in raw:
            p = raw["promoted_listing_ads"]
            lines.append("## Promoted Listing Ads\n")
            if p.get("titles"):
                lines.append("### Titles\n")
                for t in p["titles"]:
                    lines.append(f"- {t}")
                lines.append("")
            if p.get("descriptions"):
                lines.append("### Descriptions\n")
                for d in p["descriptions"]:
                    lines.append(f"- {d}")
                lines.append("")
            if p.get("price_callouts"):
                lines.append("### Price Callouts\n")
                for c in p["price_callouts"]:
                    lines.append(f"- {c}")
                lines.append("")

        if "feed_card_ads" in raw:
            f = raw["feed_card_ads"]
            lines.append("## Feed Card Ads\n")
            if f.get("headlines"):
                lines.append("### Headlines\n")
                for h in f["headlines"]:
                    lines.append(f"- {h}")
                lines.append("")
            if f.get("body_texts"):
                lines.append("### Body Texts\n")
                for i, t in enumerate(f["body_texts"], 1):
                    lines.append(f"---\n**Body {i}:** {t}\n")
            if f.get("angle_summary"):
                lines.append(f"### Angle Summary\n\n{f['angle_summary']}\n")
            if f.get("image_brief"):
                lines.append(f"### Image Brief\n\n{f['image_brief']}\n")

        if "video_ads" in raw:
            v = raw["video_ads"]
            lines.append("## Video Ads\n")
            if v.get("hooks"):
                lines.append("### Hooks\n")
                for h in v["hooks"]:
                    lines.append(f"- {h}")
                lines.append("")
            if v.get("scripts"):
                lines.append("### Scripts\n")
                for i, s in enumerate(v["scripts"], 1):
                    lines.append(f"**Script {i}:**\n{s}\n")
            if v.get("captions"):
                lines.append("### Captions\n")
                for c in v["captions"]:
                    lines.append(f"- {c}")
                lines.append("")
            if v.get("video_brief"):
                lines.append(f"### Video Brief\n\n{v['video_brief']}\n")

        if raw.get("brand_safe_summary"):
            lines.append(f"## Brand Safe Summary\n\n{raw['brand_safe_summary']}\n")
        if raw.get("compliance_notes"):
            lines.append(f"## Compliance Notes\n\n{raw['compliance_notes']}\n")
        if raw.get("creative_directions"):
            lines.append("## Creative Directions\n")
            for d in raw["creative_directions"]:
                lines.append(f"- {d}")
            lines.append("")

        return "\n".join(lines)

    @staticmethod
    def to_txt(ad_set: GeneratedAdSet) -> str:
        raw = ad_set.raw_json
        lines = [f"AD SET EXPORT - {datetime.now(timezone.utc).isoformat()}", "=" * 60, ""]

        if "banner_ads" in raw:
            b = raw["banner_ads"]
            lines.append("BANNER ADS")
            lines.append("-" * 40)
            if b.get("headlines"):
                lines.append("Headlines:")
                for h in b["headlines"]:
                    lines.append(f"  • {h}")
            if b.get("descriptions"):
                lines.append("\nDescriptions:")
                for d in b["descriptions"]:
                    lines.append(f"  • {d}")
            if b.get("cta_suggestions"):
                lines.append("\nCTA Suggestions:")
                for c in b["cta_suggestions"]:
                    lines.append(f"  • {c}")
            lines.append("")

        if "native_card_ads" in raw:
            n = raw["native_card_ads"]
            lines.append("NATIVE CARD ADS")
            lines.append("-" * 40)
            if n.get("headlines"):
                lines.append("Headlines:")
                for h in n["headlines"]:
                    lines.append(f"  • {h}")
            if n.get("body_texts"):
                lines.append("\nBody Texts:")
                for i, t in enumerate(n["body_texts"], 1):
                    lines.append(f"\n  [Body {i}]\n  {t}")
            lines.append("")

        if "promoted_listing_ads" in raw:
            p = raw["promoted_listing_ads"]
            lines.append("PROMOTED LISTING ADS")
            lines.append("-" * 40)
            if p.get("titles"):
                lines.append("Titles:")
                for t in p["titles"]:
                    lines.append(f"  • {t}")
            if p.get("descriptions"):
                lines.append("\nDescriptions:")
                for d in p["descriptions"]:
                    lines.append(f"  • {d}")
            lines.append("")

        if "feed_card_ads" in raw:
            f = raw["feed_card_ads"]
            lines.append("FEED CARD ADS")
            lines.append("-" * 40)
            if f.get("headlines"):
                lines.append("Headlines:")
                for h in f["headlines"]:
                    lines.append(f"  • {h}")
            if f.get("body_texts"):
                lines.append("\nBody Texts:")
                for i, t in enumerate(f["body_texts"], 1):
                    lines.append(f"\n  [Body {i}]\n  {t}")
            lines.append("")

        if "video_ads" in raw:
            v = raw["video_ads"]
            lines.append("VIDEO ADS")
            lines.append("-" * 40)
            if v.get("hooks"):
                lines.append("Hooks:")
                for h in v["hooks"]:
                    lines.append(f"  • {h}")
            if v.get("captions"):
                lines.append("\nCaptions:")
                for c in v["captions"]:
                    lines.append(f"  • {c}")
            lines.append("")

        return "\n".join(lines)

    @staticmethod
    def to_csv(ad_set: GeneratedAdSet) -> str:
        raw = ad_set.raw_json
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Format", "Type", "Content"])

        if "banner_ads" in raw:
            b = raw["banner_ads"]
            for h in b.get("headlines", []):
                writer.writerow(["Banner", "Headline", h])
            for d in b.get("descriptions", []):
                writer.writerow(["Banner", "Description", d])
            for c in b.get("cta_suggestions", []):
                writer.writerow(["Banner", "CTA", c])

        if "native_card_ads" in raw:
            n = raw["native_card_ads"]
            for h in n.get("headlines", []):
                writer.writerow(["Native Card", "Headline", h])
            for t in n.get("body_texts", []):
                writer.writerow(["Native Card", "Body Text", t])
            for c in n.get("cta_suggestions", []):
                writer.writerow(["Native Card", "CTA", c])

        if "promoted_listing_ads" in raw:
            p = raw["promoted_listing_ads"]
            for t in p.get("titles", []):
                writer.writerow(["Promoted Listing", "Title", t])
            for d in p.get("descriptions", []):
                writer.writerow(["Promoted Listing", "Description", d])

        if "feed_card_ads" in raw:
            f = raw["feed_card_ads"]
            for h in f.get("headlines", []):
                writer.writerow(["Feed Card", "Headline", h])
            for t in f.get("body_texts", []):
                writer.writerow(["Feed Card", "Body Text", t])

        if "video_ads" in raw:
            v = raw["video_ads"]
            for h in v.get("hooks", []):
                writer.writerow(["Video", "Hook", h])
            for c in v.get("captions", []):
                writer.writerow(["Video", "Caption", c])

        return output.getvalue()

    @classmethod
    def export(cls, ad_set: GeneratedAdSet, format: str) -> str:
        format = format.lower()
        if format == "json":
            return cls.to_json(ad_set)
        elif format == "md":
            return cls.to_markdown(ad_set)
        elif format == "txt":
            return cls.to_txt(ad_set)
        elif format == "csv":
            return cls.to_csv(ad_set)
        else:
            raise ValueError(f"Unsupported format: {format}")
