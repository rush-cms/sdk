import type {
	Entry,
	PaginatedResponse,
	EntriesQueryParams,
	Navigation,
	LinkPage,
	Homepage,
	ApiResponse,
	SupportedLocale,
	Collection,
	Tag,
	Form,
	FormSubmitPayload,
	FormSubmitResponse,
	SearchIndexEntry,
	SearchIndexParams,
	Member,
	MemberUpdatePayload,
	MembersQueryParams,
	Team
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
		freshTtl?: number
		staleTtl?: number
	}
	storage?: StorageAdapter
	debug?: boolean
}

interface InternalConfig {
	baseUrl: string
	apiToken: string
	siteSlug: string
	locale: {
		default: SupportedLocale
		fallback: SupportedLocale
	}
	cache: {
		enabled: boolean
		freshTtl: number
		staleTtl: number
	}
	storage: StorageAdapter
	debug: boolean
}

export class RushCMSClient {
	private config: InternalConfig
	private currentLocale: SupportedLocale

	constructor(config: RushCMSClientConfig) {
		this.config = {
			baseUrl: config.baseUrl,
			apiToken: config.apiToken,
			siteSlug: config.siteSlug,
			locale: {
				default: config.locale?.default ?? 'en' as SupportedLocale,
				fallback: config.locale?.fallback ?? 'en' as SupportedLocale
			},
			cache: {
				enabled: config.cache?.enabled ?? true,
				freshTtl: config.cache?.freshTtl ?? 60,
				staleTtl: config.cache?.staleTtl ?? 300
			},
			storage: config.storage || new MemoryStorageAdapter(),
			debug: config.debug || false
		}

		this.currentLocale = this.config.locale.default
	}

	setLocale(locale: SupportedLocale): void {
		this.currentLocale = locale
		this.log(`Locale changed to: ${locale}`)
	}

	getLocale(): SupportedLocale {
		return this.currentLocale
	}

	private log(message: string, data?: unknown): void {
		if (this.config.debug) {
			console.log(`[RushCMS] ${message}`, data || '')
		}
	}

	private buildUrl(endpoint: string, withSlug: boolean = true): string {
		if (withSlug) {
			return `${this.config.baseUrl}/api/v1/${this.config.siteSlug}${endpoint}`
		}
		return `${this.config.baseUrl}/api/v1${endpoint}`
	}

	private buildQueryString(params?: Record<string, string | number | string[] | undefined>): string {
		if (!params) return ''
		const qs = new URLSearchParams()
		for (const [key, value] of Object.entries(params)) {
			if (value === undefined || value === null) continue
			if (Array.isArray(value)) {
				qs.set(key, value.join(','))
			} else {
				qs.set(key, String(value))
			}
		}
		const str = qs.toString()
		return str ? `?${str}` : ''
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {},
		overrides?: { withSlug?: boolean; locale?: SupportedLocale; skipCache?: boolean }
	): Promise<T> {
		const withSlug = overrides?.withSlug ?? true
		const locale = overrides?.locale || this.currentLocale
		const skipCache = overrides?.skipCache || false
		const method = options.method || 'GET'
		const url = this.buildUrl(endpoint, withSlug)
		const cacheKey = `${url}:${locale}${JSON.stringify(options.body || '')}`
		const canCache = this.config.cache.enabled && method === 'GET' && !skipCache

		this.log(`${method} ${endpoint}`)

		if (canCache) {
			const cached = await this.config.storage.get<T>(cacheKey)
			if (cached) {
				if (!cached.isStale) {
					this.log(`Cache FRESH: ${endpoint}`)
					return cached.data
				}
				this.log(`Cache STALE: ${endpoint} (revalidating)`)
				this.revalidate<T>(url, options, locale, cacheKey).catch(() => {})
				return cached.data
			}
			this.log(`Cache MISS: ${endpoint}`)
		}

		return this.doFetch<T>(url, options, locale, canCache ? cacheKey : undefined)
	}

