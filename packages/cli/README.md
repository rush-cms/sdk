# @rushcms/cli

The official Command Line Interface for [RushCMS](https://rushcms.com).

## Installation

```bash
pnpm add -D @rushcms/cli
# or
npm install -D @rushcms/cli
# or
yarn add -D @rushcms/cli
```

## Commands

### `codegen`

Generates TypeScript definitions for your RushCMS content schema (Custom Blocks, etc.).

```bash
npx rushcms codegen --out src/types/rushcms-env.d.ts
```

**Options:**

*   `--out <path>`: Output file path (default: `rushcms-env.d.ts`)

## Configuration

Currently, the CLI uses a mocked schema for demonstration purposes. Future versions will read from `rushcms.config.js` to fetch your live schema from the API.

## Usage with TypeScript

Once generated, include the types in your project (or let TypeScript pick them up if they are in your source root).

```typescript
import { Block } from '@rushcms/types'

// Your custom blocks are now typed!
```
