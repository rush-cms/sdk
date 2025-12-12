# RushCMS Next.js Example

This is a minimal example demonstrating how to use the RushCMS SDK with Next.js 15 App Router.

## Getting Started

1. Install dependencies:

\`\`\`bash
pnpm install
\`\`\`

2. Create a \`.env.local\` file based on \`.env.example\`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

3. Update the environment variables with your RushCMS credentials:

\`\`\`
NEXT_PUBLIC_RUSHCMS_BASE_URL=https://api.rushcms.com
NEXT_PUBLIC_RUSHCMS_API_TOKEN=your_api_token
NEXT_PUBLIC_RUSHCMS_SITE_SLUG=your_site_slug
\`\`\`

4. Run the development server:

\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Features Demonstrated

- RushCMS Client setup
- Fetching entries from a collection
- Using React hooks (\`useEntries\`, \`useEntry\`)
- Rendering blocks with BlockRenderer
- Server and Client Components

## Learn More

- [RushCMS Documentation](https://rushcms.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
