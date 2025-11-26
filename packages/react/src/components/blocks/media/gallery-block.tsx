'use client'

import { useState } from 'react'
import { GalleryBlock as GalleryBlockType } from '@rushcms/types'
import { cn } from '../../../utils'
import { Lightbox } from '../../layout/lightbox'
import { GallerySlider } from '../../layout/gallery-slider'

interface GalleryBlockProps {
	block: GalleryBlockType
	className?: string
}

const gapStyles = {
	small: 'gap-2',
	medium: 'gap-4',
	large: 'gap-6'
}

const borderRadiusStyles = {
	none: 'rounded-none',
	small: 'rounded-sm',
	medium: 'rounded-md',
	large: 'rounded-lg',
	full: 'rounded-full'
}

const gridColumnsStyles: Record<number, string> = {
	2: 'grid-cols-2',
	3: 'grid-cols-2 md:grid-cols-3',
	4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
}

export function GalleryBlock({ block, className }: GalleryBlockProps) {
	const [lightboxOpen, setLightboxOpen] = useState(false)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)

	if (!block.data.images || block.data.images.length === 0) {
		return null
	}

	const gapClass = gapStyles[block.data.gap]
	const borderRadiusClass = borderRadiusStyles[block.data.border_radius]

	const openLightbox = (index: number) => {
		setCurrentImageIndex(index)
		setLightboxOpen(true)
	}

	const containerClasses = cn(
		'w-full',
		{
			'grid': block.data.layout === 'grid',
			'columns-2 md:columns-3 lg:columns-4': block.data.layout === 'masonry',
			'flex overflow-x-auto snap-x snap-mandatory': block.data.layout === 'carousel' || block.data.layout === 'slider'
		},
		gapClass,
		className
	)

	const gridColumnsClass = block.data.layout === 'grid' ? gridColumnsStyles[block.data.columns] : ''

	if (block.data.layout === 'slider' || block.data.layout === 'carousel') {
		return <GallerySlider
            block={block}
            className={className}
            type={block.data.layout}
        />
	}

	return (
		<>
			<div className={cn(containerClasses, gridColumnsClass)}>
				{block.data.images.map((image, index) => (
					<figure
						key={index}
						className={cn({'break-inside-avoid mb-4': block.data.layout === 'masonry'})}
					>
						<img
							src={image.url}
							alt={image.name || ''}
							className={cn(
								'w-full h-auto object-cover',
								borderRadiusClass,
								{
									'cursor-pointer hover:opacity-90 transition-opacity': block.data.lightbox
								}
							)}
							style={{
								aspectRatio: block.data.aspect_ratio !== 'auto' ? block.data.aspect_ratio : undefined
							}}
							onClick={block.data.lightbox ? () => openLightbox(index) : undefined}
						/>
					</figure>
				))}
			</div>
			{block.data.lightbox && (
				<Lightbox
					isOpen={lightboxOpen}
					onClose={() => setLightboxOpen(false)}
					imageSrc={block.data.images[currentImageIndex].url}
					imageAlt={block.data.images[currentImageIndex].name}
					caption={block.data.show_captions ? block.data.images[currentImageIndex].name : undefined}
				/>
			)}
		</>
	)
}
