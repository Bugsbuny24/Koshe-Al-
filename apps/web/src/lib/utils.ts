import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy')
  } catch {
    return dateString
  }
}

export function formatDateTime(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a')
  } catch {
    return dateString
  }
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function getAdFormatLabel(format: string): string {
  const labels: Record<string, string> = {
    BANNER: 'Banner',
    NATIVE_CARD: 'Native Card',
    PROMOTED_LISTING: 'Promoted Listing',
    FEED_CARD: 'Feed Card',
    VIDEO: 'Video',
  }
  return labels[format] ?? format
}

export function getObjectiveLabel(objective: string): string {
  const labels: Record<string, string> = {
    TRAFFIC: 'Traffic',
    LEADS: 'Leads',
    SALES: 'Sales',
    ENGAGEMENT: 'Engagement',
    AWARENESS: 'Awareness',
  }
  return labels[objective] ?? objective
}

export function getToneLabel(tone: string): string {
  const labels: Record<string, string> = {
    PROFESSIONAL: 'Professional',
    PREMIUM: 'Premium',
    CASUAL: 'Casual',
    AGGRESSIVE: 'Aggressive',
    EDUCATIONAL: 'Educational',
  }
  return labels[tone] ?? tone
}
