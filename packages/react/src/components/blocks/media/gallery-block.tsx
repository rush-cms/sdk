'use client'

import { useState, useEffect } from 'react'
import { GalleryBlock as GalleryBlockType, GalleryImage } from '@rushcms/types'
import { cn } from '../../../utils'
import { Gallery, Item } from 'react-photoswipe-gallery'
import { GallerySlider } from '../../layout/gallery-slider'
import 'photoswipe/dist/photoswipe.css'

interface GalleryBlockProps {
	block: GalleryBlockType
	className?: string
}

interface GalleryItemProps {
	image: GalleryImage
	imageElement: React.ReactNode
	lightbox: boolean
}

function GalleryItem({ image, imageElement, lightbox }: GalleryItemProps) {
	const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(
		image.width && image.height ? { width: image.width, height: image.height } : null
	)

	useEffect(() => {
		if (!lightbox || dimensions) return

		const img = new Image()
		img.onload = () => {
			setDimensions({ width: img.naturalWidth, height: img.naturalHeight })
		}
		img.src = image.url
	}, [image.url, lightbox, dimensions])

	if (!lightbox) {
		return <>{imageElement}</>
	}

	if (!dimensions) {
		return <>{imageElement}</>
	}

	return (
		<Item
			original={image.url}
			thumbnail={image.url}
			width={dimensions.width}
			height={dimensions.height}
		>
			{({ ref, open }) => (
				<div ref={ref} onClick={open}>
					{imageElement}
				</div>
			)}
		</Item>
	)
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

export function GalleryBlock({ block, className }: GalleryBlockProps) {
	if (!block.data.images || block.data.images.length === 0) {
		return null
	}

	const layoutString = (block.data.layout || 'grid').toString().toLowerCase()
	const layoutMatch = layoutString.match(/^(grid|masonry|carousel|slider)(?:-(\d+))?$/)

	const layout = (layoutMatch?.[1] || 'grid') as GalleryBlockType['data']['layout']
	const columnsFromLayout = layoutMatch?.[2] ? Number(layoutMatch[2]) : undefined
	const columns = columnsFromLayout || Number(block.data.columns) || 3
	const safeColumns = (columns === 2 || columns === 3 || columns === 4) ? columns : 3

	const gapClass = gapStyles[block.data.gap] || 'gap-4'
	const borderRadiusClass = borderRadiusStyles[block.data.border_radius] || 'rounded-none'

	const containerClasses = cn(
		'w-full',
		{
			'grid grid-cols-2': layout === 'grid' && safeColumns === 2,
			'grid grid-cols-2 md:grid-cols-3': layout === 'grid' && safeColumns === 3,
			'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4': layout === 'grid' && safeColumns === 4,
			'columns-2 md:columns-3 lg:columns-4': layout === 'masonry',
			'flex overflow-x-auto snap-x snap-mandatory': layout === 'carousel' || layout === 'slider'
		},
		layout === 'masonry' ? undefined : gapClass,
		layout === 'masonry' && gapClass?.replace('gap-', 'gap-x-'),
		className
	)

	if (layout === 'slider' || layout === 'carousel') {
		return <GallerySlider
            block={block}
            className={className}
            type={layout}
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
						<GalleryItem
							image={image}
							imageElement={imageElement}
							lightbox={block.data.lightbox}
						/>
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
					arrowKeys: true,
					padding: { top: 20, bottom: 20, left: 20, right: 20 }
				}}
			>
				{galleryContent}
			</Gallery>
		)
	}

	return galleryContent
}
