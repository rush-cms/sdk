# Migration Guide: v1.x → v2.0

This guide will help you migrate your Rush CMS SDK integration from v1.x to v2.0.

## Table of Contents

1. [Overview](#overview)
2. [Breaking Changes](#breaking-changes)
3. [New Features](#new-features)
4. [Step-by-Step Migration](#step-by-step-migration)
5. [Examples](#examples)

---

## Overview

Version 2.0 introduces two major features:

1. **Native i18n Support** - Built-in internationalization with locale management
2. **TipTap Content Editor Support** - Modern rich text content with better structure

Both features maintain backward compatibility where possible, but some breaking changes are necessary.

---

## Breaking Changes

### 1. API Response Changes

#### Entry Locale Responses

**Before (v1.x):**
```typescript
const entry = await client.getEntry(1, 'my-post')
// Returns entry with all locales
{
  id: 1,
  title: { en: 'Title', pt_BR: 'Título' },
  content: { en: [...], pt_BR: [...] }
}
```

**After (v2.0):**
```typescript
const entry = await client.getEntry(1, 'my-post', 'pt_BR')
// Returns only requested locale
{
  id: 1,
  title: 'Título',
  content: [...]
}
```

**Migration:** Always specify the locale you need. Use `client.getLocale()` to get the current locale.

#### Navigation Collection Reference

**Before (v1.x):**
```typescript
navigation.items[0].collection_id // number
```

**After (v2.0):**
```typescript
navigation.items[0].collection.id // number
navigation.items[0].collection.name // string
navigation.items[0].collection.slug // string
```

**Migration:** Update all references from `collection_id` to `collection.id`.

#### Categories vs Tags

**Before (v1.x):**
```typescript
entry.tags // Array<Tag> (included both tags and categories)
```

**After (v2.0):**
```typescript
entry.tags // Array<Tag> (only tags)
entry.categories // Array<Tag> (only categories)
```

**Migration:** Check if you're filtering by categories and update to use `entry.categories`.

### 2. Content Format Changes

**Before (v1.x):**
```typescript
// Only Block Editor format
content: Block[]
```

**After (v2.0):**
```typescript
// Supports both formats
content: Block[] | TipTapContent
```

**Migration:** Use `ContentRenderer` component for automatic format detection, or check format with `useContentFormat()` hook.

---

## New Features

### 1. i18n Support

#### Client Configuration

```typescript
import { RushCMSClient } from '@rushcms/client'

const client = new RushCMSClient({
  baseUrl: 'https://api.rushcms.com',
  apiToken: 'your-token',
  siteSlug: 'your-site',
  locale: {
    default: 'pt_BR',
    fallback: 'en'
  }
})

// Change locale at runtime
client.setLocale('es')
console.log(client.getLocale()) // 'es'
```

#### React Provider

```typescript
import { RushCMSProvider, LocaleProvider, LocaleSwitcher } from '@rushcms/react'

function App() {
  return (
    <RushCMSProvider client={client}>
      <LocaleProvider
        defaultLocale="pt_BR"
        availableLocales={['en', 'pt_BR', 'es']}
      >
        <LocaleSwitcher />
        <YourApp />
      </LocaleProvider>
    </RushCMSProvider>
  )
}
```

#### Using Locale in Hooks

```typescript
import { useEntry, useLocale } from '@rushcms/react'

function ArticlePage({ slug }) {
  const { locale, setLocale } = useLocale()

  // Uses context locale
  const { entry } = useEntry({ collectionId: 1, slug })

  // Override with specific locale
  const { entry: ptEntry } = useEntry({
    collectionId: 1,
    slug,
    locale: 'pt_BR'
  })

  return <div>{entry.title}</div>
}
```

### 2. TipTap Content Rendering

#### Automatic Format Detection

```typescript
import { ContentRenderer } from '@rushcms/react'

function Article({ entry }) {
  return (
    <article>
      <h1>{entry.title}</h1>
      {/* Automatically detects Block[] or TipTapContent */}
      <ContentRenderer content={entry.data.content} />
    </article>
  )
}
```

#### Explicit TipTap Rendering

```typescript
import { TipTapRenderer } from '@rushcms/react'
import type { TipTapContent } from '@rushcms/types'

function Article({ entry }) {
  return (
    <article>
      <h1>{entry.title}</h1>
      <TipTapRenderer content={entry.data.content as TipTapContent} />
    </article>
  )
}
```

#### Format Detection

```typescript
import { useContentFormat } from '@rushcms/react'

function Article({ entry }) {
  const format = useContentFormat(entry.data.content)

  return (
    <div>
      <p>Content format: {format}</p>
      {/* 'block-editor', 'content-editor', or 'unknown' */}
    </div>
  )
}
```

---

## Step-by-Step Migration

### Step 1: Update Dependencies

```bash
npm install @rushcms/types@2.0.0 @rushcms/client@2.0.0 @rushcms/react@2.0.0
```

### Step 2: Update Client Configuration

Add locale configuration to your client setup:

```typescript
const client = new RushCMSClient({
  baseUrl: process.env.RUSHCMS_API_URL,
  apiToken: process.env.RUSHCMS_API_TOKEN,
  siteSlug: process.env.RUSHCMS_SITE_SLUG,
  locale: {
    default: 'en',
    fallback: 'en'
  }
})
```

### Step 3: Wrap App with LocaleProvider

Your `RushCMSProvider` now automatically includes `LocaleProvider`, but you should configure it:

```typescript
// Before
<RushCMSProvider client={client}>
  <App />
</RushCMSProvider>

// After - RushCMSProvider now accepts locale props
<RushCMSProvider
  client={client}
  defaultLocale="pt_BR"
  availableLocales={['en', 'pt_BR', 'es']}
>
  <App />
</RushCMSProvider>
```

### Step 4: Update Navigation References

Find and replace all `collection_id` with `collection.id`:

```typescript
// Before
const collectionId = navItem.collection_id

// After
const collectionId = navItem.collection.id
const collectionName = navItem.collection.name
```

### Step 5: Update Content Rendering

Replace `BlockRenderer` with `ContentRenderer` for automatic format detection:

```typescript
// Before
import { BlockRenderer } from '@rushcms/react'
<BlockRenderer blocks={entry.data.content as Block[]} />

// After (recommended)
import { ContentRenderer } from '@rushcms/react'
<ContentRenderer content={entry.data.content} />

// Or keep BlockRenderer for Block[] only (still supported)
import { BlocksRenderer } from '@rushcms/react'
<BlocksRenderer blocks={entry.data.content as Block[]} />
```

### Step 6: Update Entry Filtering

If you filter by categories, update to use the new `categories` filter:

```typescript
// Before (v1.x)
const { entries } = useEntries({
  collectionId: 1,
  tag: 'my-category' // Categories were mixed with tags
})

// After (v2.0)
const { entries } = useEntries({
  collectionId: 1,
  category: 'my-category' // Use category parameter
})
```

### Step 7: Update Type Imports

If you use TypeScript, update imports to include new types:

```typescript
import type {
  Entry,
  Block,
  TipTapContent,
  ContentFormat,
  SupportedLocale,
  LocaleConfig
} from '@rushcms/types'
```

### Step 8: Test Your Application

1. Verify all pages load correctly
2. Test locale switching functionality
3. Verify content renders properly (both Block and TipTap formats)
4. Check navigation and collection references
5. Test category and tag filtering

---

## Examples

### Complete Migration Example

**Before (v1.x):**

```typescript
import { RushCMSProvider, useEntry, BlockRenderer } from '@rushcms/react'
import type { Block } from '@rushcms/types'

function App() {
  return (
    <RushCMSProvider client={client}>
      <ArticlePage slug="hello-world" />
    </RushCMSProvider>
  )
}

function ArticlePage({ slug }) {
  const { entry, loading } = useEntry({
    collectionId: 1,
    slug
  })

  if (loading) return <div>Loading...</div>

  return (
    <article>
      <h1>{entry.title['en']}</h1>
      <BlockRenderer blocks={entry.data.content['en'] as Block[]} />

      <div>
        Categories: {entry.tags
          .filter(t => t.type === 'category')
          .map(t => t.name)
          .join(', ')}
      </div>
    </article>
  )
}
```

**After (v2.0):**

```typescript
import {
  RushCMSProvider,
  LocaleProvider,
  LocaleSwitcher,
  useEntry,
  useLocale,
  ContentRenderer
} from '@rushcms/react'

function App() {
  return (
    <RushCMSProvider client={client}>
      <LocaleProvider
        defaultLocale="pt_BR"
        availableLocales={['en', 'pt_BR', 'es']}
      >
        <Header />
        <ArticlePage slug="hello-world" />
      </LocaleProvider>
    </RushCMSProvider>
  )
}

function Header() {
  return (
    <header>
      <LocaleSwitcher />
    </header>
  )
}

function ArticlePage({ slug }) {
  const { locale } = useLocale()
  const { entry, loading } = useEntry({
    collectionId: 1,
    slug,
    // locale is automatically used from context
  })

  if (loading) return <div>Loading...</div>

  return (
    <article>
      <h1>{entry.title}</h1>
      {/* Automatically handles both Block[] and TipTapContent */}
      <ContentRenderer content={entry.data.content} />

      <div>
        Categories: {entry.categories.map(c => c.name).join(', ')}
      </div>
      <div>
        Tags: {entry.tags.map(t => t.name).join(', ')}
      </div>
    </article>
  )
}
```

---

## Common Issues and Solutions

### Issue: "useLocale must be used within LocaleProvider"

**Solution:** Ensure all components using locale features are wrapped with `RushCMSProvider` which includes `LocaleProvider`.

### Issue: Content not rendering

**Solution:** Use `ContentRenderer` instead of `BlockRenderer` to support both content formats, or check format with `useContentFormat()`.

### Issue: Navigation items missing collection_id

**Solution:** Update references to use `collection.id` instead of `collection_id`.

### Issue: TypeScript errors with Entry.data.content

**Solution:** Update type to `Block[] | TipTapContent` or use `ContentFormat` type.

---

## Need Help?

- Check the [API Documentation](./README.md)
- Review the [CHANGELOG](./CHANGELOG.md)
- Open an issue on [GitHub](https://github.com/your-repo/rush-cms-sdk)

---

**Last Updated:** 2026-01-12
**SDK Version:** 2.0.0
