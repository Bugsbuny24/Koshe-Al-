'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdVariantCard } from './ad-variant-card'
import { Separator } from '@/components/ui/separator'
import type { GeneratedAdSet, BannerAdContent, NativeCardAdContent, PromotedListingAdContent, FeedCardAdContent, VideoAdContent } from '@/types/api'

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

function BannerAdsTab({ content }: { content: BannerAdContent }) {
  return (
    <div>
      <SectionHeader title="Headlines" />
      <TextList items={content.headlines} label="Headline" />

      <SectionHeader title="Descriptions" />
      <TextList items={content.descriptions} label="Description" />

      {content.cta_suggestions?.length > 0 && (
        <>
          <SectionHeader title="CTA Suggestions" />
          <div className="flex flex-wrap gap-2">
            {content.cta_suggestions.map((cta, i) => (
              <span
                key={i}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200"
              >
                {cta}
              </span>
            ))}
          </div>
        </>
      )}

      {content.image_brief && (
        <>
          <SectionHeader title="Image Brief" />
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-700">{content.image_brief}</p>
          </div>
        </>
      )}
    </div>
  )
}

function NativeCardAdsTab({ content }: { content: NativeCardAdContent }) {
  return (
    <div>
      <SectionHeader title="Headlines" />
      <TextList items={content.headlines} label="Headline" />

      <SectionHeader title="Body Texts" />
      {content.body_texts?.map((text, i) => (
        <div key={i} className="mb-2 rounded-lg border border-slate-200 bg-white p-4">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
            Body {i + 1}
          </span>
          <p className="text-sm text-slate-700">{text}</p>
        </div>
      ))}

      {content.cta_suggestions?.length > 0 && (
        <>
          <SectionHeader title="CTA Suggestions" />
          <div className="flex flex-wrap gap-2">
            {content.cta_suggestions.map((cta, i) => (
              <span
                key={i}
                className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 border border-indigo-200"
              >
                {cta}
              </span>
            ))}
          </div>
        </>
      )}

      {content.angle_summary && (
        <>
          <SectionHeader title="Angle Summary" />
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-700">{content.angle_summary}</p>
          </div>
        </>
      )}

      {content.image_brief && (
        <>
          <SectionHeader title="Image Brief" />
          <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
            <p className="text-sm text-indigo-700">{content.image_brief}</p>
          </div>
        </>
      )}
    </div>
  )
}

function PromotedListingAdsTab({ content }: { content: PromotedListingAdContent }) {
  return (
    <div>
      <SectionHeader title="Titles" />
      <TextList items={content.titles} label="Title" />

      <SectionHeader title="Descriptions" />
      <TextList items={content.descriptions} label="Description" />

      {content.price_callouts?.length > 0 && (
        <>
          <SectionHeader title="Price Callouts" />
          <div className="flex flex-wrap gap-2">
            {content.price_callouts.map((callout, i) => (
              <span
                key={i}
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200"
              >
                {callout}
              </span>
            ))}
          </div>
        </>
      )}

      {content.cta_suggestions?.length > 0 && (
        <>
          <SectionHeader title="CTA Suggestions" />
          <div className="flex flex-wrap gap-2">
            {content.cta_suggestions.map((cta, i) => (
              <span
                key={i}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 border border-slate-200"
              >
                {cta}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function FeedCardAdsTab({ content }: { content: FeedCardAdContent }) {
  return (
    <div>
      <SectionHeader title="Headlines" />
      <TextList items={content.headlines} label="Headline" />

      <SectionHeader title="Body Texts" />
      {content.body_texts?.map((text, i) => (
        <div key={i} className="mb-2 rounded-lg border border-slate-200 bg-white p-4">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
            Body {i + 1}
          </span>
          <p className="text-sm text-slate-700">{text}</p>
        </div>
      ))}

      {content.cta_suggestions?.length > 0 && (
        <>
          <SectionHeader title="CTA Suggestions" />
          <div className="flex flex-wrap gap-2">
            {content.cta_suggestions.map((cta, i) => (
              <span
                key={i}
                className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 border border-amber-200"
              >
                {cta}
              </span>
            ))}
          </div>
        </>
      )}

      {content.angle_summary && (
        <>
          <SectionHeader title="Angle Summary" />
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-700">{content.angle_summary}</p>
          </div>
        </>
      )}

      {content.image_brief && (
        <>
          <SectionHeader title="Image Brief" />
          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm text-amber-700">{content.image_brief}</p>
          </div>
        </>
      )}
    </div>
  )
}

function VideoAdsTab({ content }: { content: VideoAdContent }) {
  return (
    <div>
      <SectionHeader title="Hooks" />
      <TextList items={content.hooks} label="Hook" />

      <SectionHeader title="Scripts" />
      {content.scripts?.map((script, i) => (
        <div key={i} className="mb-2 rounded-lg border border-slate-200 bg-white p-4">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
            Script {i + 1}
          </span>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{script}</p>
        </div>
      ))}

      <SectionHeader title="Captions" />
      <TextList items={content.captions} label="Caption" />

      {content.cta_suggestions?.length > 0 && (
        <>
          <SectionHeader title="CTA Suggestions" />
          <div className="flex flex-wrap gap-2">
            {content.cta_suggestions.map((cta, i) => (
              <span
                key={i}
                className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 border border-rose-200"
              >
                {cta}
              </span>
            ))}
          </div>
        </>
      )}

      {content.video_brief && (
        <>
          <SectionHeader title="Video Brief" />
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-700">{content.video_brief}</p>
          </div>
        </>
      )}
    </div>
  )
}

const FORMAT_KEYS = ['banner_ads', 'native_card_ads', 'promoted_listing_ads', 'feed_card_ads', 'video_ads'] as const
type FormatKey = typeof FORMAT_KEYS[number]

const formatLabels: Record<FormatKey, string> = {
  banner_ads: 'Banner',
  native_card_ads: 'Native Card',
  promoted_listing_ads: 'Promoted Listing',
  feed_card_ads: 'Feed Card',
  video_ads: 'Video',
}

export function AdSetViewer({ adSet }: AdSetViewerProps) {
  const raw = adSet.raw_json as Record<string, unknown>
  const presentFormats = FORMAT_KEYS.filter((key) => raw[key] !== undefined)

  if (presentFormats.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        No content generated yet.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <Tabs defaultValue={presentFormats[0]} className="p-6">
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          {presentFormats.map((key) => (
            <TabsTrigger key={key} value={key}>
              {formatLabels[key]}
            </TabsTrigger>
          ))}
        </TabsList>

        {presentFormats.map((key) => {
          const content = raw[key]
          return (
            <TabsContent key={key} value={key}>
              {key === 'banner_ads' && <BannerAdsTab content={content as BannerAdContent} />}
              {key === 'native_card_ads' && <NativeCardAdsTab content={content as NativeCardAdContent} />}
              {key === 'promoted_listing_ads' && <PromotedListingAdsTab content={content as PromotedListingAdContent} />}
              {key === 'feed_card_ads' && <FeedCardAdsTab content={content as FeedCardAdContent} />}
              {key === 'video_ads' && <VideoAdsTab content={content as VideoAdContent} />}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
