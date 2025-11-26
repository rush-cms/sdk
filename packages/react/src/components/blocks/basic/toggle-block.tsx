'use client'

import { useState } from 'react'
import { ToggleBlock as ToggleBlockType } from '@rushcms/types'
import { RichTextRenderer } from '../../../renderers/rich-text-renderer'
import { cn } from '../../../utils'

interface ToggleBlockProps {
	block: ToggleBlockType
	className?: string
}

export function ToggleBlock({ block, className }: ToggleBlockProps) {
	const [isOpen, setIsOpen] = useState(block.data.open_by_default)

	if (!block.data.content) {
		return null
	}

	return (
		<div className={cn('border border-gray-200 rounded-lg overflow-hidden', className)}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left'
				aria-expanded={isOpen}
			>
				<span className='font-medium text-gray-900'>{block.data.title}</span>
				<svg
					className={cn('w-5 h-5 text-gray-500 transition-transform', {
						'rotate-180': isOpen
					})}
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
				</svg>
			</button>
			{isOpen && (
				<div className='px-4 py-3 border-t border-gray-200'>
					<RichTextRenderer content={block.data.content} />
				</div>
			)}
		</div>
	)
}
