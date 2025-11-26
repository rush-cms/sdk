export interface NavigationItem {
	id: string
	title: string
	type: 'url' | 'collection' | 'entry'
	target: '_self' | '_blank'
	url?: string
	collection?: {
		id: number
		slug: string
		name: string
	}
	entry?: {
		id: number
		slug: string
		title: string
	}
	children: NavigationItem[]
}

export interface Navigation {
	id: number
	name: string
	key: string
	items: NavigationItem[]
}
