import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, LayoutGrid, BarChart3, Globe } from 'lucide-react'

const networkFeatures = [
  {
    icon: LayoutGrid,
    name: 'Multiple Ad Formats',
    description: 'Serve banner, native card, promoted listing, feed card, and video ads across the publisher network.',
    color: 'bg-indigo-100',
    textColor: 'text-indigo-700',
    status: 'Active',
  },
  {
    icon: Globe,
    name: 'Publisher Network',
    description: 'Your campaigns are automatically matched and served across approved publisher sites and apps.',
    color: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    status: 'Active',
  },
  {
    icon: BarChart3,
    name: 'Unified Reporting',
    description: 'Track impressions, clicks, CTR, and spend in one place — no external dashboards needed.',
    color: 'bg-blue-100',
    textColor: 'text-blue-700',
    status: 'Active',
  },
  {
    icon: Zap,
    name: 'AI Ad Generation',
    description: 'Generate high-converting creatives for every ad format from a single campaign brief.',
    color: 'bg-amber-100',
    textColor: 'text-amber-700',
    status: 'Active',
  },
]

export default function NetworkPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ad Network</h1>
        <p className="mt-1 text-sm text-slate-500">
          AdGenius Network — your campaigns are served across our proprietary publisher ecosystem.
        </p>
      </div>

      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
        <p className="text-sm font-medium text-indigo-800">Proprietary Ad Network</p>
        <p className="mt-1 text-sm text-indigo-700">
          AdGenius delivers your ads directly through its own publisher network. There are no
          external platform dependencies — everything runs within the AdGenius ecosystem.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {networkFeatures.map((feature) => (
          <Card key={feature.name}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.textColor}`} />
                </div>
                <div>
                  <CardTitle className="text-base">{feature.name}</CardTitle>
                  <Badge variant="outline" className="mt-0.5 text-xs text-emerald-700 border-emerald-200 bg-emerald-50">
                    {feature.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
