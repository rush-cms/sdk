# React Hooks

## Overview
The `@rushcms/react` package exports data fetching hooks that make integrating RushCMS into your React application simple. These hooks use the `RushCMSContext` to access the client instance.

## core Hooks

### `useEntry({ collectionId, slug })`
Fetches a single entry. Automatically handles loading and error states.
**Lives Preview Ready**: If Live Preview is active, this hook will automatically update with real-time data.

```tsx
const { entry, loading, error } = useEntry({ 
    collectionId: 1, 
    slug: 'hello-world' 
})

if (loading) return <Spinner />
```

### `useEntries({ collectionId, params })`
Fetches a list of entries.

```tsx
const { entries, pagination, fetchMore } = useEntries({ 
    collectionId: 1,
    params: { per_page: 5 }
})
```

### `useNavigation(key)`
Fetches a specific menu.

```tsx
const { navigation } = useNavigation('main_menu')

return (
    <nav>
        {navigation?.items.map(item => (
            <a href={item.url}>{item.label}</a>
        ))}
    </nav>
)
```

## Provider
NOTE: You must wrap your application in the `RushCMSProvider` for these hooks to work.

```tsx
<RushCMSProvider client={client}>
    <App />
</RushCMSProvider>
```
