export function parseHighlightLines(highlightString?: string): Set<number> {
	if (!highlightString) {
		return new Set()
	}

	const lines = new Set<number>()
	const parts = highlightString.split(',').map(s => s.trim())

	for (const part of parts) {
		if (part.includes('-')) {
			const [start, end] = part.split('-').map(Number)
			if (!isNaN(start) && !isNaN(end)) {
				for (let i = start; i <= end; i++) {
					lines.add(i)
				}
			}
		} else {
			const lineNum = Number(part)
			if (!isNaN(lineNum)) {
				lines.add(lineNum)
			}
		}
	}

	return lines
}

export function getYoutubeVideoId(url: string): string | null {
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
		/^([a-zA-Z0-9_-]{11})$/
	]

	for (const pattern of patterns) {
		const match = url.match(pattern)
		if (match) {
			return match[1]
		}
	}

	return null
}

export function buildYoutubeEmbedUrl(
	videoId: string,
	options: {
		autoplay?: boolean
		controls?: boolean
		startTime?: number
	} = {}
): string {
	const params = new URLSearchParams()

	if (options.autoplay) {
		params.set('autoplay', '1')
	}
	if (options.controls === false) {
		params.set('controls', '0')
	}
	if (options.startTime && options.startTime > 0) {
		params.set('start', options.startTime.toString())
	}

	const queryString = params.toString()
	return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ''}`
}
