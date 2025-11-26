# @rushcms/types

TypeScript type definitions for RushCMS SDK.

## Installation

```bash
pnpm add @rushcms/types
```

## Usage

```typescript
import type {
	Entry,
	Block,
	PaginatedResponse,
	EntriesQueryParams,
	ImageBlock,
	CodeBlock
} from '@rushcms/types'
```

## Type Categories

### API Types
- `Entry` - Complete entry structure
- `PaginatedResponse<T>` - Paginated API responses
- `EntriesQueryParams` - Query parameters for entries
- `Author` - Entry author information
- `FeaturedImage` - Featured image structure
- `Tag` - Tag structure
- `EntryMeta` - SEO metadata

### Block Types

#### Basic Blocks
- `RichTextBlock`
- `CalloutBlock`
- `ToggleBlock`
- `QuoteBlock`

#### Media Blocks
- `ImageBlock`
- `GalleryBlock`
- `VideoBlock`

#### Embed Blocks
- `YoutubeBlock`
- `EmbedBlock`
- `BookmarkBlock`

#### Advanced Blocks
- `AlertBlock`
- `DividerBlock`
- `CodeBlock`
- `ColumnsBlock`
- `ButtonBlock`

### TipTap Types
- `TipTapContent` - TipTap document structure
- `TipTapNode` - TipTap node types
- `TipTapMark` - TipTap text marks

## License

MIT
