import type { LocaleAwareResponse } from './locale'

export interface Collection extends LocaleAwareResponse {
	id: number
	name: string
	slug: string
	description?: string
	options?: Record<string, unknown>
	metadata?: Record<string, unknown>
	items_per_page: number
}
