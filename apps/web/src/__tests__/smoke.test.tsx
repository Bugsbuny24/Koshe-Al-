import { describe, it, expect } from 'vitest'
import { apiClient } from '../lib/api-client'

describe('smoke tests', () => {
  it('api-client exists and has correct methods', () => {
    expect(apiClient).toBeDefined()
    expect(typeof apiClient.get).toBe('function')
    expect(typeof apiClient.post).toBe('function')
    expect(typeof apiClient.put).toBe('function')
    expect(typeof apiClient.patch).toBe('function')
    expect(typeof apiClient.delete).toBe('function')
  })

  it('utils module exports cn function', async () => {
    const { cn } = await import('../lib/utils')
    expect(typeof cn).toBe('function')
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('utils formatDate returns a string', async () => {
    const { formatDate } = await import('../lib/utils')
    const result = formatDate('2024-01-15T00:00:00Z')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('getAdFormatLabel returns correct labels', async () => {
    const { getAdFormatLabel } = await import('../lib/utils')
    expect(getAdFormatLabel('BANNER')).toBe('Banner')
    expect(getAdFormatLabel('NATIVE_CARD')).toBe('Native Card')
    expect(getAdFormatLabel('VIDEO')).toBe('Video')
  })

  it('getObjectiveLabel returns correct labels', async () => {
    const { getObjectiveLabel } = await import('../lib/utils')
    expect(getObjectiveLabel('TRAFFIC')).toBe('Traffic')
    expect(getObjectiveLabel('LEADS')).toBe('Leads')
    expect(getObjectiveLabel('SALES')).toBe('Sales')
  })
})
