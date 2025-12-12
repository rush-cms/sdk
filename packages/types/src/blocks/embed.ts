import type { AspectRatio } from './media'

export interface YoutubeBlock {
	type: 'youtube'
	data: {
		url: string
		title?: string
		aspect_ratio: AspectRatio
		autoplay: boolean
		controls: boolean
		start_time: number
	}
}

export interface EmbedBlock {
	type: 'embed'
	data: {
		url: string
		title?: string
		aspect_ratio: AspectRatio
		allow_fullscreen: boolean
	}
}

export interface BookmarkBlock {
	type: 'bookmark'
	data: {
		url: string
		title: string
		description?: string
		image?: string
		favicon?: string
		site_name?: string
	}
}
