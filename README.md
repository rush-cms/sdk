# RushCMS SDK

TypeScript SDK for [RushCMS](https://rushcms.com) headless CMS, optimized for Astro with server-side rendering.

## Packages

| Package | Description | Version |
|---------|-------------|---------|
| `@rushcms/types` | TypeScript definitions for all API entities | 2.1.0 |
| `@rushcms/client` | API client with SWR cache | 2.1.0 |
| `@rushcms/astro` | Astro components and utilities (SSR) | 1.0.0 |
| `@rushcms/cli` | CLI for project scaffolding and codegen | 0.2.0 |

## Quick Start

### New Project

```bash
npx rushcms init my-site
cd my-site
bun run dev
```

### Manual Setup

```bash
pnpm add @rushcms/client @rushcms/astro @rushcms/types
```

```typescript
import { RushCMSClient } from '@rushcms/client'

const client = new RushCMSClient({
	baseUrl: 'https://app.rushcms.com/api/v1',
	apiToken: 'your-token',
	siteSlug: 'your-site',
	cache: {
		enabled: true,
		freshTtl: 60,
		staleTtl: 300
	}
})
```

## Astro Usage

### Rendering Content

```astro
---
import ContentRenderer from '@rushcms/astro/components/content-renderer.astro'
import { rush } from '@/lib/rush'

const response = await rush.getEntry('blog', Astro.params.slug)
const entry = response.data || response
---

<ContentRenderer content={entry.data.content} />
```

### Auto-detecting Fields (Wildcard)

```astro
---
import FieldRenderer from '@rushcms/astro/components/field-renderer.astro'
import { getFieldsFromCollection, getFieldValue } from '@rushcms/astro'

const fields = getFieldsFromCollection(collection)
---

{fields.map((field) => (
	<FieldRenderer value={getFieldValue(entry, field.data.config.name)} field={field} />
))}
```

### Block Components

All 15 block types are available as zero-JS Astro components:

**Basic:** RichText, Callout, Toggle, Quote
**Media:** Image, Gallery, Video
**Embed:** YouTube, Embed, Bookmark
**Advanced:** Alert, Divider, Code, Columns, Button

```astro
---
import BlocksRenderer from '@rushcms/astro/components/blocks-renderer.astro'
---

<BlocksRenderer blocks={entry.data.content} />
```

## API Client

### Collections & Entries

```typescript
const collections = await client.getCollections()
const entries = await client.getEntries('blog', { page: 1, per_page: 12 })
const entry = await client.getEntry('blog', 'my-post')
```

### Tags & Categories

```typescript
const tags = await client.getTags()
const tag = await client.getTag('javascript')
const tagEntries = await client.getTagEntries('javascript')

const categories = await client.getCategories()
const category = await client.getCategory('tutorials')
const categoryEntries = await client.getCategoryEntries('tutorials')
```

### Forms

```typescript
const forms = await client.getForms()
const form = await client.getForm('contact')
await client.submitForm('contact', { data: { name: 'John', email: 'john@example.com' } })
```

### Members & Teams

```typescript
const members = await client.getMembers()
const member = await client.getMember(1)
await client.updateMember(1, { name: 'Updated Name' })
const teams = await client.getTeams()
```

### Search Index

```typescript
const index = await client.getSearchIndex(5, { query: 'astro' })
```

### Cache

The client uses stale-while-revalidate (SWR) caching:

- **Fresh** (default 60s): returns cached data immediately
- **Stale** (default 300s): returns cached data + revalidates in background
- **Expired**: fetches fresh data

```typescript
await client.invalidateCache()
await client.invalidateCache('/collections/blog')
```

## CLI

### `rushcms init [name]`

Scaffolds a new Astro project with Rush CMS integration, SSR via `@astrojs/node` (Coolify-ready), and Tailwind CSS.

### `rushcms codegen`

Connects to the API, reads collection schemas, and generates TypeScript interfaces.

```bash
npx rushcms codegen --out src/types/rushcms-env.d.ts
```

## Deployment

The starter uses `@astrojs/node` in standalone mode, ready for deployment on Coolify or any Node.js host:

```bash
bun run build
bun dist/server/entry.mjs
```

## Development

```bash
pnpm install
pnpm build
pnpm dev
```

## License

MIT
