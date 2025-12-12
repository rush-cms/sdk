import type { RichTextBlock, CalloutBlock, ToggleBlock, QuoteBlock } from './basic'
import type { ImageBlock, GalleryBlock, VideoBlock } from './media'
import type { YoutubeBlock, EmbedBlock, BookmarkBlock } from './embed'
import type { AlertBlock, DividerBlock, CodeBlock, ColumnsBlock, ButtonBlock } from './advanced'

export * from './tiptap'
export * from './basic'
export * from './media'
export * from './embed'
export * from './advanced'

export type Block =
	| RichTextBlock
	| CalloutBlock
	| ToggleBlock
	| QuoteBlock
	| ImageBlock
	| GalleryBlock
	| VideoBlock
	| YoutubeBlock
	| EmbedBlock
	| BookmarkBlock
	| AlertBlock
	| DividerBlock
	| CodeBlock
	| ColumnsBlock
	| ButtonBlock
