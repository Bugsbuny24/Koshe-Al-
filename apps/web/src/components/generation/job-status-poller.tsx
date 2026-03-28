'use client'

import { useEffect } from 'react'
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useGenerationJob } from '@/hooks/use-generation'
import type { JobStatus } from '@/types/api'

interface JobStatusPollerProps {
  jobId: string
  onCompleted?: (adSetId?: string) => void
}

const statusConfig: Record<
  JobStatus,
  { icon: React.ReactNode; title: string; description: string; variant: 'default' | 'destructive' | 'warning' | 'success' | 'info' }
> = {
  PENDING: {
    icon: <Clock className="h-4 w-4" />,
    title: 'Generation queued',
    description: 'Your ad set is waiting to be generated...',
    variant: 'info',
  },
  PROCESSING: {
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    title: 'Generating ads...',
    description: 'AI is crafting your ad copy. This usually takes 15-30 seconds.',
    variant: 'info',
  },
  COMPLETED: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    title: 'Generation complete!',
    description: 'Your ad copy has been generated successfully.',
    variant: 'success',
  },
  FAILED: {
    icon: <XCircle className="h-4 w-4" />,
    title: 'Generation failed',
    description: 'Something went wrong while generating your ads. Please try again.',
    variant: 'destructive',
  },
}

export function JobStatusPoller({ jobId, onCompleted }: JobStatusPollerProps) {
  const { data: job } = useGenerationJob(jobId)

  useEffect(() => {
    if (job?.status === 'COMPLETED' && onCompleted) {
      onCompleted()
    }
  }, [job?.status, onCompleted])

  if (!job) return null

  const config = statusConfig[job.status]

  return (
    <Alert variant={config.variant}>
      {config.icon}
      <AlertTitle>{config.title}</AlertTitle>
      <AlertDescription>
        {job.status === 'FAILED' && job.error_message
          ? job.error_message
          : config.description}
      </AlertDescription>
    </Alert>
  )
}
