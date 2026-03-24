import type { LocaleAwareResponse } from './locale'

export type FieldType =
	| 'content-editor'
	| 'markdown'
	| 'text'
	| 'textarea'
	| 'image'
	| 'gallery'
	| 'list'

export interface FieldConfig {
	name: string
	label: string
	hint?: string | null
	placeholder?: string | null
	type?: string | null
	default_value?: string | null
	database_id?: number | null
	allow_multiple?: boolean
}

export interface FieldValidation {
	is_required?: boolean
	min?: number | null
	max_files?: number | null
	max_selections?: number | null
	min_selections?: number | null
	minlength?: number | null
	maxlength?: number | null
}

export interface CollectionField {
	type: FieldType
	data: {
		config: FieldConfig
		validation: FieldValidation
		enabled_blocks?: string[]
	}
}

export interface CollectionSection {
	title: string | null
	fields: CollectionField[]
}

export interface CollectionOptions {
	main: CollectionSection[]
	sidebar: CollectionSection[]
}

export interface Collection extends LocaleAwareResponse {
	id: number
	name: string
	slug: string
	description?: string
	options?: CollectionOptions
	metadata?: Record<string, unknown>[] | Record<string, unknown>
	items_per_page: number
}
