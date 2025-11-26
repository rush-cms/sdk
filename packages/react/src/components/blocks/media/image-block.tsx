'use client'

import { useState } from 'react'
import { ImageBlock as ImageBlockType } from '@rushcms/types'
import { cn } from '../../../utils'
import { Lightbox } from '../../layout/lightbox'

interface ImageBlockProps {
	block: ImageBlockType
	className?: string
}

const alignmentStyles = {
	left: 'mr-auto',
	center: 'mx-auto',
	right: 'ml-auto',
	wide: 'w-full max-w-5xl mx-auto',
	full: 'w-full'
}

const sizeStyles = {
	small: 'max-w-sm',
	medium: 'max-w-2xl',
	large: 'max-w-4xl',
	original: 'max-w-none'
}

const borderRadiusStyles = {
	none: 'rounded-none',
	small: 'rounded-sm',
	medium: 'rounded-md',
	large: 'rounded-lg',
	full: 'rounded-full'
}

export function ImageBlock({ block, className }: ImageBlockProps) {
	const [lightboxOpen, setLightboxOpen] = useState(false)

	if (!block.data.image) {
		return null
	}

	const alignmentClass = alignmentStyles[block.data.alignment]
	const sizeClass = sizeStyles[block.data.size]
	const borderRadiusClass = borderRadiusStyles[block.data.border_radius]

	const imageClasses = cn(
		'w-full h-auto object-cover',
		borderRadiusClass,
		{
			'shadow-lg': block.data.shadow,
			'cursor-pointer': block.data.lightbox
		}
	)

	const containerClasses = cn(
		alignmentClass,
		sizeClass,
		className
	)

	const imageElement = (
		<img
			src={block.data.image}
			alt={block.data.alt || ''}
			className={imageClasses}
			loading={block.data.lazy_loading ? 'lazy' : undefined}
			style={{
				aspectRatio: block.data.aspect_ratio !== 'auto' ? block.data.aspect_ratio : undefined
			}}
			onClick={block.data.lightbox ? () => setLightboxOpen(true) : undefined}
		/>
	)

	return (
		<figure className={containerClasses}>
			{block.data.link ? (
				<a
					href={block.data.link}
					target={block.data.link_new_tab ? '_blank' : undefined}
					rel={block.data.link_new_tab ? 'noopener noreferrer' : undefined}
				>
					{imageElement}
				</a>
			) : (
				imageElement
			)}
			{block.data.caption && (
				<figcaption className='text-sm text-gray-600 mt-2 text-center'>
					{block.data.caption}
				</figcaption>
			)}
			{block.data.lightbox && (
				<Lightbox
					isOpen={lightboxOpen}
					onClose={() => setLightboxOpen(false)}
					imageSrc={block.data.image}
					imageAlt={block.data.alt}
					caption={block.data.caption}
				/>
			)}
		</figure>
	)
}
