export function getYoutubeVideoId(url: string): string | null {
	if (!url) return null

	const patterns = [
		/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
		/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
		/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
		/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
	]

	for (const pattern of patterns) {
		const match = url.match(pattern)
		if (match) return match[1]
	}

	return null
}

export interface YoutubeEmbedOptions {
	autoplay?: boolean
	controls?: boolean
	startTime?: number
}

export function buildYoutubeEmbedUrl(videoId: string, options?: YoutubeEmbedOptions): string {
	const params = new URLSearchParams()

	if (options?.autoplay) params.set('autoplay', '1')
	if (options?.controls === false) params.set('controls', '0')
	if (options?.startTime) params.set('start', String(options.startTime))

	const qs = params.toString()
	return `https://www.youtube.com/embed/${videoId}${qs ? `?${qs}` : ''}`
}
