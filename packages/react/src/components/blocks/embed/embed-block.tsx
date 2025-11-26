import { EmbedBlock as EmbedBlockType } from '@rushcms/types'
import { cn } from '../../../utils'

interface EmbedBlockProps {
	block: EmbedBlockType
	className?: string
}

export function EmbedBlock({ block, className }: EmbedBlockProps) {
	return (
		<figure className={cn('w-full max-w-4xl mx-auto', className)}>
			<div
				className='relative overflow-hidden rounded-lg'
				style={{
					aspectRatio: block.data.aspect_ratio !== 'auto' ? block.data.aspect_ratio : '16/9'
				}}
			>
				<iframe
					src={block.data.url}
					title={block.data.title || 'Embedded content'}
					allowFullScreen={block.data.allow_fullscreen}
					className='absolute inset-0 w-full h-full border-0'
				/>
			</div>
			{block.data.title && (
				<figcaption className='text-sm text-gray-600 mt-2 text-center'>
					{block.data.title}
				</figcaption>
			)}
		</figure>
	)
}
