import { ApiError } from '@/types/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

class ApiClientError extends Error {
  status: number
  detail: string

  constructor(detail: string, status: number) {
    super(detail)
    this.name = 'ApiClientError'
    this.status = status
    this.detail = detail
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new ApiClientError('Unauthorized', 401)
  }

  if (!response.ok) {
    let detail = `HTTP error ${response.status}`
    try {
      const errorData: ApiError = await response.json()
      detail = errorData.detail ?? detail
    } catch {
      // ignore parse error
    }
    throw new ApiClientError(detail, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  try {
    return await response.json() as T
  } catch {
    throw new ApiClientError('Failed to parse response', response.status)
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`

  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  }

  try {
    const response = await fetch(url, { ...defaultOptions, ...options })
    return handleResponse<T>(response)
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    // Network error (backend not running, etc.)
    throw new ApiClientError(
      'Unable to connect to the server. Please check your connection.',
      0
    )
  }
}

export const apiClient = {
  get<T>(path: string): Promise<T> {
    return request<T>(path, { method: 'GET' })
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  },

  patch<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  },

  delete<T>(path: string): Promise<T> {
    return request<T>(path, { method: 'DELETE' })
  },
}

export { ApiClientError }

// Auth endpoints
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/api/v1/auth/login', { email, password }),

  signup: (full_name: string, email: string, password: string) =>
    apiClient.post('/api/v1/auth/register', { full_name, email, password }),

  logout: () => apiClient.post('/api/v1/auth/logout'),

  me: <T>() => apiClient.get<T>('/api/v1/auth/me'),
}

// Brands endpoints
export const brandsApi = {
  list: <T>() => apiClient.get<T>('/api/v1/brands'),
  get: <T>(id: string) => apiClient.get<T>(`/api/v1/brands/${id}`),
  create: <T>(data: unknown) => apiClient.post<T>('/api/v1/brands', data),
  update: <T>(id: string, data: unknown) => apiClient.put<T>(`/api/v1/brands/${id}`, data),
  delete: <T>(id: string) => apiClient.delete<T>(`/api/v1/brands/${id}`),
}

// Products endpoints
export const productsApi = {
  list: <T>() => apiClient.get<T>('/api/v1/products'),
  listByBrand: <T>(brandId: string) => apiClient.get<T>(`/api/v1/brands/${brandId}/products`),
  get: <T>(id: string) => apiClient.get<T>(`/api/v1/products/${id}`),
  create: <T>(data: unknown) => apiClient.post<T>('/api/v1/products', data),
  update: <T>(id: string, data: unknown) => apiClient.put<T>(`/api/v1/products/${id}`, data),
  delete: <T>(id: string) => apiClient.delete<T>(`/api/v1/products/${id}`),
}

// Audiences endpoints
export const audiencesApi = {
  list: <T>() => apiClient.get<T>('/api/v1/audiences'),
  get: <T>(id: string) => apiClient.get<T>(`/api/v1/audiences/${id}`),
  create: <T>(data: unknown) => apiClient.post<T>('/api/v1/audiences', data),
  update: <T>(id: string, data: unknown) => apiClient.put<T>(`/api/v1/audiences/${id}`, data),
  delete: <T>(id: string) => apiClient.delete<T>(`/api/v1/audiences/${id}`),
}

// Campaigns endpoints
export const campaignsApi = {
  list: <T>() => apiClient.get<T>('/api/v1/campaigns'),
  get: <T>(id: string) => apiClient.get<T>(`/api/v1/campaigns/${id}`),
  create: <T>(data: unknown) => apiClient.post<T>('/api/v1/campaigns', data),
  update: <T>(id: string, data: unknown) => apiClient.put<T>(`/api/v1/campaigns/${id}`, data),
  delete: <T>(id: string) => apiClient.delete<T>(`/api/v1/campaigns/${id}`),
}

// Generation endpoints
export const generationApi = {
  createJob: <T>(campaignBriefId: string) =>
    apiClient.post<T>('/api/v1/generation/jobs', { campaign_brief_id: campaignBriefId }),
  getJob: <T>(jobId: string) => apiClient.get<T>(`/api/v1/generation/jobs/${jobId}`),
  getAdSet: <T>(adSetId: string) => apiClient.get<T>(`/api/v1/generation/ad-sets/${adSetId}`),
  listAdSets: <T>(campaignBriefId?: string) => {
    const path = campaignBriefId
      ? `/api/v1/generation/ad-sets?campaign_brief_id=${campaignBriefId}`
      : '/api/v1/generation/ad-sets'
    return apiClient.get<T>(path)
  },
  updateVariant: <T>(variantId: string, data: unknown) =>
    apiClient.patch<T>(`/api/v1/generation/variants/${variantId}`, data),
  toggleFavorite: <T>(variantId: string, is_favorite: boolean) =>
    apiClient.patch<T>(`/api/v1/generation/variants/${variantId}`, { is_favorite }),
}
