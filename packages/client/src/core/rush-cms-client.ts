import type {
	Entry,
	PaginatedResponse,
	EntriesQueryParams,
	Navigation,
	LinkPage,
	Homepage,
	ApiResponse,
	SupportedLocale,
	Collection
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
	locale?: {
		default?: SupportedLocale
		fallback?: SupportedLocale
	}
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
	locale: {
		default: SupportedLocale
		fallback: SupportedLocale
	}
	cache: {
		enabled: boolean
		ttl: number
	}
	storage: StorageAdapter
	debug: boolean
}

export class RushCMSClient {
	private config: InternalRushCMSClientConfig
	private currentLocale: SupportedLocale

	constructor(config: RushCMSClientConfig) {
		const cacheConfig = {
			enabled: config.cache?.enabled ?? true,
			ttl: config.cache?.ttl ?? 7200
		}

		const localeConfig = {
			default: config.locale?.default ?? 'en' as SupportedLocale,
			fallback: config.locale?.fallback ?? 'en' as SupportedLocale
		}

		this.config = {
			baseUrl: config.baseUrl,
			apiToken: config.apiToken,
			siteSlug: config.siteSlug,
			locale: localeConfig,
			cache: cacheConfig,
			storage: config.storage || new MemoryStorageAdapter(),
			debug: config.debug || false
		}

		this.currentLocale = localeConfig.default
	}

	/**
	 * Set the current locale for API requests
	 */
	setLocale(locale: SupportedLocale): void {
		this.currentLocale = locale
		this.log(`Locale changed to: ${locale}`)
	}

	/**
	 * Get the current locale
	 */
	getLocale(): SupportedLocale {
		return this.currentLocale
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
					'Accept-Language': this.currentLocale,
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
		params?: EntriesQueryParams & { locale?: SupportedLocale }
	): Promise<PaginatedResponse<Entry>> {
		const queryString = new URLSearchParams()

		if (params?.page) {
			queryString.set('page', params.page.toString())
		}
		if (params?.per_page) {
			queryString.set('per_page', params.per_page.toString())
		}
		if (params?.tag) {
			queryString.set('tag', params.tag)
		}
		if (params?.tags) {
			const tags = Array.isArray(params.tags) ? params.tags.join(',') : params.tags
			queryString.set('tags', tags)
		}
		if (params?.category) {
			queryString.set('category', params.category)
		}
		if (params?.categories) {
			const categories = Array.isArray(params.categories)
				? params.categories.join(',')
				: params.categories
			queryString.set('categories', categories)
		}
		if (params?.tag_operator) {
			queryString.set('tag_operator', params.tag_operator)
		}

		const endpoint = `/collections/${String(collection)}/entries${queryString.toString() ? `?${queryString}` : ''
			}`

		const locale = params?.locale || this.currentLocale
		const headers: HeadersInit = {
			'Accept-Language': locale
		}

		return this.request<PaginatedResponse<Entry>>(endpoint, { headers })
	}

	async getEntry(
		collection: number | string,
		slug: string,
		locale?: SupportedLocale
	): Promise<Entry> {
		const endpoint = `/collections/${String(collection)}/entries/${slug}`
		const activeLocale = locale || this.currentLocale
		const headers: HeadersInit = {
			'Accept-Language': activeLocale
		}
		const response = await this.request<{ data: Entry }>(endpoint, { headers })
		return response.data
	}

	async getCollections(locale?: SupportedLocale): Promise<ApiResponse<Collection[]>> {
		const endpoint = '/collections'
		const activeLocale = locale || this.currentLocale
		const headers: HeadersInit = {
			'Accept-Language': activeLocale
		}
		return this.request<ApiResponse<Collection[]>>(endpoint, { headers })
	}

	async getHomepage(locale?: SupportedLocale): Promise<ApiResponse<Homepage>> {
		const endpoint = '/homepage'
		const activeLocale = locale || this.currentLocale
		const headers: HeadersInit = {
			'Accept-Language': activeLocale
		}
		return this.request<ApiResponse<Homepage>>(endpoint, { headers })
	}

	async getNavigations(locale?: SupportedLocale): Promise<ApiResponse<Navigation[]>> {
		const endpoint = '/navigations'
		const activeLocale = locale || this.currentLocale
		const headers: HeadersInit = {
			'Accept-Language': activeLocale
		}
		return this.request<ApiResponse<Navigation[]>>(endpoint, { headers })
	}

	async getNavigation(key: string, locale?: SupportedLocale): Promise<ApiResponse<Navigation>> {
		const endpoint = `/navigations/${key}`
		const activeLocale = locale || this.currentLocale
		const headers: HeadersInit = {
			'Accept-Language': activeLocale
		}
		return this.request<ApiResponse<Navigation>>(endpoint, { headers })
	}

	async getLinkPages(locale?: SupportedLocale): Promise<ApiResponse<LinkPage[]>> {
		const endpoint = '/linkpages'
		const activeLocale = locale || this.currentLocale
		const headers: HeadersInit = {
			'Accept-Language': activeLocale
		}
		return this.request<ApiResponse<LinkPage[]>>(endpoint, { headers })
	}

	async getLinkPage(key: string, locale?: SupportedLocale): Promise<ApiResponse<LinkPage>> {
		const endpoint = `/linkpages/${key}`
		const activeLocale = locale || this.currentLocale
		const headers: HeadersInit = {
			'Accept-Language': activeLocale
		}
		return this.request<ApiResponse<LinkPage>>(endpoint, { headers })
	}

	async clearCache(): Promise<void> {
		await this.config.storage.clear()
	}

	async deleteFromCache(key: string): Promise<void> {
		await this.config.storage.delete(key)
	}
}
