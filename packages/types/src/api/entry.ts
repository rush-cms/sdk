import type { Author, FeaturedImage, Tag, EntryMeta } from './responses'
import type { ContentFormat } from '../blocks'
import type { LocaleAwareResponse } from './locale'

export interface Entry extends LocaleAwareResponse {
	id: number
	author: Author
	title: string
	slug: string
	excerpt: string
	featured_image: FeaturedImage | null
	data: {
		content?: ContentFormat
		[key: string]: unknown
	}
	status: 'published' | 'draft'
	sort_order: number | null
	published_at: string
	meta: EntryMeta
	tags: Tag[]
	categories: Tag[]
}
