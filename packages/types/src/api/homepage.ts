import type { ContentFormat } from '../blocks'
import type { LocaleAwareResponse } from './locale'

export interface Homepage extends LocaleAwareResponse {
	id: number
	content: ContentFormat
	meta: {
		title: string
		description: string
		[key: string]: unknown
	}
	updated_at: string
}
