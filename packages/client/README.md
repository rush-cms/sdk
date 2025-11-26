# @rushcms/client

TypeScript API client for RushCMS. Works in Node.js, browsers, React Native, and any JavaScript environment.

## Installation

```bash
pnpm add @rushcms/client @rushcms/types
```

## Usage

### Initialize the Client

```typescript
import { RushCMSClient } from '@rushcms/client'

const client = new RushCMSClient({
	baseUrl: 'https://api.rushcms.com',
	apiToken: 'your-api-token',
	siteSlug: 'your-site-slug',
	cache: {
		enabled: true,
		ttl: 7200
	}
})
```

### Fetch Entries

```typescript
const response = await client.getEntries(collectionId, {
	page: 1,
	per_page: 10,
	tags: ['tutorial', 'php'],
	tag_operator: 'all'
})

console.log(response.data)
console.log(response.meta)
```

### Fetch Single Entry

```typescript
const entry = await client.getEntry(collectionId, 'entry-slug')

console.log(entry.title)
console.log(entry.data.content)
```

### Cache Management

```typescript
client.clearCache()

client.deleteFromCache('/collections/5/entries')
```

## Error Handling

```typescript
import {
	RushCMSError,
	RushCMSNotFoundError,
	RushCMSUnauthorizedError,
	RushCMSForbiddenError
} from '@rushcms/client'

try {
	const entry = await client.getEntry(5, 'non-existent-slug')
} catch (error) {
	if (error instanceof RushCMSNotFoundError) {
		console.log('Entry not found')
	} else if (error instanceof RushCMSUnauthorizedError) {
		console.log('Invalid API token')
	} else if (error instanceof RushCMSForbiddenError) {
		console.log('No permission')
	} else if (error instanceof RushCMSError) {
		console.log('API error:', error.message)
	}
}
```

## API Reference

### `RushCMSClient`

#### Constructor Options

```typescript
interface RushCMSClientConfig {
	baseUrl: string
	apiToken: string
	siteSlug: string
	cache?: {
		enabled: boolean
		ttl: number
	}
}
```

#### Methods

##### `getEntries(collectionId, params?)`

Fetch paginated entries from a collection.

```typescript
const response = await client.getEntries(5, {
	page: 1,
	per_page: 10,
	tags: ['tutorial'],
	tag_operator: 'any'
})
```

##### `getEntry(collectionId, slug)`

Fetch a single entry by slug.

```typescript
const entry = await client.getEntry(5, 'my-blog-post')
```

##### `clearCache()`

Clear all cached responses.

```typescript
client.clearCache()
```

##### `deleteFromCache(key)`

Delete a specific cache entry.

```typescript
client.deleteFromCache('/collections/5/entries?page=1')
```

## License

MIT
