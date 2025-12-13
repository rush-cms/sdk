import type {
	Entry,
	PaginatedResponse,
	EntriesQueryParams,
	Navigation,
	LinkPage,
	Homepage,
	ApiResponse
} from '@rushcms/types'
import type { StorageAdapter } from './storage/storage-adapter'
import { MemoryStorageAdapter } from './storage/memory-adapter'
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
	cache?: {
		enabled?: boolean
		ttl?: number
	}
	storage?: StorageAdapter
	debug?: boolean
}

interface InternalRushCMSClientConfig {
	baseUrl: string
	apiToken: string
	siteSlug: string
	cache: {
		enabled: boolean
		ttl: number
	}
	storage: StorageAdapter
	debug: boolean
}

export class RushCMSClient {
	private config: InternalRushCMSClientConfig

	constructor(config: RushCMSClientConfig) {
		const cacheConfig = {
			enabled: config.cache?.enabled ?? true,
			ttl: config.cache?.ttl ?? 7200
		}

		this.config = {
			baseUrl: config.baseUrl,
			apiToken: config.apiToken,
			siteSlug: config.siteSlug,
			cache: cacheConfig,
			storage: config.storage || new MemoryStorageAdapter(),
			debug: config.debug || false
		}
	}

	private log(message: string, data?: unknown): void {
		if (this.config.debug) {
			console.log(`[RushCMS] ${message}`, data || '')
		}
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const url = `${this.config.baseUrl}/api/v1/${this.config.siteSlug}${endpoint}`
		const startTime = Date.now()

		this.log(`Request: ${options.method || 'GET'} ${endpoint}`)

		const cacheKey = `${url}${JSON.stringify(options)}`

		if (this.config.cache.enabled && options.method !== 'POST') {
			const cached = await this.config.storage.get<T>(cacheKey)
			if (cached) {
				this.log(`Cache HIT: ${endpoint}`)
				return cached
			}
			this.log(`Cache MISS: ${endpoint}`)
		}

		try {
			const response = await fetch(url, {
				...options,
				headers: {
					'Authorization': `Bearer ${this.config.apiToken}`,
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					...(options.headers ?? {})
				}
			})

			this.log(`Response: ${response.status} (${Date.now() - startTime}ms)`)

			if (!response.ok) {
				await this.handleError(response)
			}

			const data = await response.json() as T

			if (this.config.cache.enabled && options.method !== 'POST') {
				await this.config.storage.set(cacheKey, data, this.config.cache.ttl)
			}

			return data
		} catch (error) {
			this.log(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
			throw error
		}
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

	async clearCache(): Promise<void> {
		await this.config.storage.clear()
	}

	async deleteFromCache(key: string): Promise<void> {
		await this.config.storage.delete(key)
	}
}
