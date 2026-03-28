import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const platforms = [
  {
    name: 'Google Ads',
    description: 'Connect your Google Ads account to publish campaigns directly.',
    color: 'bg-blue-100',
    textColor: 'text-blue-700',
    initial: 'G',
  },
  {
    name: 'Meta Ads',
    description:
      'Connect Facebook & Instagram Ads Manager to run your generated campaigns.',
    color: 'bg-indigo-100',
    textColor: 'text-indigo-700',
    initial: 'M',
  },
  {
    name: 'TikTok Ads',
    description:
      'Connect TikTok Ads Manager to publish short-form video campaigns.',
    color: 'bg-pink-100',
    textColor: 'text-pink-700',
    initial: 'T',
  },
]

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>
        <p className="mt-1 text-sm text-slate-500">
          Connect your ad platforms to publish campaigns directly from AdGenius.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-800">Platform integrations coming soon</p>
        <p className="mt-1 text-sm text-amber-700">
          Direct publishing to ad platforms is on our roadmap. You can currently export your
          generated copy and manually upload it to your ad platforms.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {platforms.map((platform) => (
          <Card key={platform.name} className="opacity-75">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${platform.color}`}
                >
                  <span className={`text-xl font-bold ${platform.textColor}`}>
                    {platform.initial}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-base">{platform.name}</CardTitle>
                  <Badge variant="outline" className="mt-0.5 text-xs">
                    Coming Soon
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{platform.description}</CardDescription>
              <Button variant="outline" disabled className="w-full">
                Connect {platform.name}
              </Button>
              <p className="mt-2 text-center text-xs text-slate-400">
                Publishing integration will be available in a future update.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