	private async revalidate<T>(
		url: string,
		options: RequestInit,
		locale: SupportedLocale,
		cacheKey: string
	): Promise<void> {
		try {
			const response = await fetch(url, {
				...options,
				headers: {
					'Authorization': `Bearer ${this.config.apiToken}`,
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Accept-Language': locale,
					...(options.headers ?? {})
				}
			})

			if (response.ok) {
				const data = await response.json() as T
				await this.config.storage.set(
					cacheKey,
					data,
					this.config.cache.freshTtl,
					this.config.cache.staleTtl
				)
				this.log(`Revalidated: ${url}`)
			}
		} catch (error) {
			this.log(`Revalidation failed: ${error instanceof Error ? error.message : 'Unknown'}`)
		}
	}

	private async doFetch<T>(
		url: string,
		options: RequestInit,
		locale: SupportedLocale,
		cacheKey?: string
	): Promise<T> {
		const response = await fetch(url, {
			...options,
			headers: {
				'Authorization': `Bearer ${this.config.apiToken}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Accept-Language': locale,
				...(options.headers ?? {})
			}
		})

		if (!response.ok) {
			await this.handleError(response)
		}

		const data = await response.json() as T

		if (cacheKey) {
			await this.config.storage.set(
				cacheKey,
				data,
				this.config.cache.freshTtl,
				this.config.cache.staleTtl
			)
		}

		return data
	}

	private async handleError(response: Response): Promise<never> {
		let errorData: unknown
		try {
			errorData = await response.json()
		} catch {
			errorData = null
		}

		switch (response.status) {
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
					`API Error: ${response.status} ${response.statusText}`,
					response.status,
					errorData
				)
		}
	}

	async getCollections(locale?: SupportedLocale): Promise<ApiResponse<Collection[]>> {
		return this.request<ApiResponse<Collection[]>>(
			'/collections',
			{},
			{ locale }
		)
	}

	async getEntries(
		collection: number | string,
		params?: EntriesQueryParams & { locale?: SupportedLocale }
	): Promise<PaginatedResponse<Entry>> {
		const qs = this.buildQueryString({
			page: params?.page,
			per_page: params?.per_page,
			tag: params?.tag,
			tags: params?.tags ? (Array.isArray(params.tags) ? params.tags : [params.tags]) : undefined,
			category: params?.category,
			categories: params?.categories ? (Array.isArray(params.categories) ? params.categories : [params.categories]) : undefined,
			tag_operator: params?.tag_operator
		})

		return this.request<PaginatedResponse<Entry>>(
			`/collections/${String(collection)}/entries${qs}`,
			{},
			{ locale: params?.locale }
		)
	}

	async getEntry(
		collection: number | string,
		slug: string,
		locale?: SupportedLocale
	): Promise<Entry> {
		const response = await this.request<{ data: Entry }>(
			`/collections/${String(collection)}/entries/${slug}`,
			{},
			{ locale }
		)
		return response.data
	}

	async getSearchIndex(
		collection: number | string,
		params?: SearchIndexParams
	): Promise<SearchIndexEntry[]> {
		const qs = this.buildQueryString({ locale: params?.locale })
		return this.request<SearchIndexEntry[]>(
			`/collections/${String(collection)}/search-index${qs}`
		)
	}

	async getTags(locale?: SupportedLocale): Promise<ApiResponse<Tag[]>> {
		return this.request<ApiResponse<Tag[]>>(
			'/tags',
			{},
			{ locale }
		)
	}

	async getTag(tagSlug: string, locale?: SupportedLocale): Promise<Tag> {
		return this.request<Tag>(
			`/tags/${tagSlug}`,
			{},
			{ locale }
		)
	}

	async getTagEntries(tagSlug: string, locale?: SupportedLocale): Promise<ApiResponse<Entry[]>> {
		return this.request<ApiResponse<Entry[]>>(
			`/tags/${tagSlug}/entries`,
			{},
			{ locale }
		)
	}

	async getCategories(locale?: SupportedLocale): Promise<ApiResponse<Tag[]>> {
		return this.request<ApiResponse<Tag[]>>(
			'/categories',
			{},
			{ locale }
		)
	}

	async getCategory(categorySlug: string, locale?: SupportedLocale): Promise<Tag> {
		return this.request<Tag>(
			`/categories/${categorySlug}`,
			{},
			{ locale }
		)
	}

	async getCategoryEntries(categorySlug: string, locale?: SupportedLocale): Promise<ApiResponse<Entry[]>> {
		return this.request<ApiResponse<Entry[]>>(
			`/categories/${categorySlug}/entries`,
			{},
			{ locale }
		)
	}

	async getNavigations(locale?: SupportedLocale): Promise<ApiResponse<Navigation[]>> {
		return this.request<ApiResponse<Navigation[]>>(
			'/navigations',
			{},
			{ locale }
		)
	}

	async getNavigation(key: string, locale?: SupportedLocale): Promise<ApiResponse<Navigation>> {
		return this.request<ApiResponse<Navigation>>(
			`/navigations/${key}`,
			{},
			{ locale }
		)
	}

	async getLinkPages(locale?: SupportedLocale): Promise<ApiResponse<LinkPage[]>> {
		return this.request<ApiResponse<LinkPage[]>>(
			'/linkpages',
			{},
			{ locale }
		)
	}

	async getLinkPage(key: string, locale?: SupportedLocale): Promise<ApiResponse<LinkPage>> {
		return this.request<ApiResponse<LinkPage>>(
			`/linkpages/${key}`,
			{},
			{ locale }
		)
	}

	async getForms(locale?: SupportedLocale): Promise<ApiResponse<Form[]>> {
		return this.request<ApiResponse<Form[]>>(
			'/forms',
			{},
			{ locale }
		)
	}

	async getForm(key: string, locale?: SupportedLocale): Promise<ApiResponse<Form>> {
		return this.request<ApiResponse<Form>>(
			`/forms/${key}`,
			{},
			{ locale }
		)
	}

	async submitForm(key: string, payload: FormSubmitPayload): Promise<FormSubmitResponse> {
		return this.request<FormSubmitResponse>(
			`/forms/${key}/submit`,
			{
				method: 'POST',
				body: JSON.stringify(payload)
			},
			{ skipCache: true }
		)
	}

	async getHomepage(locale?: SupportedLocale): Promise<ApiResponse<Homepage>> {
		return this.request<ApiResponse<Homepage>>(
			'/homepage',
			{},
			{ locale }
		)
	}

	async getMembers(params?: MembersQueryParams): Promise<PaginatedResponse<Member>> {
		const qs = this.buildQueryString({
			status: params?.status,
			role: params?.role,
			search: params?.search,
			per_page: params?.per_page,
			page: params?.page
		})
		return this.request<PaginatedResponse<Member>>(`/members${qs}`)
	}

	async getMember(id: number): Promise<ApiResponse<Member>> {
		return this.request<ApiResponse<Member>>(`/members/${id}`)
	}

	async getMemberByAuth0(auth0Id: string): Promise<ApiResponse<Member>> {
		return this.request<ApiResponse<Member>>(`/members/auth0/${auth0Id}`)
	}

	async updateMember(id: number, data: MemberUpdatePayload): Promise<ApiResponse<Member>> {
		return this.request<ApiResponse<Member>>(
			`/members/${id}`,
			{
				method: 'PUT',
				body: JSON.stringify(data)
			},
			{ skipCache: true }
		)
	}

	async deleteMember(id: number): Promise<void> {
		await this.request<void>(
			`/members/${id}`,
			{ method: 'DELETE' },
			{ skipCache: true }
		)
	}

	async getTeams(): Promise<ApiResponse<Team[]>> {
		return this.request<ApiResponse<Team[]>>(
			'/teams',
			{},
			{ withSlug: false }
		)
	}

	async invalidateCache(prefix?: string): Promise<void> {
		if (prefix) {
			await this.config.storage.invalidate(prefix)
		} else {
			await this.config.storage.clear()
		}
	}

	async clearCache(): Promise<void> {
		await this.config.storage.clear()
	}
}
