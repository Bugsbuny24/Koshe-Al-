'use client'

import { Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const featureFlags = [
  { name: 'ENABLE_TIKTOK_CONNECT', label: 'TikTok Integration', value: false, eta: 'V2' },
  { name: 'ENABLE_META_CONNECT', label: 'Meta Ads Integration', value: false, eta: 'V2' },
  { name: 'ENABLE_GOOGLE_CONNECT', label: 'Google Ads Integration', value: false, eta: 'V2' },
  { name: 'ENABLE_EXTERNAL_PUBLISHING', label: 'External Ad Publishing', value: false, eta: 'V2' },
]

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Feature flags and platform configuration.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-slate-100">
          {featureFlags.map((flag) => (
            <div key={flag.name} className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-slate-900">{flag.label}</p>
                <p className="text-xs font-mono text-slate-400">{flag.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">{flag.eta}</Badge>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${flag.value ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {flag.value ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Platform Info</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Version</span>
            <span className="font-medium text-slate-900">V1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Ad Serving</span>
            <span className="font-medium text-emerald-600">Active</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">AI Generation</span>
            <span className="font-medium text-emerald-600">Active (Gemini)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Publisher Network</span>
            <span className="font-medium text-emerald-600">Proprietary V1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">External Platforms</span>
            <span className="font-medium text-slate-400">Not connected (V1)</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
