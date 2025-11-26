'use client'

import { Block } from '@rushcms/types'

import { RichTextBlock, CalloutBlock, ToggleBlock, QuoteBlock } from '../components/blocks/basic'
import { ImageBlock, GalleryBlock, VideoBlock } from '../components/blocks/media'
import { YoutubeBlock, EmbedBlock, BookmarkBlock } from '../components/blocks/embed'
import { AlertBlock, DividerBlock, CodeBlock, ColumnsBlock, ButtonBlock } from '../components/blocks/advanced'

interface BlockRendererProps {
	block: Block
	className?: string
}

export function BlockRenderer({ block, className }: BlockRendererProps) {
	switch (block.type) {
		case 'richtext':
			return <RichTextBlock block={block} className={className} />

		case 'callout':
			return <CalloutBlock block={block} className={className} />

		case 'toggle':
			return <ToggleBlock block={block} className={className} />

		case 'quote':
			return <QuoteBlock block={block} className={className} />

		case 'image':
			return <ImageBlock block={block} className={className} />

		case 'gallery':
			return <GalleryBlock block={block} className={className} />

		case 'video':
			return <VideoBlock block={block} className={className} />

		case 'youtube':
			return <YoutubeBlock block={block} className={className} />

		case 'embed':
			return <EmbedBlock block={block} className={className} />

		case 'bookmark':
			return <BookmarkBlock block={block} className={className} />

		case 'alert':
			return <AlertBlock block={block} className={className} />

		case 'divider':
			return <DividerBlock block={block} className={className} />

		case 'code':
			return <CodeBlock block={block} className={className} />

		case 'columns':
			return <ColumnsBlock block={block} className={className} />

		case 'button':
			return <ButtonBlock block={block} className={className} />

		default:
			console.warn(`Unknown block type: ${(block as { type: string }).type}`)
			return null
	}
}

interface BlocksRendererProps {
	blocks?: Block[]
	className?: string
}

export function BlocksRenderer({ blocks, className }: BlocksRendererProps) {
	if (!blocks || blocks.length === 0) {
		return null
	}

	return (
		<div className={className}>
			{blocks.map((block, index) => (
				<BlockRenderer key={index} block={block} />
			))}
		</div>
	)
}
