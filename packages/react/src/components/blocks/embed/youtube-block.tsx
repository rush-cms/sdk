import { YoutubeBlock as YoutubeBlockType } from '@rushcms/types'
import { cn, getYoutubeVideoId, buildYoutubeEmbedUrl } from '../../../utils'

interface YoutubeBlockProps {
	block: YoutubeBlockType
	className?: string
}

export function YoutubeBlock({ block, className }: YoutubeBlockProps) {
	const videoId = getYoutubeVideoId(block.data.url)

	if (!videoId) {
		return (
			<div className={cn('p-4 bg-red-50 border border-red-200 rounded-lg', className)}>
				<p className='text-red-800'>Invalid YouTube URL</p>
			</div>
		)
	}

	const embedUrl = buildYoutubeEmbedUrl(videoId, {
		autoplay: block.data.autoplay,
		controls: block.data.controls,
		startTime: block.data.start_time
	})

	return (
		<figure className={cn('w-full max-w-4xl mx-auto', className)}>
			<div
				className='relative overflow-hidden rounded-lg'
				style={{
					aspectRatio: block.data.aspect_ratio !== 'auto' ? block.data.aspect_ratio : '16/9'
				}}
			>
				<iframe
					src={embedUrl}
					title={block.data.title || 'YouTube video'}
					allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
					allowFullScreen
					className='absolute inset-0 w-full h-full'
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
