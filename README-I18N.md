# Internationalization (i18n) Guide

Rush CMS SDK v2.0 includes built-in internationalization support, making it easy to build multilingual applications.

## Table of Contents

1. [Overview](#overview)
2. [Supported Locales](#supported-locales)
3. [Client Configuration](#client-configuration)
4. [React Integration](#react-integration)
5. [API Usage](#api-usage)
6. [Best Practices](#best-practices)

---

## Overview

The i18n system provides:

- **Type-safe locales** - Full TypeScript support for all locales
- **Automatic headers** - `Accept-Language` header sent with all requests
- **Context management** - React context for global locale state
- **Override support** - Per-request locale override
- **Fallback handling** - Graceful fallback to default locale

---

## Supported Locales

Rush CMS supports the following locales:

```typescript
type SupportedLocale =
  | 'en'       // English
  | 'pt_BR'    // Portuguese (Brazil)
  | 'es'       // Spanish
  | 'fr'       // French
  | 'de'       // German
  | 'it'       // Italian
  | 'ja'       // Japanese
  | 'ko'       // Korean
  | 'zh_CN'    // Chinese (Simplified)
  | 'zh_TW'    // Chinese (Traditional)
```

### Locale Names

The SDK provides a constant with human-readable locale names:

```typescript
import { LOCALE_NAMES } from '@rushcms/types'

console.log(LOCALE_NAMES['pt_BR']) // "Português (Brasil)"
console.log(LOCALE_NAMES['en'])    // "English"
```

---

## Client Configuration

### Basic Setup

```typescript
import { RushCMSClient } from '@rushcms/client'

const client = new RushCMSClient({
  baseUrl: 'https://api.rushcms.com',
  apiToken: 'your-api-token',
  siteSlug: 'your-site',
  locale: {
    default: 'pt_BR',  // Default locale for all requests
    fallback: 'en'     // Fallback if default is unavailable
  }
})
```

### Dynamic Locale Changes

```typescript
// Get current locale
const currentLocale = client.getLocale()
console.log(currentLocale) // 'pt_BR'

// Change locale
client.setLocale('es')
console.log(client.getLocale()) // 'es'

// All subsequent requests will use the new locale
const entries = await client.getEntries(1) // Uses 'es'
```

### Default Behavior

If no locale configuration is provided, the client defaults to English:

```typescript
const client = new RushCMSClient({
  baseUrl: 'https://api.rushcms.com',
  apiToken: 'your-api-token',
  siteSlug: 'your-site'
  // No locale config - defaults to 'en'
})

console.log(client.getLocale()) // 'en'
```

---

## React Integration

### Provider Setup

The `RushCMSProvider` now automatically includes `LocaleProvider`:

```typescript
import { RushCMSProvider } from '@rushcms/react'

function App() {
  return (
    <RushCMSProvider
      client={client}
      defaultLocale="pt_BR"
      availableLocales={['en', 'pt_BR', 'es']}
    >
      <YourApp />
    </RushCMSProvider>
  )
}
```

### Using the Locale Hook

```typescript
import { useLocale } from '@rushcms/react'

function LanguageSwitcher() {
  const { locale, setLocale, availableLocales } = useLocale()

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as SupportedLocale)}
    >
      {availableLocales.map(loc => (
        <option key={loc} value={loc}>
          {LOCALE_NAMES[loc]}
        </option>
      ))}
    </select>
  )
}
```

### Built-in Locale Switcher

The SDK includes a pre-built locale switcher component:

```typescript
import { LocaleSwitcher } from '@rushcms/react'

function Header() {
  return (
    <header>
      <nav>
        <Logo />
        <Menu />
        <LocaleSwitcher />
      </nav>
    </header>
  )
}
```

### Locale in Data Hooks

All data hooks automatically use the current locale from context:

```typescript
import { useEntry, useLocale } from '@rushcms/react'

function Article({ slug }) {
  const { locale } = useLocale()

  // Automatically uses current locale
  const { entry } = useEntry({
    collectionId: 1,
    slug
  })

  return (
    <div>
      <p>Current locale: {locale}</p>
      <h1>{entry.title}</h1>
    </div>
  )
}
```

### Locale Override

You can override the context locale for specific requests:

```typescript
import { useEntry } from '@rushcms/react'

function BilingualArticle({ slug }) {
  // Uses context locale (e.g., 'pt_BR')
  const { entry: ptEntry } = useEntry({
    collectionId: 1,
    slug
  })

  // Override to get English version
  const { entry: enEntry } = useEntry({
    collectionId: 1,
    slug,
    locale: 'en'
  })

  return (
    <div>
      <div>
        <h2>Portuguese</h2>
        <p>{ptEntry.title}</p>
      </div>
      <div>
        <h2>English</h2>
        <p>{enEntry.title}</p>
      </div>
    </div>
  )
}
```

---

## API Usage

### Fetching Entries

```typescript
// Uses current locale
const entries = await client.getEntries(1)

// Override with specific locale
const entriesPT = await client.getEntries(1, { locale: 'pt_BR' })
const entriesES = await client.getEntries(1, { locale: 'es' })
```

### Fetching Single Entry

```typescript
// Uses current locale
const entry = await client.getEntry(1, 'my-post')

// Override with specific locale
const entryPT = await client.getEntry(1, 'my-post', 'pt_BR')
```

### Navigation

```typescript
// Uses current locale
const navigation = await client.getNavigation('main-menu')

// Override with specific locale
const navPT = await client.getNavigation('main-menu', 'pt_BR')
```

### Homepage

```typescript
// Uses current locale
const homepage = await client.getHomepage()

// Override with specific locale
const homepagePT = await client.getHomepage('pt_BR')
```

### Link Pages

```typescript
// Uses current locale
const linkPage = await client.getLinkPage('about')

// Override with specific locale
const linkPagePT = await client.getLinkPage('about', 'pt_BR')
```

### Collections

```typescript
// Get all collections (locale-aware)
const collections = await client.getCollections('pt_BR')
```

---

## Best Practices

### 1. Set Locale Early

Set the locale as early as possible in your application lifecycle:

```typescript
// ✅ Good - Set at app initialization
const client = new RushCMSClient({
  // ...
  locale: {
    default: getUserPreferredLocale(), // From user settings or browser
    fallback: 'en'
  }
})

// ❌ Avoid - Setting locale on every request
```

### 2. Use Context for Global State

Leverage React context for global locale management:

```typescript
// ✅ Good - Use context
function MyComponent() {
  const { locale, setLocale } = useLocale()
  // All hooks use this locale automatically
}

// ❌ Avoid - Passing locale manually everywhere
function MyComponent() {
  const [locale, setLocale] = useState('en')
  // Have to pass locale to every hook
}
```

### 3. Provide Locale Switcher

Always provide an easy way for users to change locale:

```typescript
// ✅ Good - Visible locale switcher
<Header>
  <Logo />
  <Navigation />
  <LocaleSwitcher />
</Header>

// ❌ Avoid - Hidden or hard-to-find locale settings
```

### 4. Handle Missing Translations

Always have a fallback strategy:

```typescript
const client = new RushCMSClient({
  // ...
  locale: {
    default: 'pt_BR',
    fallback: 'en' // Always provide fallback
  }
})
```

### 5. Persist User Preference

Save user's locale preference:

```typescript
import { useLocale } from '@rushcms/react'
import { useEffect } from 'react'

function App() {
  const { locale, setLocale } = useLocale()

  // Load saved preference on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('preferredLocale')
    if (savedLocale) {
      setLocale(savedLocale as SupportedLocale)
    }
  }, [])

  // Save preference when changed
  useEffect(() => {
    localStorage.setItem('preferredLocale', locale)
  }, [locale])

  return <YourApp />
}
```

### 6. URL-based Locale

You can sync locale with URL for better SEO:

```typescript
import { useLocale } from '@rushcms/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

function LocaleSync() {
  const router = useRouter()
  const { setLocale } = useLocale()

  useEffect(() => {
    const urlLocale = router.query.locale as SupportedLocale
    if (urlLocale) {
      setLocale(urlLocale)
    }
  }, [router.query.locale])

  return null
}

// Usage
function App() {
  return (
    <RushCMSProvider client={client}>
      <LocaleSync />
      <YourApp />
    </RushCMSProvider>
  )
}
```

---

## Complete Example

### Next.js Application

```typescript
// pages/_app.tsx
import { RushCMSProvider, LocaleProvider } from '@rushcms/react'
import { RushCMSClient } from '@rushcms/client'
import type { AppProps } from 'next/app'

const client = new RushCMSClient({
  baseUrl: process.env.NEXT_PUBLIC_RUSHCMS_API_URL!,
  apiToken: process.env.NEXT_PUBLIC_RUSHCMS_API_TOKEN!,
  siteSlug: process.env.NEXT_PUBLIC_RUSHCMS_SITE_SLUG!,
  locale: {
    default: 'pt_BR',
    fallback: 'en'
  }
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RushCMSProvider
      client={client}
      defaultLocale="pt_BR"
      availableLocales={['en', 'pt_BR', 'es']}
    >
      <Component {...pageProps} />
    </RushCMSProvider>
  )
}
```

```typescript
// components/Layout.tsx
import { LocaleSwitcher } from '@rushcms/react'

export function Layout({ children }) {
  return (
    <div>
      <header>
        <nav>
          <Logo />
          <Menu />
          <LocaleSwitcher />
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}
```

```typescript
// pages/blog/[slug].tsx
import { useEntry, useLocale } from '@rushcms/react'
import { ContentRenderer } from '@rushcms/react'
import { Layout } from '@/components/Layout'
import { useRouter } from 'next/router'

export default function BlogPost() {
  const router = useRouter()
  const { locale } = useLocale()
  const { slug } = router.query

  const { entry, loading, error } = useEntry({
    collectionId: 1,
    slug: slug as string
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!entry) return <div>Not found</div>

  return (
    <Layout>
      <article>
        <header>
          <h1>{entry.title}</h1>
          <p className="text-gray-600">{entry.excerpt}</p>
          <div className="text-sm text-gray-500">
            Language: {locale}
          </div>
        </header>
        <ContentRenderer content={entry.data.content} />
      </article>
    </Layout>
  )
}
```

---

## Troubleshooting

### Issue: Locale not changing

**Solution:** Ensure you're using `setLocale` from the `useLocale` hook, not managing locale state separately.

### Issue: Wrong locale in API requests

**Solution:** Check that `LocaleProvider` is wrapping all components that use locale features.

### Issue: Types errors with locale

**Solution:** Import `SupportedLocale` type:
```typescript
import type { SupportedLocale } from '@rushcms/types'
```

---

## Resources

- [Migration Guide](./MIGRATION-GUIDE.md)
- [API Reference](./README.md)
- [Changelog](./CHANGELOG.md)

---

**Last Updated:** 2026-01-12
**SDK Version:** 2.0.0
