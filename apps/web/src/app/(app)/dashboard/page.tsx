'use client'

import Link from 'next/link'
import { Building2, FileText, Sparkles, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/use-auth'
import { useBrands } from '@/hooks/use-brands'
import { useCampaigns } from '@/hooks/use-campaigns'
import { useAdSets } from '@/hooks/use-generation'
import { formatDate, getPlatformLabel, getObjectiveLabel } from '@/lib/utils'

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  isLoading,
}: {
  title: string
  value: number | string
  icon: React.ElementType
  color: string
  isLoading?: boolean
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          {isLoading ? (
            <Skeleton className="mt-1 h-7 w-16" />
          ) : (
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: brands = [], isLoading: brandsLoading } = useBrands()
  const { data: campaigns = [], isLoading: campaignsLoading } = useCampaigns()
  const { data: adSets = [], isLoading: adSetsLoading } = useAdSets()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const name = user?.full_name?.split(' ')[0] ?? 'there'

  const recentCampaigns = campaigns.slice(-5).reverse()
  const recentAdSets = adSets.slice(-3).reverse()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {greeting}, {name} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your campaigns.
          </p>
        </div>
        <Button asChild>
          <Link href="/campaigns/new">
            <Plus className="h-4 w-4" />
            Create Campaign
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Brands"
          value={brands.length}
          icon={Building2}
          color="bg-blue-500"
          isLoading={brandsLoading}
        />
        <StatCard
          title="Total Campaigns"
          value={campaigns.length}
          icon={FileText}
          color="bg-indigo-500"
          isLoading={campaignsLoading}
        />
        <StatCard
          title="Generated Ad Sets"
          value={adSets.length}
          icon={Sparkles}
          color="bg-violet-500"
          isLoading={adSetsLoading}
        />
        <StatCard
          title="This Month"
          value={
            adSets.filter((a) => {
              const d = new Date(a.created_at)
              const now = new Date()
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            }).length
          }
          icon={TrendingUp}
          color="bg-emerald-500"
          isLoading={adSetsLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Campaigns */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Campaigns</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/campaigns">
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {campaignsLoading ? (
              <div className="space-y-3 p-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentCampaigns.length === 0 ? (
              <div className="px-6 pb-6 text-center text-sm text-slate-500">
                No campaigns yet.{' '}
                <Link href="/campaigns/new" className="text-indigo-600 hover:underline">
                  Create your first campaign
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentCampaigns.map((campaign) => (
                  <Link
                    key={campaign.id}
                    href={`/campaigns/${campaign.id}`}
                    className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {campaign.name}
                      </p>
                      <p className="text-xs text-slate-400">{formatDate(campaign.created_at)}</p>
                    </div>
                    <div className="ml-3 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {getObjectiveLabel(campaign.objective)}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Ad Sets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Ad Sets</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/generated">
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {adSetsLoading ? (
              <div className="space-y-3 p-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentAdSets.length === 0 ? (
              <div className="px-6 pb-6 text-center text-sm text-slate-500">
                No generated ad sets yet. Create and generate a campaign to get started.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentAdSets.map((adSet) => {
                  const platforms = Object.keys(adSet.raw_json ?? {})
                  return (
                    <Link
                      key={adSet.id}
                      href={`/generated/${adSet.id}`}
                      className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          Ad Set #{adSet.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-slate-400">{formatDate(adSet.created_at)}</p>
                      </div>
                      <div className="ml-3 flex flex-wrap gap-1">
                        {platforms.map((p) => (
                          <Badge key={p} variant="secondary" className="text-xs">
                            {getPlatformLabel(p.toUpperCase())}
                          </Badge>
                        ))}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
