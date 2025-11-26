export interface ApiResponse<T> {
	data: T
}

export interface PaginatedResponse<T> {
	data: T[]
	links: PaginationLinks
	meta: PaginationMeta
}

export interface PaginationLinks {
	first: string
	last: string
	prev: string | null
	next: string | null
}

export interface PaginationMeta {
	current_page: number
	from: number
	last_page: number
	path: string
	per_page: number
	to: number
	total: number
}

export interface Author {
	name: string
}

export interface FeaturedImage {
	id: number
	name: string
	file_name: string
	mime_type: string
	size: number
	url: string
	thumb: string
	preview: string
	alt?: string
}

export interface Tag {
	id: number
	name: string
	slug: string
}

export interface EntryMeta {
	seo_title?: string
	seo_description?: string
	og_image?: string
	keywords?: string[]
}

export interface EntriesQueryParams {
	page?: number
	per_page?: number
	tags?: string | string[]
	tag_operator?: 'any' | 'all'
}
