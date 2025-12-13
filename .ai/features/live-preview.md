# Live Preview

## Overview
The Live Preview system allows content editors to see changes in real-time on the frontend before publishing. It works by establishing a communication channel between the RushCMS Admin (iframe parent) and the frontend application (iframe child).

## How it works
1.  **Listeners**: The `@rushcms/react` package sets up a `window.addEventListener('message')` listener.
2.  **Events**: It listens for events of type `rushcms:preview`.
3.  **State Management**: When a preview event is received (containing updated entry data), the SDK stores this in a React Context (`RushCMSContext`).
4.  **Hooks Integration**: The `useEntry` and `useEntries` hooks automatically check this context. If they find preview data matching the requested ID, they return the preview data instead of the API data.

## Usage

### 1. Setup Provider
Ensure your app is wrapped in `RushCMSProvider`. This handles the context and listeners.

```tsx
// layout.tsx or App.tsx
import { RushCMSProvider } from '@rushcms/react'

function App() {
    return (
        <RushCMSProvider client={client}>
            <YourContent />
        </RushCMSProvider>
    )
}
```

### 2. Use Standard Hooks
You don't need to do anything special in your components. Just use the hooks as normal.

```tsx
import { useEntry } from '@rushcms/react'

function BlogPost({ id }) {
    // If preview is active, 'entry' will update in real-time as the user types in the CMS
    const { entry } = useEntry({ collectionId: 1, slug: 'my-post' })
    
    return <h1>{entry?.title}</h1>
}
```

### 3. Custom Usage
If you need raw access to the preview stream:

```tsx
import { useLivePreview } from '@rushcms/react'

function DebugPreview() {
    const previewData = useLivePreview()
    return <pre>{JSON.stringify(previewData, null, 2)}</pre>
}
```
