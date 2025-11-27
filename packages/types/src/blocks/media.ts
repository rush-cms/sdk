export type ImageAlignment = 'left' | 'center' | 'right' | 'wide' | 'full'
export type ImageSize = 'small' | 'medium' | 'large' | 'original'
export type AspectRatio = '16/9' | '4/3' | '1/1' | '21/9' | 'auto'
export type BorderRadius = 'none' | 'small' | 'medium' | 'large' | 'full'

export interface ImageBlock {
	type: 'image'
	data: {
		image: string
		caption?: string
		alt?: string
		alignment: ImageAlignment
		size: ImageSize
		aspect_ratio: AspectRatio
		border_radius: BorderRadius
		lazy_loading: boolean
		lightbox: boolean
		shadow: boolean
		link?: string | null
		link_new_tab: boolean
	}
}

export interface GalleryImage {
	id: number
	name: string
	file_name: string
	mime_type: string
	size: number
	url: string
	preview: string
	thumb: string
	width?: number
	height?: number
}

export type GalleryLayout = 'grid' | 'masonry' | 'carousel' | 'slider'

export interface GalleryBlock {
	type: 'gallery'
	data: {
		images: GalleryImage[]
		layout: GalleryLayout
		columns: 2 | 3 | 4
		gap: 'small' | 'medium' | 'large'
		aspect_ratio: AspectRatio
		border_radius: BorderRadius
		lightbox: boolean
		show_captions?: boolean
		caption?: string | null
		autoplay?: boolean
	}
}

export interface VideoBlock {
	type: 'video'
	data: {
		video: string
		poster?: string
		caption?: string
		controls: boolean
		autoplay: boolean
		loop: boolean
		muted: boolean
		aspect_ratio: AspectRatio
	}
}
