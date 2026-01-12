'use client'

import type { Block, TipTapContent } from '@rushcms/types'
import { BlocksRenderer } from './block-renderer'
import { TipTapRenderer } from './tiptap-renderer'
import { useContentFormat } from '../hooks/use-content-format'

interface ContentRendererProps {
	content: Block[] | TipTapContent | unknown
	className?: string
}

export function ContentRenderer({ content, className }: ContentRendererProps) {
	const format = useContentFormat(content)

	if (format === 'content-editor') {
		return <TipTapRenderer content={content as TipTapContent} className={className} />
	}

	if (format === 'block-editor') {
		return <BlocksRenderer blocks={content as Block[]} className={className} />
	}

	return null
}
