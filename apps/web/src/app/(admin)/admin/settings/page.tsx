'use client'

import { Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Network configuration and platform information.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Network Info</CardTitle></CardHeader>
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
            <span className="text-slate-500">Ad Formats</span>
            <span className="font-medium text-emerald-600">Banner, Native Card, Promoted Listing, Feed Card, Video</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
