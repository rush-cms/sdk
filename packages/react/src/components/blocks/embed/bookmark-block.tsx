import { BookmarkBlock as BookmarkBlockType } from '@rushcms/types'
import { cn } from '../../../utils'

interface BookmarkBlockProps {
	block: BookmarkBlockType
	className?: string
}

export function BookmarkBlock({ block, className }: BookmarkBlockProps) {
	return (
		<a
			href={block.data.url}
			target='_blank'
			rel='noopener noreferrer'
			className={cn(
				'flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors no-underline',
				className
			)}
		>
			<div className='flex-1 min-w-0'>
				<h3 className='font-semibold text-gray-900 mb-1 truncate'>
					{block.data.title}
				</h3>
				{block.data.description && (
					<p className='text-sm text-gray-600 line-clamp-2 mb-2'>
						{block.data.description}
					</p>
				)}
				<div className='flex items-center gap-2 text-xs text-gray-500'>
					{block.data.favicon && (
						<img
							src={block.data.favicon}
							alt=''
							className='w-4 h-4'
						/>
					)}
					{block.data.site_name && (
						<span>{block.data.site_name}</span>
					)}
				</div>
			</div>
			{block.data.image && (
				<div className='flex-shrink-0 w-32 h-24'>
					<img
						src={block.data.image}
						alt={block.data.title}
						className='w-full h-full object-cover rounded'
					/>
				</div>
			)}
		</a>
	)
}
