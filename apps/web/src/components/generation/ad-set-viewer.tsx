'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdVariantCard } from './ad-variant-card'
import { Separator } from '@/components/ui/separator'
import type { GeneratedAdSet, Platform, GoogleAdsContent, MetaAdsContent, TikTokAdsContent } from '@/types/api'

interface AdSetViewerProps {
  adSet: GeneratedAdSet
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-3 mt-5 first:mt-0">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</h4>
      <Separator className="mt-1.5" />
    </div>
  )
}

function TextList({ items, label }: { items: string[]; label?: string }) {
  if (!items || items.length === 0) return null
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((item, i) => (
        <AdVariantCard
          key={i}
          text={item}
          label={label ? `${label} ${i + 1}` : undefined}
        />
      ))}
    </div>
  )
}

function GoogleAdsTab({ content }: { content: GoogleAdsContent }) {
  return (
    <div>
      <SectionHeader title="Headlines" />
      <TextList items={content.headlines} label="Headline" />

      <SectionHeader title="Descriptions" />
      <TextList items={content.descriptions} label="Description" />

      {content.keyword_themes?.length > 0 && (
        <>
          <SectionHeader title="Keyword Themes" />
          <div className="flex flex-wrap gap-2">
            {content.keyword_themes.map((kw, i) => (
              <span
                key={i}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200"
              >
                {kw}
              </span>
            ))}
          </div>
        </>
      )}

      {content.sitelink_ideas?.length > 0 && (
        <>
          <SectionHeader title="Sitelink Ideas" />
          <div className="grid gap-2 sm:grid-cols-2">
            {content.sitelink_ideas.map((sl, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-sm font-medium text-slate-900">{sl.title}</p>
                <p className="text-xs text-slate-500">{sl.description}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {content.callout_ideas?.length > 0 && (
        <>
          <SectionHeader title="Callout Ideas" />
          <TextList items={content.callout_ideas} label="Callout" />
        </>
      )}
    </div>
  )
}

function MetaAdsTab({ content }: { content: MetaAdsContent }) {
  return (
    <div>
      <SectionHeader title="Primary Texts" />
      <TextList items={content.primary_texts} label="Primary Text" />

      <SectionHeader title="Headlines" />
      <TextList items={content.headlines} label="Headline" />

      <SectionHeader title="CTA Suggestions" />
      <div className="flex flex-wrap gap-2">
        {content.cta_suggestions?.map((cta, i) => (
          <span
            key={i}
            className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 border border-indigo-200"
          >
            {cta}
          </span>
        ))}
      </div>

      {content.angle_summary && (
        <>
          <SectionHeader title="Angle Summary" />
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-700">{content.angle_summary}</p>
          </div>
        </>
      )}

      {content.image_creative_brief && (
        <>
          <SectionHeader title="Image Creative Brief" />
          <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
            <p className="text-sm text-indigo-700">{content.image_creative_brief}</p>
          </div>
        </>
      )}
    </div>
  )
}

function TikTokAdsTab({ content }: { content: TikTokAdsContent }) {
  return (
    <div>
      <SectionHeader title="Hooks" />
      <TextList items={content.hooks} label="Hook" />

      <SectionHeader title="Short Scripts" />
      {content.short_scripts?.map((script, i) => (
        <div key={i} className="mb-2 rounded-lg border border-slate-200 bg-white p-4">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
            Script {i + 1}
          </span>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{script}</p>
        </div>
      ))}

      <SectionHeader title="Captions" />
      <TextList items={content.captions} label="Caption" />

      <SectionHeader title="CTA Suggestions" />
      <div className="flex flex-wrap gap-2">
        {content.cta_suggestions?.map((cta, i) => (
          <span
            key={i}
            className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-700 border border-pink-200"
          >
            {cta}
          </span>
        ))}
      </div>

      {content.ugc_brief && (
        <>
          <SectionHeader title="UGC Brief" />
          <div className="rounded-lg border border-pink-100 bg-pink-50 p-4">
            <p className="text-sm text-pink-700">{content.ugc_brief}</p>
          </div>
        </>
      )}

      {content.video_prompt && (
        <>
          <SectionHeader title="Video Prompt" />
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-700">{content.video_prompt}</p>
          </div>
        </>
      )}
    </div>
  )
}

export function AdSetViewer({ adSet }: AdSetViewerProps) {
  const raw = adSet.raw_json as Record<string, unknown>
  const platforms = Object.keys(raw) as Platform[]

  if (platforms.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        No content generated yet.
      </div>
    )
  }

  const platformLabels: Record<string, string> = {
    google: 'Google Ads',
    GOOGLE: 'Google Ads',
    meta: 'Meta Ads',
    META: 'Meta Ads',
    tiktok: 'TikTok Ads',
    TIKTOK: 'TikTok Ads',
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <Tabs defaultValue={platforms[0]} className="p-6">
        <TabsList className="mb-6">
          {platforms.map((platform) => (
            <TabsTrigger key={platform} value={platform}>
              {platformLabels[platform] ?? platform}
            </TabsTrigger>
          ))}
        </TabsList>

        {platforms.map((platform) => {
          const content = raw[platform]
          const normalized = (typeof platform === 'string' ? platform.toUpperCase() : platform) as Platform

          return (
            <TabsContent key={platform} value={platform}>
              {normalized === 'GOOGLE' && content !== undefined && (
                <GoogleAdsTab content={content as GoogleAdsContent} />
              )}
              {normalized === 'META' && content !== undefined && (
                <MetaAdsTab content={content as MetaAdsContent} />
              )}
              {normalized === 'TIKTOK' && content !== undefined && (
                <TikTokAdsTab content={content as TikTokAdsContent} />
              )}
              {!['GOOGLE', 'META', 'TIKTOK'].includes(normalized) && (
                <pre className="overflow-auto rounded-lg bg-slate-50 p-4 text-xs text-slate-600">
                  {JSON.stringify(content, null, 2)}
                </pre>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
