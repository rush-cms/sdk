import { CalloutBlock as CalloutBlockType } from '@rushcms/types'
import { RichTextRenderer } from '../../../renderers/rich-text-renderer'
import { cn } from '../../../utils'

interface CalloutBlockProps {
	block: CalloutBlockType
	className?: string
}

const themeStyles = {
	info: 'bg-blue-50 border-blue-200 text-blue-900',
	warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
	success: 'bg-green-50 border-green-200 text-green-900',
	error: 'bg-red-50 border-red-200 text-red-900',
	neutral: 'bg-gray-50 border-gray-200 text-gray-900'
}

export function CalloutBlock({ block, className }: CalloutBlockProps) {
	const themeClass = themeStyles[block.data.theme]

	if (!block.data.content) {
		return null
	}

	return (
		<div className={cn('rounded-lg border-2 p-4 flex gap-3', themeClass, className)}>
			{block.data.icon && (
				<div className='flex-shrink-0 text-2xl leading-none'>
					{block.data.icon}
				</div>
			)}
			<div className='flex-1 min-w-0'>
				<RichTextRenderer content={block.data.content} />
			</div>
		</div>
	)
}
