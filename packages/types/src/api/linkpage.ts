export type LinkPageDisplayMode = 'icon' | 'icon_text' | 'text'

export type LinkPageIcon =
	| 'link'
	| 'globe'
	| 'envelope'
	| 'phone'
	| 'map-pin'
	| 'shopping-cart'
	| 'camera'
	| 'video-camera'
	| 'music-note'
	| 'book-open'
	| 'newspaper'
	| 'academic-cap'
	| 'briefcase'
	| 'heart'
	| 'star'
	| 'fire'
	| 'sparkles'
	| 'chat-bubble'
	| 'document'
	| 'calendar'

export type LinkPageSocialPlatform =
	| 'instagram'
	| 'facebook'
	| 'twitter'
	| 'linkedin'
	| 'youtube'
	| 'tiktok'
	| 'github'
	| 'discord'
	| 'whatsapp'
	| 'telegram'
	| 'spotify'
	| 'twitch'

export interface LinkPageLink {
	title: string
	url: string
	icon: LinkPageIcon | null
	display_mode: LinkPageDisplayMode
}

export interface LinkPageSocialLink {
	platform: LinkPageSocialPlatform
	url: string
}

export interface LinkPageSettings {
	background_color?: string | null
	button_color?: string | null
	text_color?: string | null
}

export interface LinkPage {
	id: number
	key: string
	title: string
	description: string | null
	avatar: string | null
	links: LinkPageLink[]
	social_links: LinkPageSocialLink[]
	settings: LinkPageSettings
}
