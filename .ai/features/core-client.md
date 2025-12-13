# Core Client

## Overview
The `@rushcms/client` package is the foundation of the SDK. It provides a type-safe TypeScript client to interact with the RushCMS API. It handles authentication, URL building, and response typing.

## Installation
```bash
pnpm add @rushcms/client
```

## Setup
Initialize the client with your API token and site slug.

```typescript
import { RushCMSClient } from '@rushcms/client'

const client = new RushCMSClient({
    baseUrl: 'https://api.rushcms.com',
    apiToken: 'YOUR_API_TOKEN',
    siteSlug: 'your-site-slug',
    cache: {
        enabled: true,
        ttl: 3600 // 1 hour
    }
})
```

## Methods

### `getEntries(collectionId, params)`
Fetches a paginated list of entries from a collection.

```typescript
const { data, meta } = await client.getEntries(1, {
    page: 1,
    per_page: 10,
    tags: ['news'],
    tag_operator: 'AND'
})
```

### `getEntry(collectionId, slug)`
Fetches a single entry by its slug.

```typescript
const entry = await client.getEntry(1, 'my-first-post')
console.log(entry.title)
```

### `getHomepage()`
Fetches the homepage data configured in the CMS settings.

```typescript
const homepage = await client.getHomepage()
```

### `getNavigations()` & `getNavigation(key)`
Fetches navigation menus.

```typescript
const menus = await client.getNavigations()
const footer = await client.getNavigation('footer_menu')
```
