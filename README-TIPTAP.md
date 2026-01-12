# TipTap Content Editor Integration

Rush CMS SDK v2.0 includes full support for TipTap-based content, providing a modern, structured approach to rich text content.

## Table of Contents

1. [Overview](#overview)
2. [Content Structure](#content-structure)
3. [Rendering Content](#rendering-content)
4. [Supported Nodes](#supported-nodes)
5. [Custom Blocks](#custom-blocks)
6. [Styling](#styling)

---

## Overview

TipTap is a headless editor framework that provides structured, semantic content. Unlike traditional HTML-based editors, TipTap stores content as JSON, making it:

- **Type-safe** - Full TypeScript support
- **Structured** - Predictable, queryable content
- **Extensible** - Easy to add custom blocks
- **Portable** - Content works across platforms

---

## Content Structure

### TipTap Format

TipTap content is a JSON object with a predictable structure:

```typescript
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [
        { "type": "text", "text": "Hello World" }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "This is " },
        {
          "type": "text",
          "text": "bold text",
          "marks": [{ "type": "bold" }]
        }
      ]
    }
  ]
}
```

### Type Definitions

```typescript
import type {
  TipTapContent,
  TipTapNode,
  TipTapMark
} from '@rushcms/types'

// Root document
interface TipTapContent {
  type: 'doc'
  content: TipTapNode[]
}

// Individual nodes (paragraphs, headings, etc.)
type TipTapNode =
  | TipTapTextNode
  | TipTapParagraphNode
  | TipTapHeadingNode
  | TipTapBulletListNode
  | TipTapOrderedListNode
  // ... and more

// Inline formatting (bold, italic, etc.)
interface TipTapMark {
  type: 'bold' | 'italic' | 'underline' | 'strike' | 'code' | 'link' | 'highlight'
  attrs?: {
    href?: string
    color?: string
    // ... other attributes
  }
}
```

---

## Rendering Content

### Automatic Format Detection (Recommended)

The `ContentRenderer` component automatically detects whether content is in Block Editor or TipTap format:

```typescript
import { ContentRenderer } from '@rushcms/react'
import type { Entry } from '@rushcms/types'

function Article({ entry }: { entry: Entry }) {
  return (
    <article>
      <h1>{entry.title}</h1>
      {/* Automatically handles both formats */}
      <ContentRenderer
        content={entry.data.content}
        className="prose prose-lg"
      />
    </article>
  )
}
```

### Explicit TipTap Rendering

If you know the content is TipTap format:

```typescript
import { TipTapRenderer } from '@rushcms/react'
import type { TipTapContent } from '@rushcms/types'

function Article({ content }: { content: TipTapContent }) {
  return (
    <TipTapRenderer
      content={content}
      className="prose prose-lg"
    />
  )
}
```

### Format Detection Hook

To detect the format programmatically:

```typescript
import { useContentFormat } from '@rushcms/react'

function Article({ entry }) {
  const format = useContentFormat(entry.data.content)

  return (
    <div>
      <p>Content format: {format}</p>
      {/* Returns: 'block-editor' | 'content-editor' | 'unknown' */}
    </div>
  )
}
```

---

## Supported Nodes

### Text Nodes

Basic text with inline formatting:

```typescript
{
  "type": "text",
  "text": "Hello World",
  "marks": [
    { "type": "bold" },
    { "type": "italic" }
  ]
}
```

**Renders as:**
```html
<strong><em>Hello World</em></strong>
```

### Paragraphs

```typescript
{
  "type": "paragraph",
  "attrs": { "textAlign": "center" },
  "content": [
    { "type": "text", "text": "Centered text" }
  ]
}
```

**Renders as:**
```html
<p style="text-align: center">Centered text</p>
```

### Headings

```typescript
{
  "type": "heading",
  "attrs": { "level": 2, "textAlign": "left" },
  "content": [
    { "type": "text", "text": "Section Title" }
  ]
}
```

**Renders as:**
```html
<h2 style="text-align: left">Section Title</h2>
```

### Lists

#### Bullet Lists

```typescript
{
  "type": "bulletList",
  "content": [
    {
      "type": "listItem",
      "content": [
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "Item 1" }]
        }
      ]
    }
  ]
}
```

**Renders as:**
```html
<ul>
  <li><p>Item 1</p></li>
</ul>
```

#### Ordered Lists

```typescript
{
  "type": "orderedList",
  "attrs": { "start": 1 },
  "content": [
    {
      "type": "listItem",
      "content": [
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "First" }]
        }
      ]
    }
  ]
}
```

**Renders as:**
```html
<ol start="1">
  <li><p>First</p></li>
</ol>
```

### Code Blocks

```typescript
{
  "type": "codeBlock",
  "attrs": { "language": "javascript" },
  "content": [
    { "type": "text", "text": "const x = 42;" }
  ]
}
```

**Renders as:**
```html
<pre>
  <code class="language-javascript">const x = 42;</code>
</pre>
```

### Blockquotes

```typescript
{
  "type": "blockquote",
  "content": [
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "Quoted text" }]
    }
  ]
}
```

**Renders as:**
```html
<blockquote>
  <p>Quoted text</p>
</blockquote>
```

### Tables

```typescript
{
  "type": "table",
  "content": [
    {
      "type": "tableRow",
      "content": [
        {
          "type": "tableHeader",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Header" }]
            }
          ]
        }
      ]
    },
    {
      "type": "tableRow",
      "content": [
        {
          "type": "tableCell",
          "attrs": { "colspan": 2 },
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Cell" }]
            }
          ]
        }
      ]
    }
  ]
}
```

**Renders as:**
```html
<table>
  <tbody>
    <tr>
      <th><p>Header</p></th>
    </tr>
    <tr>
      <td colspan="2"><p>Cell</p></td>
    </tr>
  </tbody>
</table>
```

### Special Nodes

#### Horizontal Rule

```typescript
{ "type": "horizontalRule" }
```

**Renders as:**
```html
<hr />
```

#### Hard Break

```typescript
{ "type": "hardBreak" }
```

**Renders as:**
```html
<br />
```

---

## Custom Blocks

Rush CMS supports custom blocks for rich media content.

### YouTube Embed

```typescript
{
  "type": "customBlock",
  "attrs": {
    "type": "youtube",
    "data": {
      "url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
      "width": 560,
      "height": 315,
      "autoplay": false
    }
  }
}
```

**Renders as:**
```tsx
<figure className="w-full max-w-4xl mx-auto">
  <div className="relative overflow-hidden rounded-lg">
    <iframe
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="YouTube video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 w-full h-full"
    />
  </div>
</figure>
```

### Gallery

```typescript
{
  "type": "customBlock",
  "attrs": {
    "type": "gallery",
    "data": {
      "images": [
        {
          "url": "https://example.com/image1.jpg",
          "alt": "Image 1",
          "width": 800,
          "height": 600
        }
      ],
      "layout": "grid",
      "columns": 3
    }
  }
}
```

**Uses the existing `GalleryBlock` component** with lightbox support and multiple layout options.

### Generic Custom Blocks

Any custom block not specifically handled will be rendered as a debug view:

```typescript
{
  "type": "customBlock",
  "attrs": {
    "type": "custom_cta",
    "data": {
      "title": "Sign Up Now",
      "url": "/signup"
    }
  }
}
```

**Default rendering:**
```html
<div class="custom-block" data-type="custom_cta">
  <pre>{JSON.stringify(data, null, 2)}</pre>
</div>
```

**To handle custom blocks**, extend the `TipTapNodeRenderer` component.

---

## Styling

### Using Tailwind Typography

The recommended approach is to use Tailwind's typography plugin:

```typescript
import { ContentRenderer } from '@rushcms/react'

function Article({ entry }) {
  return (
    <ContentRenderer
      content={entry.data.content}
      className="prose prose-lg prose-slate dark:prose-invert max-w-none"
    />
  )
}
```

### Custom Styles

You can apply custom CSS to the rendered content:

```css
/* Global styles */
.tiptap-content h1 {
  @apply text-4xl font-bold mb-4;
}

.tiptap-content p {
  @apply text-base leading-relaxed mb-4;
}

.tiptap-content ul {
  @apply list-disc pl-6 mb-4;
}

.tiptap-content code {
  @apply bg-gray-100 px-2 py-1 rounded font-mono text-sm;
}
```

### Component-Level Styling

You can also wrap the renderer and apply styles:

```typescript
function StyledContent({ content }) {
  return (
    <div className="tiptap-content">
      <style jsx>{`
        .tiptap-content h1 {
          font-size: 2.5rem;
          font-weight: bold;
        }
        .tiptap-content p {
          line-height: 1.75;
        }
      `}</style>
      <ContentRenderer content={content} />
    </div>
  )
}
```

---

## Complete Example

```typescript
import {
  RushCMSProvider,
  LocaleProvider,
  useEntry,
  ContentRenderer,
  useContentFormat
} from '@rushcms/react'
import type { Entry, TipTapContent } from '@rushcms/types'

function App() {
  return (
    <RushCMSProvider client={client}>
      <LocaleProvider defaultLocale="en" availableLocales={['en', 'pt_BR']}>
        <ArticlePage slug="hello-world" />
      </LocaleProvider>
    </RushCMSProvider>
  )
}

function ArticlePage({ slug }: { slug: string }) {
  const { entry, loading, error } = useEntry({
    collectionId: 1,
    slug
  })

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorMessage error={error} />
  if (!entry) return <NotFound />

  return <Article entry={entry} />
}

function Article({ entry }: { entry: Entry }) {
  const format = useContentFormat(entry.data.content)

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{entry.title}</h1>
        <p className="text-gray-600">{entry.excerpt}</p>
        <div className="text-sm text-gray-500 mt-2">
          Format: {format}
        </div>
      </header>

      <div className="prose prose-lg prose-slate max-w-none">
        <ContentRenderer content={entry.data.content} />
      </div>

      {entry.categories.length > 0 && (
        <footer className="mt-8 pt-4 border-t">
          <div className="flex gap-2">
            {entry.categories.map(category => (
              <span
                key={category.id}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {category.name}
              </span>
            ))}
          </div>
        </footer>
      )}
    </article>
  )
}
```

---

## Best Practices

1. **Always use `ContentRenderer`** for automatic format detection unless you're certain about the format
2. **Apply semantic styling** using Tailwind Typography or similar
3. **Handle loading and error states** properly
4. **Use TypeScript types** for better development experience
5. **Test with both formats** (Block and TipTap) to ensure compatibility

---

## Resources

- [TipTap Documentation](https://tiptap.dev)
- [Rush CMS API Reference](./README.md)
- [Migration Guide](./MIGRATION-GUIDE.md)
- [Changelog](./CHANGELOG.md)

---

**Last Updated:** 2026-01-12
**SDK Version:** 2.0.0
