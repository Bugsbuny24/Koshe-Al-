'use client'

import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Bot, AlertTriangle, TrendingUp, Lightbulb, Send, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api-client'

interface CampaignItem {
  id: string
  title: string
  status: string
}

interface AIReport {
  summary: string
  recommendations: string[]
  risk_level: 'low' | 'medium' | 'high'
  risk_factors: string[]
  prediction: string
  metrics_snapshot: Record<string, unknown>
}

interface ChatResponse {
  reply: string
}

const RISK_STYLES: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  high: 'bg-red-100 text-red-700 border-red-200',
}

const RISK_BADGE: Record<string, string> = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
}

export default function AIReportsPage() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('')
  const [periodDays, setPeriodDays] = useState<string>('7')
  const [chatMessage, setChatMessage] = useState('')
  const [chatReply, setChatReply] = useState<string | null>(null)

  // Fetch campaigns list
  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['adnet-campaigns'],
    queryFn: () => apiClient.get<CampaignItem[]>('/api/v1/advertiser/campaigns'),
  })

  // Generate AI Report mutation
  const reportMutation = useMutation({
    mutationFn: (data: { campaign_id: string; period_days: number }) =>
      apiClient.post<AIReport>('/api/v1/ai/reports/campaign', data),
  })

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: (message: string) =>
      apiClient.post<ChatResponse>('/api/v1/ai/reports/chat', {
        message,
        context: selectedCampaignId ? `campaign:${selectedCampaignId}` : 'network',
      }),
    onSuccess: (data) => setChatReply(data.reply),
  })

  const handleGenerateReport = () => {
    if (!selectedCampaignId) return
    reportMutation.mutate({
      campaign_id: selectedCampaignId,
      period_days: parseInt(periodDays, 10),
    })
  }

  const handleSendChat = () => {
    if (!chatMessage.trim()) return
    chatMutation.mutate(chatMessage)
    setChatMessage('')
  }

  const report = reportMutation.data
  const riskLevel = report?.risk_level ?? 'low'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Reports</h1>
          <p className="text-sm text-slate-500">AI-powered campaign insights and recommendations.</p>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Campaign Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium text-slate-700">Campaign</label>
              {campaignsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a campaign…" />
                  </SelectTrigger>
                  <SelectContent>
                    {(campaigns ?? []).map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="w-full sm:w-40 space-y-1">
              <label className="text-sm font-medium text-slate-700">Period</label>
              <Select value={periodDays} onValueChange={setPeriodDays}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerateReport}
              disabled={!selectedCampaignId || reportMutation.isPending}
              className="w-full sm:w-auto"
            >
              {reportMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                'Generate AI Report'
              )}
            </Button>
          </div>

          {reportMutation.isError && (
            <p className="text-sm text-red-600">Failed to generate report. Please try again.</p>
          )}
        </CardContent>
      </Card>

      {/* Report Results */}
      {reportMutation.isPending && (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {report && !reportMutation.isPending && (
        <div className="space-y-4">
          {/* Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Performance Summary</CardTitle>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${RISK_STYLES[riskLevel]}`}
              >
                {riskLevel} risk
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 leading-relaxed">{report.summary}</p>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {report.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Risk Factors */}
          {report.risk_factors.length > 0 && (
            <Card className={`border ${RISK_STYLES[riskLevel]}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {report.risk_factors.map((factor, i) => (
                    <li key={i} className="text-sm">• {factor}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Prediction */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                7-Day Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 leading-relaxed">{report.prediction}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ask AI Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-indigo-600" />
            Ask AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder={
              selectedCampaignId
                ? 'Ask anything about this campaign…'
                : 'Ask anything about your campaigns…'
            }
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                handleSendChat()
              }
            }}
          />

          <div className="flex justify-end">
            <Button
              onClick={handleSendChat}
              disabled={!chatMessage.trim() || chatMutation.isPending}
              size="sm"
            >
              {chatMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send
            </Button>
          </div>

          {chatReply && (
            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
              <p className="text-sm font-medium text-indigo-800 mb-1">AI Response</p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{chatReply}</p>
            </div>
          )}

          {chatMutation.isError && (
            <p className="text-sm text-red-600">Failed to get AI response. Please try again.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
