'use client'

import React from 'react'
import type { TipTapNode, TipTapMark, FeaturedImage } from '@rushcms/types'
import { cn, getYoutubeVideoId, buildYoutubeEmbedUrl } from '../utils'
import { GalleryBlock } from '../components/blocks/media/gallery-block'
import type { GalleryImage } from '@rushcms/types'

interface TipTapNodeRendererProps {
	node: TipTapNode
	className?: string
}

export function TipTapNodeRenderer({ node, className }: TipTapNodeRendererProps) {
	switch (node.type) {
		case 'text':
			return <TipTapText node={node} />

		case 'paragraph':
			return (
				<p style={{ textAlign: node.attrs?.textAlign }} className={className}>
					{node.content?.map((child, i) => (
						<TipTapNodeRenderer key={i} node={child} />
					))}
				</p>
			)

		case 'heading': {
			const HeadingTag = `h${node.attrs.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
			return (
				<HeadingTag style={{ textAlign: node.attrs.textAlign }} className={className}>
					{node.content?.map((child, i) => (
						<TipTapNodeRenderer key={i} node={child} />
					))}
				</HeadingTag>
			)
		}

		case 'bulletList':
			return (
				<ul className={className}>
					{node.content.map((item, i) => (
						<TipTapNodeRenderer key={i} node={item} />
					))}
				</ul>
			)

		case 'orderedList':
			return (
				<ol start={node.attrs?.start} className={className}>
					{node.content.map((item, i) => (
						<TipTapNodeRenderer key={i} node={item} />
					))}
				</ol>
			)

		case 'listItem':
			return (
				<li className={className}>
					{node.content.map((child, i) => (
						<TipTapNodeRenderer key={i} node={child} />
					))}
				</li>
			)

		case 'codeBlock':
			return (
				<pre className={className}>
					<code className={node.attrs?.language ? `language-${node.attrs.language}` : ''}>
						{node.content?.map((child) => (child.type === 'text' ? child.text : '')).join('')}
					</code>
				</pre>
			)

		case 'blockquote':
			return (
				<blockquote className={className}>
					{node.content.map((child, i) => (
						<TipTapNodeRenderer key={i} node={child} />
					))}
				</blockquote>
			)

		case 'hardBreak':
			return <br />

		case 'horizontalRule':
			return <hr className={className} />

		case 'table':
			return (
				<table className={className}>
					<tbody>
						{node.content.map((row, i) => (
							<TipTapNodeRenderer key={i} node={row} />
						))}
					</tbody>
				</table>
			)

		case 'tableRow':
			return (
				<tr>
					{node.content.map((cell, i) => (
						<TipTapNodeRenderer key={i} node={cell} />
					))}
				</tr>
			)

		case 'tableCell':
		case 'tableHeader': {
			const CellTag = node.type === 'tableHeader' ? 'th' : 'td'
			return (
				<CellTag
					colSpan={node.attrs?.colspan}
					rowSpan={node.attrs?.rowspan}
					style={{ backgroundColor: node.attrs?.background }}
					className={className}
				>
					{node.content.map((child, i) => (
						<TipTapNodeRenderer key={i} node={child} />
					))}
				</CellTag>
			)
		}

		case 'customBlock':
			return <TipTapCustomBlock node={node} className={className} />

		default:
			return null
	}
}

function TipTapText({ node }: { node: TipTapNode & { type: 'text' } }) {
	let text: React.ReactNode = node.text

	if (node.marks) {
		for (const mark of node.marks) {
			text = applyMark(text, mark)
		}
	}

	return <>{text}</>
}

function applyMark(text: React.ReactNode, mark: TipTapMark): React.ReactNode {
	switch (mark.type) {
		case 'bold':
			return <strong>{text}</strong>
		case 'italic':
			return <em>{text}</em>
		case 'underline':
			return <u>{text}</u>
		case 'strike':
			return <s>{text}</s>
		case 'code':
			return <code>{text}</code>
		case 'subscript':
			return <sub>{text}</sub>
		case 'superscript':
			return <sup>{text}</sup>
		case 'link':
			return (
				<a
					href={mark.attrs?.href}
					target={mark.attrs?.target}
					className={mark.attrs?.class}
				>
					{text}
				</a>
			)
		case 'highlight':
			return (
				<mark style={{ backgroundColor: mark.attrs?.color }}>
					{text}
				</mark>
			)
		default:
			return text
	}
}

function TipTapCustomBlock({ node, className }: { node: TipTapNode & { type: 'customBlock' }, className?: string }) {
	const { type, data } = node.attrs

	switch (type) {
		case 'youtube':
			return <TipTapYoutubeEmbed data={data} className={className} />

		case 'gallery':
			return <TipTapGallery data={data} className={className} />

		default:
			return (
				<div className={cn('custom-block p-4 bg-gray-50 border border-gray-200 rounded-lg', className)} data-type={type}>
					<pre className='text-sm overflow-auto'>{JSON.stringify(data, null, 2)}</pre>
				</div>
			)
	}
}

function TipTapYoutubeEmbed({ data, className }: { data: Record<string, unknown>, className?: string }) {
	const url = data.url as string
	const width = (data.width as number) || 560
	const height = (data.height as number) || 315
	const autoplay = (data.autoplay as boolean) || false

	const videoId = getYoutubeVideoId(url)

	if (!videoId) {
		return (
			<div className={cn('p-4 bg-red-50 border border-red-200 rounded-lg', className)}>
				<p className='text-red-800'>Invalid YouTube URL</p>
			</div>
		)
	}

	const embedUrl = buildYoutubeEmbedUrl(videoId, { autoplay })

	return (
		<figure className={cn('w-full max-w-4xl mx-auto', className)}>
			<div
				className='relative overflow-hidden rounded-lg'
				style={{
					aspectRatio: '16/9',
					maxWidth: width,
					maxHeight: height
				}}
			>
				<iframe
					src={embedUrl}
					title='YouTube video'
					allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
					allowFullScreen
					className='absolute inset-0 w-full h-full'
				/>
			</div>
		</figure>
	)
}

function TipTapGallery({ data, className }: { data: Record<string, unknown>, className?: string }) {
	const images = data.images as FeaturedImage[]
	const layout = (data.layout as 'grid' | 'masonry' | 'slider' | 'carousel') || 'grid'
	const columnsValue = (data.columns as number) || 3
	const columns = (columnsValue === 2 || columnsValue === 3 || columnsValue === 4 ? columnsValue : 3) as 2 | 3 | 4

	if (!images || images.length === 0) {
		return null
	}

	return (
		<GalleryBlock
			block={{
				type: 'gallery',
				data: {
					images: images.map(img => ({
						id: img.id,
						url: img.url,
						name: img.alt || img.name,
						file_name: img.file_name,
						mime_type: img.mime_type,
						size: img.size,
						preview: img.preview,
						thumb: img.thumb,
						width: undefined,
						height: undefined
					} as GalleryImage)),
					layout,
					columns,
					gap: 'medium',
					border_radius: 'medium',
					aspect_ratio: 'auto',
					lightbox: true
				}
			}}
			className={className}
		/>
	)
}
