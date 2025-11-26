import { Author, FeaturedImage, Tag, EntryMeta } from './responses'
import { Block } from '../blocks'

export interface Entry {
	id: number
	author: Author
	title: string
	slug: string
	excerpt: string
	featured_image: FeaturedImage | null
	data: {
		content: Block[]
		author_bio?: string
		reading_time?: number
		[key: string]: unknown
	}
	status: 'published' | 'draft'
	published_at: string
	created_at: string
	updated_at: string
	meta: EntryMeta
	tags: Tag[]
}
