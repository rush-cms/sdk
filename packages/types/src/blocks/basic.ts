import type { TipTapContent } from './tiptap'

export interface RichTextBlock {
	type: 'richtext'
	data: {
		content: TipTapContent
	}
}

export interface CalloutBlock {
	type: 'callout'
	data: {
		icon: string
		theme: 'info' | 'warning' | 'success' | 'error' | 'neutral'
		content: TipTapContent
	}
}

export interface ToggleBlock {
	type: 'toggle'
	data: {
		title: string
		content: TipTapContent
		open_by_default: boolean
	}
}

export interface QuoteBlock {
	type: 'quote'
	data: {
		quote: string
		author?: string
		author_title?: string
		author_image?: string
		source_url?: string
	}
}
