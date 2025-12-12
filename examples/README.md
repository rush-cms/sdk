# RushCMS SDK Examples

This directory contains example applications demonstrating how to use the RushCMS SDK with different frameworks and tools.

## Available Examples

### Next.js (`/nextjs`)
A complete Next.js 15 App Router example showing:
- Server and Client Components
- RushCMS Provider setup
- Using hooks to fetch data
- Environment configuration

**Start the example:**
```bash
cd nextjs
pnpm install
cp .env.example .env.local
# Edit .env.local with your credentials
pnpm dev
```

### React + Vite (`/react-vite`)
A minimal React SPA example with Vite showing:
- Basic RushCMS setup
- Client-side data fetching
- React hooks usage
- Vite configuration

**Start the example:**
```bash
cd react-vite
pnpm install
cp .env.example .env.local
# Edit .env.local with your credentials
pnpm dev
```

## Common Setup

All examples require the following environment variables:

- `RUSHCMS_BASE_URL` - Your RushCMS API base URL (usually https://api.rushcms.com)
- `RUSHCMS_API_TOKEN` - Your RushCMS API token
- `RUSHCMS_SITE_SLUG` - Your site slug

Each example has a `.env.example` file showing the exact variable names for that framework.

## Learn More

- [RushCMS Documentation](https://rushcms.com/docs)
- [SDK Documentation](../README.md)
- [@rushcms/client Package](../packages/client)
- [@rushcms/react Package](../packages/react)
- [@rushcms/types Package](../packages/types)

## Note

These examples are isolated from the main monorepo linting and build processes. They serve as standalone applications for demonstration purposes.
