import { DividerBlock as DividerBlockType } from '@rushcms/types'
import { cn } from '../../../utils'

interface DividerBlockProps {
	block: DividerBlockType
	className?: string
}

const styleClasses = {
	solid: 'border-solid',
	dashed: 'border-dashed',
	dotted: 'border-dotted'
}

const spacingClasses = {
	small: 'my-4',
	medium: 'my-8',
	large: 'my-12'
}

export function DividerBlock({ block, className }: DividerBlockProps) {
	return (
		<hr
			className={cn(
				'border-gray-300',
				styleClasses[block.data.style],
				spacingClasses[block.data.spacing],
				className
			)}
		/>
	)
}
