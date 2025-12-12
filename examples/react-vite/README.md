# RushCMS React + Vite Example

This is a minimal example demonstrating how to use the RushCMS SDK with React and Vite.

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
VITE_RUSHCMS_BASE_URL=https://api.rushcms.com
VITE_RUSHCMS_API_TOKEN=your_api_token
VITE_RUSHCMS_SITE_SLUG=your_site_slug
\`\`\`

4. Run the development server:

\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:5173](http://localhost:5173) to see the result.

## Features Demonstrated

- RushCMS Client setup
- Fetching entries from a collection
- Using React hooks (\`useEntries\`, \`useEntry\`)
- Rendering blocks with BlockRenderer
- Vite configuration

## Learn More

- [RushCMS Documentation](https://rushcms.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
