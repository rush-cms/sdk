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

export interface PaginationLink {
	url: string | null
	label: string
	page: number | null
	active: boolean
}

export interface PaginationMeta {
	current_page: number
	from: number
	last_page: number
	links: PaginationLink[]
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
	type?: 'tag' | 'category'
	entries_count?: number
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
	tag?: string
	tags?: string | string[]
	category?: string
	categories?: string | string[]
	tag_operator?: 'any' | 'all'
}
