'use client'

import { GalleryBlock as GalleryBlockType } from '@rushcms/types'
import { cn } from '../../../utils'
import { Gallery, Item } from 'react-photoswipe-gallery'
import { GallerySlider } from '../../layout/gallery-slider'
import 'photoswipe/dist/photoswipe.css'

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
	if (!block.data.images || block.data.images.length === 0) {
		return null
	}

	const gapClass = gapStyles[block.data.gap]
	const borderRadiusClass = borderRadiusStyles[block.data.border_radius]

	const containerClasses = cn(
		'w-full',
		{
			'grid': block.data.layout === 'grid',
			'columns-2 md:columns-3 lg:columns-4': block.data.layout === 'masonry',
			'flex overflow-x-auto snap-x snap-mandatory': block.data.layout === 'carousel' || block.data.layout === 'slider'
		},
		block.data.layout === 'grid' ? gridColumnsStyles[block.data.columns] : '',
		gapClass,
		className
	)

	if (block.data.layout === 'slider' || block.data.layout === 'carousel') {
		return <GallerySlider
            block={block}
            className={className}
            type={block.data.layout}
        />
	}

	const galleryContent = (
		<div className={containerClasses}>
			{block.data.images.map((image, index) => {
				const imageElement = (
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
					/>
				)

				return (
					<figure
						key={index}
						className={cn({
							'break-inside-avoid mb-4': block.data.layout === 'masonry'
						})}
					>
						{block.data.lightbox ? (
							<Item
								original={image.url}
								thumbnail={image.url}
								width="auto"
								height="auto"
								caption={block.data.show_captions ? image.name : undefined}
							>
								{({ ref, open }) => (
									<div ref={ref} onClick={open}>
										{imageElement}
									</div>
								)}
							</Item>
						) : (
							imageElement
						)}
					</figure>
				)
			})}
		</div>
	)

	if (block.data.lightbox) {
		return (
			<Gallery
				options={{
					zoom: true,
					loop: true,
					counter: true,
					closeOnVerticalDrag: true,
					pinchToClose: true,
					escKey: true,
					arrowKeys: true
				}}
			>
				{galleryContent}
			</Gallery>
		)
	}

	return galleryContent
}
