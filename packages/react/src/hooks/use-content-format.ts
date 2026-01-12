import type { Block, TipTapContent } from '@rushcms/types'

export type ContentFormat = 'block-editor' | 'content-editor' | 'unknown'

export function useContentFormat(content: Block[] | TipTapContent | unknown): ContentFormat {
	if (!content) return 'unknown'

	if (
		typeof content === 'object' &&
		'type' in content &&
		content.type === 'doc' &&
		'content' in content &&
		Array.isArray(content.content)
	) {
		return 'content-editor'
	}

	if (
		Array.isArray(content) &&
		content.length > 0 &&
		'type' in content[0] &&
		'data' in content[0]
	) {
		return 'block-editor'
	}

	return 'unknown'
}
