# RushCMS SDK

TypeScript/React SDK for RushCMS headless CMS.

## Packages

- `@rushcms/types` - TypeScript definitions
- `@rushcms/client` - API client (Node.js, browsers, React Native)
- `@rushcms/react` - React hooks & components

## Installation

```bash
pnpm add @rushcms/client @rushcms/react @rushcms/types
```

## Quick Start

```typescript
import { RushCMSClient } from '@rushcms/client'

const client = new RushCMSClient({
	baseUrl: 'https://api.rushcms.com',
	apiToken: 'your-token',
	siteSlug: 'your-site'
})
```

### React

```tsx
import { RushCMSProvider, useEntries, BlocksRenderer } from '@rushcms/react'

function App() {
	return (
		<RushCMSProvider client={client}>
			<BlogList />
		</RushCMSProvider>
	)
}

function BlogList() {
	const { entries, loading } = useEntries({ collectionId: 5 })

	if (loading) return <div>Loading...</div>

	return entries.map(entry => (
		<article key={entry.id}>
			<h2>{entry.title}</h2>
			<BlocksRenderer blocks={entry.data.content} />
		</article>
	))
}
```

## API Features

### Collections & Entries
```tsx
const { entries } = useEntries({ collectionId: 1, params: { tags: ['tech'] } })
const { entry } = useEntry({ collectionId: 1, slug: 'my-post' })
```

### Navigation
```tsx
const { navigations } = useNavigations()
const { navigation } = useNavigation({ key: 'main-menu' })
```

### LinkPages
```tsx
const { linkPages } = useLinkPages()
const { linkPage } = useLinkPage({ key: 'abc123' })
```

## Blocks (15 types)

**Basic:** RichText, Callout, Toggle, Quote
**Media:** Image, Gallery, Video
**Embed:** YouTube, Embed, Bookmark
**Advanced:** Alert, Divider, Code, Columns, Button

All blocks support Tailwind CSS styling and work with Server/Client Components.

## Features

- Full TypeScript support
- Built-in caching (2h default)
- React hooks for all endpoints
- 15 pre-built components
- TipTap rich text
- Next.js 15/16 compatible

## Development

```bash
pnpm install
pnpm build
```

## License

MIT
