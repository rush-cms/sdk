import { ColumnsBlock as ColumnsBlockType } from '@rushcms/types'
import { RichTextRenderer } from '../../../renderers/rich-text-renderer'
import { cn } from '../../../utils'

interface ColumnsBlockProps {
	block: ColumnsBlockType
	className?: string
}

const gapClasses = {
	small: 'gap-4',
	medium: 'gap-6',
	large: 'gap-8'
}

export function ColumnsBlock({ block, className }: ColumnsBlockProps) {
	if (!block.data.items || block.data.items.length === 0) {
		return null
	}

	const gridCols = block.data.columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
	const gapClass = gapClasses[block.data.gap]

	return (
		<div className={cn('grid grid-cols-1', gridCols, gapClass, className)}>
			{block.data.items.map((item, index) => (
				<div key={index} className='min-w-0'>
					<RichTextRenderer content={item.content} />
				</div>
			))}
		</div>
	)
}
