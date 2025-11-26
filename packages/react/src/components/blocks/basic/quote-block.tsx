import { QuoteBlock as QuoteBlockType, TipTapContent } from '@rushcms/types'
import { cn } from '../../../utils'
import { RichTextRenderer } from '../../../renderers/rich-text-renderer'

interface QuoteBlockProps {
	block: QuoteBlockType
	className?: string
}

function isRichTextContent(value: unknown): value is TipTapContent {
	return (
		typeof value === 'object' &&
		value !== null &&
		'type' in value &&
		value.type === 'doc' &&
		'content' in value &&
		Array.isArray(value.content)
	)
}

export function QuoteBlock({ block, className }: QuoteBlockProps) {
	const quoteContent = block.data.quote

	return (
		<blockquote className={cn('border-l-4 border-gray-300 pl-6 py-2 my-6', className)}>
			<div className='text-lg italic text-gray-700 mb-3'>
				{isRichTextContent(quoteContent) ? (
					<RichTextRenderer content={quoteContent} className='[&>p]:mb-0' />
				) : (
					<p>{quoteContent as string}</p>
				)}
			</div>
			{(block.data.author || block.data.author_title) && (
				<footer className='flex items-center gap-3'>
					{block.data.author_image && (
						<img
							src={block.data.author_image}
							alt={block.data.author || ''}
							className='w-12 h-12 rounded-full object-cover'
						/>
					)}
					<div>
						{block.data.author && (
							<cite className='font-medium text-gray-900 not-italic block'>
								{block.data.author}
							</cite>
						)}
						{block.data.author_title && (
							<span className='text-sm text-gray-600'>{block.data.author_title}</span>
						)}
					</div>
				</footer>
			)}
			{block.data.source_url && (
				<a
					href={block.data.source_url}
					target='_blank'
					rel='noopener noreferrer'
					className='text-sm text-blue-600 hover:underline mt-2 inline-block'
				>
					View source
				</a>
			)}
		</blockquote>
	)
}
