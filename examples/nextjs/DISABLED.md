# Next.js Example - Currently Disabled

This example is temporarily disabled from the build due to incompatibility with Next.js App Router Server Components.

## Issue

The `RushCMSClient` is a class instance that cannot be directly passed from Server Components to Client Components in Next.js 13+. This causes the following error:

```
Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.
```

## Solution Required

To enable this example, we need to refactor the architecture to use one of these approaches:

1. **Context API Pattern**: Create a client-side context provider that initializes the client
2. **Serializable Config**: Pass only the configuration object and initialize the client on the client side
3. **Server Actions**: Use Next.js Server Actions for data fetching instead of client-side hooks

## Temporary Workaround

For now, use the `react-vite` example which demonstrates the same functionality without Next.js-specific constraints.

## References

- [Next.js Server and Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-and-client-components)
- [Passing Props from Server to Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-and-client-components#serialization)
