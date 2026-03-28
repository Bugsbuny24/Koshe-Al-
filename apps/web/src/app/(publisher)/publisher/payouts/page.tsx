'use client'

import { DollarSign, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function PublisherPayoutsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Publisher Payouts</h1>
        <p className="mt-1 text-sm text-slate-500">Track your earnings and payout history.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Earned</p>
              <p className="text-2xl font-bold text-slate-900">$0.00</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-2xl font-bold text-slate-900">$0.00</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Paid Out</p>
              <p className="text-2xl font-bold text-slate-900">$0.00</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <DollarSign className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="text-slate-500 font-medium">No payouts yet</p>
          <p className="mt-1 text-sm text-slate-400">
            Payouts are processed monthly once your balance reaches the minimum threshold ($25).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
