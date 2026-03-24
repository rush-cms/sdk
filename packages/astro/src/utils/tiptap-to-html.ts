import type { TipTapContent, TipTapNode, TipTapMark } from '@rushcms/types'

export function tiptapToHtml(doc: TipTapContent): string {
	if (!doc || !doc.content) return ''
	return doc.content.map(node => nodeToHtml(node)).join('')
}

function nodeToHtml(node: TipTapNode): string {
	switch (node.type) {
		case 'paragraph': {
			const align = (node as { attrs?: { textAlign?: string } }).attrs?.textAlign
			const style = align ? ` style="text-align: ${align}"` : ''
			return `<p${style}>${renderContent(node)}</p>`
		}

		case 'heading': {
			const attrs = (node as { attrs: { level: number; textAlign?: string } }).attrs
			const level = attrs.level || 1
			const style = attrs.textAlign ? ` style="text-align: ${attrs.textAlign}"` : ''
			return `<h${level}${style}>${renderContent(node)}</h${level}>`
		}

		case 'text':
			return renderText(node)

		case 'hardBreak':
			return '<br />'

		case 'bulletList':
			return `<ul>${renderContent(node)}</ul>`

		case 'orderedList': {
			const start = (node as { attrs?: { start?: number } }).attrs?.start
			const attr = start && start !== 1 ? ` start="${start}"` : ''
			return `<ol${attr}>${renderContent(node)}</ol>`
		}

		case 'listItem':
			return `<li>${renderContent(node)}</li>`

		case 'blockquote':
			return `<blockquote>${renderContent(node)}</blockquote>`

		case 'codeBlock': {
			const lang = (node as { attrs?: { language?: string } }).attrs?.language || ''
			const code = (node as { content?: Array<{ text?: string }> }).content?.[0]?.text || ''
			const cls = lang ? ` class="language-${escapeHtml(lang)}"` : ''
			return `<pre><code${cls}>${escapeHtml(code)}</code></pre>`
		}

		case 'horizontalRule':
			return '<hr />'

		case 'table':
			return `<table>${renderContent(node)}</table>`

		case 'tableRow':
			return `<tr>${renderContent(node)}</tr>`

		case 'tableCell':
		case 'tableHeader': {
			const tag = node.type === 'tableHeader' ? 'th' : 'td'
			const attrs = (node as { attrs?: { colspan?: number; rowspan?: number; background?: string } }).attrs
			const parts: string[] = []
			if (attrs?.colspan && attrs.colspan > 1) parts.push(`colspan="${attrs.colspan}"`)
			if (attrs?.rowspan && attrs.rowspan > 1) parts.push(`rowspan="${attrs.rowspan}"`)
			if (attrs?.background) parts.push(`style="background-color: ${attrs.background}"`)
			const attrStr = parts.length > 0 ? ` ${parts.join(' ')}` : ''
			return `<${tag}${attrStr}>${renderContent(node)}</${tag}>`
		}

		case 'customBlock': {
			const blockAttrs = (node as { attrs?: { type?: string; data?: Record<string, unknown> } }).attrs
			if (blockAttrs?.type === 'youtube') {
				return renderYoutubeEmbed(blockAttrs.data || {})
			}
			return `<div data-type="${escapeHtml(blockAttrs?.type || 'unknown')}">${renderContent(node)}</div>`
		}

		default:
			return renderContent(node)
	}
}

function renderContent(node: TipTapNode): string {
	const content = (node as { content?: TipTapNode[] }).content
	if (!content) return ''
	return content.map(child => nodeToHtml(child)).join('')
}

function renderText(node: TipTapNode): string {
	const text = (node as { text?: string }).text
	if (!text) return ''

	let html = escapeHtml(text)
	const marks = (node as { marks?: TipTapMark[] }).marks
	if (marks && marks.length > 0) {
		html = applyMarks(html, marks)
	}
	return html
}

function applyMarks(text: string, marks: TipTapMark[]): string {
	let result = text

	for (const mark of marks) {
		switch (mark.type) {
			case 'bold':
				result = `<strong>${result}</strong>`
				break
			case 'italic':
				result = `<em>${result}</em>`
				break
			case 'code':
				result = `<code>${result}</code>`
				break
			case 'strike':
				result = `<s>${result}</s>`
				break
			case 'underline':
				result = `<u>${result}</u>`
				break
			case 'subscript':
				result = `<sub>${result}</sub>`
				break
			case 'superscript':
				result = `<sup>${result}</sup>`
				break
			case 'link': {
				const href = escapeHtml(mark.attrs?.href || '#')
				const target = mark.attrs?.target || '_self'
				const rel = target === '_blank' ? ' rel="noopener noreferrer"' : ''
				result = `<a href="${href}" target="${target}"${rel}>${result}</a>`
				break
			}
			case 'highlight': {
				const color = mark.attrs?.color || 'yellow'
				result = `<mark style="background-color: ${color}">${result}</mark>`
				break
			}
		}
	}

	return result
}

function renderYoutubeEmbed(data: Record<string, unknown>): string {
	const url = data.url as string
	if (!url) return ''

	const videoId = getYoutubeVideoIdFromUrl(url)
	if (!videoId) return ''

	return `<figure class="w-full max-w-4xl mx-auto"><div class="relative overflow-hidden rounded-lg" style="aspect-ratio: 16/9"><iframe src="https://www.youtube.com/embed/${escapeHtml(videoId)}" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="absolute inset-0 w-full h-full"></iframe></div></figure>`
}

function getYoutubeVideoIdFromUrl(url: string): string | null {
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
	]
	for (const pattern of patterns) {
		const match = url.match(pattern)
		if (match) return match[1]
	}
	return null
}

function escapeHtml(text: string): string {
	const map: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	}
	return text.replace(/[&<>"']/g, char => map[char] || char)
}
