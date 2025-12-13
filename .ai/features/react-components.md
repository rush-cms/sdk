# React Components

## Overview
The `@rushcms/react` package provides a set of pre-built React components to render RushCMS content effortlessly. The star of the show is the `BlockRenderer`, which automatically maps RushCMS blocks (Rich Text, Images, Video, etc.) to React components.

## Block Renderer
The `Content` field in RushCMS is an array of blocks. Use `BlocksRenderer` to render them all.

```tsx
import { BlocksRenderer } from '@rushcms/react'

function BlogPost({ entry }) {
    return (
        <article>
            <h1>{entry.title}</h1>
            <BlocksRenderer blocks={entry.content} />
        </article>
    )
}
```

## Individual Components
You can also import specific block components if you need to build a custom renderer or use them independently.

### `ImageBlock`
Renders a responsive image with caption.

```tsx
import { ImageBlock } from '@rushcms/react'

<ImageBlock data={imageData} />
```

### `RichtextBlock`
Renders HTML content safely.

```tsx
import { RichtextBlock } from '@rushcms/react'

<RichtextBlock data={{ content: '<p>Hello World</p>' }} />
```

### `GalleryBlock`
Renders a swiper/grid gallery with lightbox support (using `photoswipe` and `swiper`).

```tsx
import { GalleryBlock } from '@rushcms/react'

<GalleryBlock data={galleryData} />
```

## Customizing Blocks
You can override default block renderers by providing a custom `renderBlock` function (planned feature) or by wrapping the components.
