export function markdownToHtml(md: string): string {
	if (!md) return ''

	let html = md

	html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
	html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
	html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

	html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')

	html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

	html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
	html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
	html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
	html = html.replace(/~~(.+?)~~/g, '<s>$1</s>')

	html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, lang, code) => {
		const cls = lang ? ` class="language-${lang}"` : ''
		return `<pre><code${cls}>${escapeHtml(code.trim())}</code></pre>`
	})

	html = html.replace(/^---$/gm, '<hr />')

	const lines = html.split('\n')
	const result: string[] = []
	let inList = false
	let inOrderedList = false
	let inParagraph = false

	for (const line of lines) {
		const trimmed = line.trim()

		if (trimmed.startsWith('<h') || trimmed.startsWith('<pre') || trimmed.startsWith('<hr') || trimmed.startsWith('<img')) {
			if (inParagraph) { result.push('</p>'); inParagraph = false }
			if (inList) { result.push('</ul>'); inList = false }
			if (inOrderedList) { result.push('</ol>'); inOrderedList = false }
			result.push(trimmed)
			continue
		}

		if (/^[-*] (.+)$/.test(trimmed)) {
			if (inParagraph) { result.push('</p>'); inParagraph = false }
			if (!inList) { result.push('<ul>'); inList = true }
			result.push(`<li>${trimmed.replace(/^[-*] /, '')}</li>`)
			continue
		}

		if (/^\d+\. (.+)$/.test(trimmed)) {
			if (inParagraph) { result.push('</p>'); inParagraph = false }
			if (!inOrderedList) { result.push('<ol>'); inOrderedList = true }
			result.push(`<li>${trimmed.replace(/^\d+\. /, '')}</li>`)
			continue
		}

		if (inList) { result.push('</ul>'); inList = false }
		if (inOrderedList) { result.push('</ol>'); inOrderedList = false }

		if (trimmed === '') {
			if (inParagraph) { result.push('</p>'); inParagraph = false }
			continue
		}

		if (/^> (.+)$/.test(trimmed)) {
			if (inParagraph) { result.push('</p>'); inParagraph = false }
			result.push(`<blockquote><p>${trimmed.replace(/^> /, '')}</p></blockquote>`)
			continue
		}

		if (!inParagraph) {
			result.push('<p>')
			inParagraph = true
		} else {
			result.push('<br />')
		}
		result.push(trimmed)
	}

	if (inParagraph) result.push('</p>')
	if (inList) result.push('</ul>')
	if (inOrderedList) result.push('</ol>')

	return result.join('\n')
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
