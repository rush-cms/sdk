import { RichTextBlock as RichTextBlockType } from '@rushcms/types'
import { RichTextRenderer } from '../../../renderers/rich-text-renderer'

interface RichTextBlockProps {
	block: RichTextBlockType
	className?: string
}

export function RichTextBlock({ block, className }: RichTextBlockProps) {
	if (!block.data.content) {
		return null
	}

	return <RichTextRenderer content={block.data.content} className={className} />
}
