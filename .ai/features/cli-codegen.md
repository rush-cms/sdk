# CLI Codegen

## Overview
The RushCMS CLI (`@rushcms/cli`) provides developer tooling to improve type safety. The `codegen` command connects to the RushCMS API, fetches the content schema (Custom Blocks, Collections), and generates TypeScript definitions.

## How it works
1.  The CLI allows running `rushcms codegen`.
2.  It (will) read a configuration file `rushcms.config.js` to get the API URL and Token.
3.  It fetches the schema metadata from the API.
4.  It generates a `.d.ts` file that uses TypeScript **Module Augmentation** to extend the base types provided by `@rushcms/types`.

This allows you to have typed `CustomBlocks` in your project.

## Usage

### 1. Install
```bash
pnpm add -D @rushcms/cli
```

### 2. Run
```bash
npx rushcms codegen --out src/types/rushcms-env.d.ts
```

### 3. Consume Types
The generated file enables TypeScript to understand your specific schema:

```typescript
import { Block } from '@rushcms/types'

// Your custom blocks are now typed!
const myBlock: Block = {
    type: 'custom_hero', // TypeScript knows this exists
    data: {
        title: 'Hello', // TypeScript knows this is a string
        image: { ... }  // TypeScript knows this is a FeaturedImage
    }
}
```
