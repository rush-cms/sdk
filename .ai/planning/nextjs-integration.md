# Plan: Next.js Integration (`@rushcms/next`)

**Status**: Postponed (Future Sprint)
**Goal**: Provide first-class support for Next.js features (Image, Draft Mode, ISR).

## Objectives
1.  **Component Library**:
    -   `RushImage`: Wrapper around `next/image` that automatically handles RushCMS CDN loaders and `FeaturedImage` type.
2.  **Helpers**:
    -   `useRushDraftMode`: Simplify the implementation of Next.js Draft Mode (checking cookies/headers).
    -   `revalidateRush`: Route handler helper to securely validate webhooks from RushCMS and trigger `revalidateTag` / `revalidatePath`.
3.  **Compatibility**:
    -   Support both Pages Router and App Router (where applicable).
    -   Ensure compatibility with React 18 and React 19 (use `peerDependencies`).

## Implementation Details

### Package Structure
-   Location: `packages/next`
-   Build Tool: `tsup`
-   Exports: `index.ts` (main), `image.tsx` (subpath?), `server.ts` (server-only helpers?).

### Testing Strategy
-   Use `vitest` with `jsdom`.
-   **Challenge**: Handling React version conflicts when testing a package that depends on React in a monorepo that also has React in the root.
-   **Solution**: Configure Vitest aliases to force resolution to the root `node_modules/react`.

### Roadmap
-   [ ] Initialize package.
-   [ ] Create `RushImage` component.
-   [ ] Create `draft-mode` utilities.
-   [ ] Create `revalidate` utilities.
-   [ ] Add comprehensive tests.
