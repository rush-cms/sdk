import { ButtonBlock as ButtonBlockType } from '@rushcms/types'
import { cn } from '../../../utils'

interface ButtonBlockProps {
	block: ButtonBlockType
	className?: string
}

const variantStyles = {
	primary: 'bg-blue-600 text-white hover:bg-blue-700',
	secondary: 'bg-gray-600 text-white hover:bg-gray-700',
	outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
	ghost: 'text-blue-600 hover:bg-blue-50'
}

const sizeStyles = {
	small: 'px-4 py-2 text-sm',
	medium: 'px-6 py-3 text-base',
	large: 'px-8 py-4 text-lg'
}

export function ButtonBlock({ block, className }: ButtonBlockProps) {
	const variantClass = variantStyles[block.data.variant]
	const sizeClass = sizeStyles[block.data.size]

	return (
		<div className={cn('my-6', { 'w-full': block.data.full_width }, className)}>
			<a
				href={block.data.url}
				target={block.data.open_in_new_tab ? '_blank' : undefined}
				rel={block.data.open_in_new_tab ? 'noopener noreferrer' : undefined}
				className={cn(
					'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors no-underline',
					variantClass,
					sizeClass,
					{
						'w-full': block.data.full_width
					}
				)}
			>
				{block.data.icon && block.data.icon_position === 'left' && (
					<span>{block.data.icon}</span>
				)}
				<span>{block.data.text}</span>
				{block.data.icon && block.data.icon_position === 'right' && (
					<span>{block.data.icon}</span>
				)}
			</a>
		</div>
	)
}
