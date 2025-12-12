import type {
	Entry,
	PaginatedResponse,
	EntriesQueryParams,
	Navigation,
	LinkPage,
	Homepage,
	ApiResponse
} from '@rushcms/types'
import type { CacheConfig } from './cache'
import { Cache } from './cache'
import {
	RushCMSError,
	RushCMSNotFoundError,
	RushCMSUnauthorizedError,
	RushCMSForbiddenError,
	RushCMSValidationError
} from './errors'

export interface RushCMSClientConfig {
	baseUrl: string
	apiToken: string
	siteSlug: string
	cache?: Partial<CacheConfig>
}

interface InternalRushCMSClientConfig {
	baseUrl: string
	apiToken: string
	siteSlug: string
	cache: CacheConfig
}

export class RushCMSClient {
	private config: InternalRushCMSClientConfig
	private cache: Cache

	constructor(config: RushCMSClientConfig) {
		const cacheConfig: CacheConfig = {
			enabled: config.cache?.enabled ?? true,
			ttl: config.cache?.ttl ?? 7200
		}

		this.config = {
			baseUrl: config.baseUrl,
			apiToken: config.apiToken,
			siteSlug: config.siteSlug,
			cache: cacheConfig
		}

		this.cache = new Cache(cacheConfig)
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const url = `${this.config.baseUrl}/api/v1/${this.config.siteSlug}${endpoint}`

		const cacheKey = `${url}${JSON.stringify(options)}`

		if (this.config.cache.enabled && options.method !== 'POST') {
			const cached = this.cache.get(cacheKey)
			if (cached) {
				return cached as T
			}
		}

		const response = await fetch(url, {
			...options,
			headers: {
				'Authorization': `Bearer ${this.config.apiToken}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				...(options.headers ?? {})
			}
		})

		if (!response.ok) {
			await this.handleError(response)
		}

		const data = await response.json() as T

		if (this.config.cache.enabled && options.method !== 'POST') {
			this.cache.set(cacheKey, data)
		}

		return data
	}

	private async handleError(response: Response): Promise<never> {
		const status = response.status
		let errorData: unknown

		try {
			errorData = await response.json()
		} catch {
			errorData = null
		}

		switch (status) {
			case 401:
				throw new RushCMSUnauthorizedError()
			case 403:
				throw new RushCMSForbiddenError('this resource')
			case 404:
				throw new RushCMSNotFoundError('Resource')
			case 422:
				throw new RushCMSValidationError(
					'Validation error',
					(errorData as { errors?: Record<string, string[]> }).errors
				)
			default:
				throw new RushCMSError(
					`API Error: ${String(response.status)} ${response.statusText}`,
					status,
					errorData
				)
		}
	}

	async getEntries(
		collection: number | string,
		params?: EntriesQueryParams
	): Promise<PaginatedResponse<Entry>> {
		const queryString = new URLSearchParams()

		if (params?.page) {
			queryString.set('page', params.page.toString())
		}
		if (params?.per_page) {
			queryString.set('per_page', params.per_page.toString())
		}
		if (params?.tags) {
			const tags = Array.isArray(params.tags) ? params.tags.join(',') : params.tags
			queryString.set('tags', tags)
		}
		if (params?.tag_operator) {
			queryString.set('tag_operator', params.tag_operator)
		}

		const endpoint = `/collections/${String(collection)}/entries${queryString.toString() ? `?${queryString}` : ''
			}`

		return this.request<PaginatedResponse<Entry>>(endpoint)
	}

	async getEntry(
		collection: number | string,
		slug: string
	): Promise<Entry> {
		const endpoint = `/collections/${String(collection)}/entries/${slug}`
		return this.request<Entry>(endpoint)
	}

	async getHomepage(): Promise<ApiResponse<Homepage>> {
		const endpoint = '/homepage'
		return this.request<ApiResponse<Homepage>>(endpoint)
	}

	async getNavigations(): Promise<ApiResponse<Navigation[]>> {
		const endpoint = '/navigations'
		return this.request<ApiResponse<Navigation[]>>(endpoint)
	}

	async getNavigation(key: string): Promise<ApiResponse<Navigation>> {
		const endpoint = `/navigations/${key}`
		return this.request<ApiResponse<Navigation>>(endpoint)
	}

	async getLinkPages(): Promise<ApiResponse<LinkPage[]>> {
		const endpoint = '/linkpages'
		return this.request<ApiResponse<LinkPage[]>>(endpoint)
	}

	async getLinkPage(key: string): Promise<ApiResponse<LinkPage>> {
		const endpoint = `/linkpages/${key}`
		return this.request<ApiResponse<LinkPage>>(endpoint)
	}

	clearCache(): void {
		this.cache.clear()
	}

	deleteFromCache(key: string): void {
		this.cache.delete(key)
	}
}
