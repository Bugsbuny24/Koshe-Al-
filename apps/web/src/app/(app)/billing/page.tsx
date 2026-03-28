'use client'

import { CreditCard, DollarSign, FileText, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Billing & Invoices</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your campaign budgets and payment history.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Invested</p>
              <p className="text-2xl font-bold text-slate-900">$0.00</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Budget</p>
              <p className="text-2xl font-bold text-slate-900">$0.00</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Paid Invoices</p>
              <p className="text-2xl font-bold text-slate-900">0</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <FileText className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-500">No invoices yet</p>
          <p className="mt-1 text-sm text-slate-400">
            Invoices are generated when you purchase a campaign package. Contact your account manager to get started.
          </p>
          <Button className="mt-4" variant="outline">Contact Sales</Button>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-amber-800">V1 Billing Note</p>
          <p className="mt-1 text-xs text-amber-700">
            In V1, campaign packages are purchased manually through your account manager. Self-serve billing with Stripe integration is planned for V2.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
