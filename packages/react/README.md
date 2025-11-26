# @rush-cms/react

React ready components and hooks for RushCMS.

## Installation

```bash
pnpm add @rush-cms/react @rush-cms/client @rush-cms/types react react-dom
```

## Usage

### Setup Provider

```tsx
import { RushCMSProvider } from '@rush-cms/react'
import { RushCMSClient } from '@rush-cms/client'

const client = new RushCMSClient({
	baseUrl: 'https://api.rushcms.com',
	apiToken: 'your-api-token',
	siteSlug: 'your-site-slug'
})

function App() {
	return (
		<RushCMSProvider client={client}>
			<YourApp />
		</RushCMSProvider>
	)
}
```

### Use Hooks

#### `useEntry`

Fetch a single entry.

```tsx
import { useEntry, BlocksRenderer } from '@rush-cms/react'

function BlogPost({ slug }: { slug: string }) {
	const { entry, loading, error, refetch } = useEntry({
		collectionId: 5,
		slug
	})

	if (loading) return <div>Loading...</div>
	if (error) return <div>Error: {error.message}</div>
	if (!entry) return <div>Not found</div>

	return (
		<article>
			<h1>{entry.title}</h1>
			<BlocksRenderer blocks={entry.data.content} />
		</article>
	)
}
```

#### `useEntries`

Fetch multiple entries with pagination.

```tsx
import { useEntries } from '@rush-cms/react'

function BlogList() {
	const { entries, pagination, loading, error, fetchMore } = useEntries({
		collectionId: 5,
		params: { page: 1, per_page: 10 }
	})

	if (loading) return <div>Loading...</div>
	if (error) return <div>Error: {error.message}</div>

	return (
		<div>
			{entries.map(entry => (
				<article key={entry.id}>
					<h2>{entry.title}</h2>
					<p>{entry.excerpt}</p>
				</article>
			))}
			{pagination && pagination.meta.current_page < pagination.meta.last_page && (
				<button onClick={() => fetchMore(pagination.meta.current_page + 1)}>
					Load More
				</button>
			)}
		</div>
	)
}
```

### Render Blocks

#### `BlocksRenderer`

Render all blocks in an entry.

```tsx
import { BlocksRenderer } from '@rush-cms/react'

function EntryContent({ entry }) {
	return <BlocksRenderer blocks={entry.data.content} />
}
```

#### `BlockRenderer`

Render a single block.

```tsx
import { BlockRenderer } from '@rush-cms/react'

function SingleBlock({ block }) {
	return <BlockRenderer block={block} className='my-4' />
}
```

### Individual Block Components

You can also use individual block components:

```tsx
import {
	ImageBlock,
	CodeBlock,
	CalloutBlock,
	QuoteBlock
} from '@rush-cms/react'

function MyComponent() {
	return (
		<div>
			<ImageBlock block={imageBlockData} />
			<CodeBlock block={codeBlockData} />
		</div>
	)
}
```

## Components

### Block Components

#### Basic
- `RichTextBlock`
- `CalloutBlock`
- `ToggleBlock`
- `QuoteBlock`

#### Media
- `ImageBlock`
- `GalleryBlock`
- `VideoBlock`

#### Embed
- `YoutubeBlock`
- `EmbedBlock`
- `BookmarkBlock`

#### Advanced
- `AlertBlock`
- `DividerBlock`
- `CodeBlock`
- `ColumnsBlock`
- `ButtonBlock`

### Layout Components

- `Lightbox` - Image lightbox component

### Renderers

- `RichTextRenderer` - Renders TipTap JSON content
- `BlockRenderer` - Renders any block type
- `BlocksRenderer` - Renders an array of blocks

## Styling

All components use Tailwind CSS for styling. Make sure to include Tailwind in your project:

```bash
pnpm add -D tailwindcss autoprefixer postcss
```

Configure Tailwind to scan the SDK components:

```js
module.exports = {
	content: [
		'./src/**/*.{js,ts,jsx,tsx}',
		'./node_modules/@rushcms/react/dist/**/*.{js,mjs}'
	],
	theme: {
		extend: {}
	},
	plugins: []
}
```

## Utilities

```tsx
import {
	cn,
	parseHighlightLines,
	getYoutubeVideoId,
	buildYoutubeEmbedUrl
} from '@rush-cms/react'
```

## License

MIT
