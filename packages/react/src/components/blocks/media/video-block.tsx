import { VideoBlock as VideoBlockType } from '@rushcms/types'
import { cn } from '../../../utils'

interface VideoBlockProps {
	block: VideoBlockType
	className?: string
}

export function VideoBlock({ block, className }: VideoBlockProps) {
	return (
		<figure className={cn('w-full max-w-4xl mx-auto', className)}>
			<div
				className='relative overflow-hidden rounded-lg'
				style={{
					aspectRatio: block.data.aspect_ratio !== 'auto' ? block.data.aspect_ratio : undefined
				}}
			>
				<video
					src={block.data.video}
					poster={block.data.poster}
					controls={block.data.controls}
					autoPlay={block.data.autoplay}
					loop={block.data.loop}
					muted={block.data.muted}
					className='w-full h-full'
				>
					Your browser does not support the video tag.
				</video>
			</div>
			{block.data.caption && (
				<figcaption className='text-sm text-gray-600 mt-2 text-center'>
					{block.data.caption}
				</figcaption>
			)}
		</figure>
	)
}
