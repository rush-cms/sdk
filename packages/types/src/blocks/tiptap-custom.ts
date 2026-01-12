import type { FeaturedImage } from '../api/responses'

/**
 * YouTube embed custom block
 */
export interface TipTapYoutubeBlock {
	type: 'customBlock'
	attrs: {
		type: 'youtube'
		data: {
			url: string
			width?: number
			height?: number
			autoplay?: boolean
			controls?: boolean
			muted?: boolean
		}
	}
}

/**
 * Image Gallery custom block
 */
export interface TipTapGalleryBlock {
	type: 'customBlock'
	attrs: {
		type: 'gallery'
		data: {
			images: FeaturedImage[]
			layout?: 'grid' | 'masonry' | 'slider' | 'carousel'
			columns?: number
			gap?: number
			aspectRatio?: string
		}
	}
}

/**
 * Generic custom block (for user-defined blocks)
 */
export interface TipTapGenericCustomBlock {
	type: 'customBlock'
	attrs: {
		type: string
		data: Record<string, unknown>
	}
}

/**
 * Union of all custom block types
 */
export type TipTapCustomBlock =
	| TipTapYoutubeBlock
	| TipTapGalleryBlock
	| TipTapGenericCustomBlock
