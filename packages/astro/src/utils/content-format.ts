import type { TipTapContent, Block } from '@rushcms/types'

export type ContentFormatType = 'tiptap' | 'blocks' | 'unknown'

export function detectContentFormat(content: unknown): ContentFormatType {
	if (!content) return 'unknown'

	if (Array.isArray(content)) {
		if (content.length === 0) return 'unknown'
		const first = content[0]
		if (typeof first === 'object' && first !== null && 'type' in first && 'data' in first) {
			return 'blocks'
		}
		return 'unknown'
	}

	if (typeof content === 'object' && content !== null && 'type' in content) {
		const doc = content as TipTapContent
		if (doc.type === 'doc' && Array.isArray(doc.content)) {
			return 'tiptap'
		}
	}

	return 'unknown'
}

export function isBlocksContent(content: unknown): content is Block[] {
	return detectContentFormat(content) === 'blocks'
}

export function isTipTapContent(content: unknown): content is TipTapContent {
	return detectContentFormat(content) === 'tiptap'
}
