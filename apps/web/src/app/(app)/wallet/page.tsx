'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DollarSign, TrendingDown, TrendingUp, Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

interface Wallet {
  id: string
  balance: number
  total_deposited: number
  total_spent: number
}

interface Transaction {
  id: string
  tx_type: string
  amount: number
  description: string | null
  created_at: string
}

interface WalletData {
  wallet: Wallet
  transactions: Transaction[]
}

const TX_TYPE_LABELS: Record<string, string> = {
  deposit: 'Deposit',
  spend_impression: 'CPM Spend',
  spend_click: 'CPC Spend',
  refund: 'Refund',
}

const TX_TYPE_COLORS: Record<string, string> = {
  deposit: 'text-emerald-600',
  spend_impression: 'text-red-500',
  spend_click: 'text-red-500',
  refund: 'text-blue-500',
}

export default function WalletPage() {
  const qc = useQueryClient()
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')

  const { data, isLoading } = useQuery<WalletData>({
    queryKey: ['advertiser-wallet'],
    queryFn: () => apiClient.get<WalletData>('/api/v1/advertiser/wallet'),
  })

  const deposit = useMutation({
    mutationFn: (amount: number) =>
      apiClient.post('/api/v1/advertiser/wallet/deposit', { amount }),
    onSuccess: () => {
      toast.success('Funds added successfully')
      qc.invalidateQueries({ queryKey: ['advertiser-wallet'] })
      setIsDepositOpen(false)
      setDepositAmount('')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  function handleDeposit() {
    const amount = parseFloat(depositAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Enter a valid amount')
      return
    }
    deposit.mutate(amount)
  }

  const wallet = data?.wallet
  const transactions = data?.transactions ?? []

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Advertiser Wallet</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your ad spend balance and view transaction history.</p>
        </div>
        <Button onClick={() => setIsDepositOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Funds
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Available Balance</p>
              {isLoading ? (
                <Skeleton className="mt-1 h-7 w-20" />
              ) : (
                <p className="text-2xl font-bold text-slate-900">
                  ${wallet?.balance?.toFixed(2) ?? '0.00'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Deposited</p>
              {isLoading ? (
                <Skeleton className="mt-1 h-7 w-20" />
              ) : (
                <p className="text-2xl font-bold text-slate-900">
                  ${wallet?.total_deposited?.toFixed(2) ?? '0.00'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Spent</p>
              {isLoading ? (
                <Skeleton className="mt-1 h-7 w-20" />
              ) : (
                <p className="text-2xl font-bold text-slate-900">
                  ${wallet?.total_spent?.toFixed(2) ?? '0.00'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">No transactions yet.</div>
          ) : (
            <div className="divide-y">
              {transactions.map((tx) => {
                const isCredit = tx.amount > 0
                return (
                  <div key={tx.id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          isCredit ? 'bg-emerald-50' : 'bg-red-50'
                        }`}
                      >
                        {isCredit ? (
                          <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {TX_TYPE_LABELS[tx.tx_type] ?? tx.tx_type}
                        </p>
                        {tx.description && (
                          <p className="text-xs text-slate-400">{tx.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p
                        className={`text-sm font-semibold ${
                          TX_TYPE_COLORS[tx.tx_type] ?? 'text-slate-700'
                        }`}
                      >
                        {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(4)}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deposit Dialog */}
      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Funds to Wallet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="100.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {[50, 100, 500].map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  size="sm"
                  onClick={() => setDepositAmount(String(amt))}
                >
                  ${amt}
                </Button>
              ))}
            </div>
            <Button
              className="w-full"
              onClick={handleDeposit}
              disabled={deposit.isPending}
            >
              {deposit.isPending ? 'Adding funds…' : 'Add Funds'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
