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

        if "google_ads" in raw:
            g = raw["google_ads"]
            lines.append("## Google Ads\n")
            if g.get("headlines"):
                lines.append("### Headlines\n")
                for h in g["headlines"]:
                    lines.append(f"- {h}")
                lines.append("")
            if g.get("descriptions"):
                lines.append("### Descriptions\n")
                for d in g["descriptions"]:
                    lines.append(f"- {d}")
                lines.append("")
            if g.get("keyword_themes"):
                lines.append("### Keyword Themes\n")
                for k in g["keyword_themes"]:
                    lines.append(f"- {k}")
                lines.append("")
            if g.get("callout_ideas"):
                lines.append("### Callout Ideas\n")
                for c in g["callout_ideas"]:
                    lines.append(f"- {c}")
                lines.append("")
            if g.get("sitelink_ideas"):
                lines.append("### Sitelink Ideas\n")
                for s in g["sitelink_ideas"]:
                    lines.append(f"**{s.get('title', '')}**: {s.get('description', '')}")
                lines.append("")

        if "meta_ads" in raw:
            m = raw["meta_ads"]
            lines.append("## Meta Ads\n")
            if m.get("primary_texts"):
                lines.append("### Primary Texts\n")
                for t in m["primary_texts"]:
                    lines.append(f"---\n{t}\n")
            if m.get("headlines"):
                lines.append("### Headlines\n")
                for h in m["headlines"]:
                    lines.append(f"- {h}")
                lines.append("")
            if m.get("cta_suggestions"):
                lines.append("### CTA Suggestions\n")
                for c in m["cta_suggestions"]:
                    lines.append(f"- {c}")
                lines.append("")
            if m.get("angle_summary"):
                lines.append(f"### Angle Summary\n\n{m['angle_summary']}\n")
            if m.get("image_creative_brief"):
                lines.append(f"### Image Creative Brief\n\n{m['image_creative_brief']}\n")

        if "tiktok_ads" in raw:
            t = raw["tiktok_ads"]
            lines.append("## TikTok Ads\n")
            if t.get("hooks"):
                lines.append("### Hooks\n")
                for h in t["hooks"]:
                    lines.append(f"- {h}")
                lines.append("")
            if t.get("short_scripts"):
                lines.append("### Short Scripts\n")
                for i, s in enumerate(t["short_scripts"], 1):
                    lines.append(f"**Script {i}:**\n{s}\n")
            if t.get("captions"):
                lines.append("### Captions\n")
                for c in t["captions"]:
                    lines.append(f"- {c}")
                lines.append("")
            if t.get("ugc_brief"):
                lines.append(f"### UGC Brief\n\n{t['ugc_brief']}\n")
            if t.get("video_prompt"):
                lines.append(f"### Video Prompt\n\n{t['video_prompt']}\n")

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

        if "google_ads" in raw:
            g = raw["google_ads"]
            lines.append("GOOGLE ADS")
            lines.append("-" * 40)
            if g.get("headlines"):
                lines.append("Headlines:")
                for h in g["headlines"]:
                    lines.append(f"  • {h}")
            if g.get("descriptions"):
                lines.append("\nDescriptions:")
                for d in g["descriptions"]:
                    lines.append(f"  • {d}")
            if g.get("keyword_themes"):
                lines.append("\nKeyword Themes:")
                for k in g["keyword_themes"]:
                    lines.append(f"  • {k}")
            lines.append("")

        if "meta_ads" in raw:
            m = raw["meta_ads"]
            lines.append("META ADS")
            lines.append("-" * 40)
            if m.get("primary_texts"):
                lines.append("Primary Texts:")
                for i, t in enumerate(m["primary_texts"], 1):
                    lines.append(f"\n  [Text {i}]\n  {t}")
            if m.get("headlines"):
                lines.append("\nHeadlines:")
                for h in m["headlines"]:
                    lines.append(f"  • {h}")
            lines.append("")

        if "tiktok_ads" in raw:
            t = raw["tiktok_ads"]
            lines.append("TIKTOK ADS")
            lines.append("-" * 40)
            if t.get("hooks"):
                lines.append("Hooks:")
                for h in t["hooks"]:
                    lines.append(f"  • {h}")
            if t.get("captions"):
                lines.append("\nCaptions:")
                for c in t["captions"]:
                    lines.append(f"  • {c}")
            lines.append("")

        return "\n".join(lines)

    @staticmethod
    def to_csv(ad_set: GeneratedAdSet) -> str:
        raw = ad_set.raw_json
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Platform", "Type", "Content"])

        if "google_ads" in raw:
            g = raw["google_ads"]
            for h in g.get("headlines", []):
                writer.writerow(["Google", "Headline", h])
            for d in g.get("descriptions", []):
                writer.writerow(["Google", "Description", d])
            for k in g.get("keyword_themes", []):
                writer.writerow(["Google", "Keyword Theme", k])
            for c in g.get("callout_ideas", []):
                writer.writerow(["Google", "Callout", c])

        if "meta_ads" in raw:
            m = raw["meta_ads"]
            for t in m.get("primary_texts", []):
                writer.writerow(["Meta", "Primary Text", t])
            for h in m.get("headlines", []):
                writer.writerow(["Meta", "Headline", h])
            for c in m.get("cta_suggestions", []):
                writer.writerow(["Meta", "CTA", c])

        if "tiktok_ads" in raw:
            t = raw["tiktok_ads"]
            for h in t.get("hooks", []):
                writer.writerow(["TikTok", "Hook", h])
            for c in t.get("captions", []):
                writer.writerow(["TikTok", "Caption", c])

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
