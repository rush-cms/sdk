'use client'

import type { TipTapContent } from '@rushcms/types'
import { TipTapNodeRenderer } from './tiptap-node-renderer'

interface TipTapRendererProps {
	content: TipTapContent
	className?: string
}

export function TipTapRenderer({ content, className }: TipTapRendererProps) {
	if (!content || !content.content || content.content.length === 0) {
		return null
	}

	return (
		<div className={className}>
			{content.content.map((node, index) => (
				<TipTapNodeRenderer key={index} node={node} />
			))}
		</div>
	)
}
