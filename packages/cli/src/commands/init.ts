import fs from 'node:fs/promises'
import path from 'node:path'
import { createInterface } from 'node:readline/promises'
import { execSync } from 'node:child_process'
import pc from 'picocolors'

interface InitOptions {
	name?: string
}

async function prompt(rl: ReturnType<typeof createInterface>, question: string, defaultValue?: string): Promise<string> {
	const suffix = defaultValue ? ` ${pc.gray(`(${defaultValue})`)}` : ''
	const answer = await rl.question(`${question}${suffix}: `)
	return answer.trim() || defaultValue || ''
}

const TEMPLATE_PACKAGE_JSON = `{
\t"name": "{{name}}",
\t"type": "module",
\t"version": "0.1.0",
\t"scripts": {
\t\t"dev": "astro dev",
\t\t"build": "astro build",
\t\t"preview": "astro preview"
\t},
\t"dependencies": {
\t\t"@astrojs/node": "^10.0.3",
\t\t"@rushcms/astro": "^1.0.0",
\t\t"@rushcms/client": "^2.0.0",
\t\t"@rushcms/types": "^2.0.0",
\t\t"@tailwindcss/vite": "^4.2.2",
\t\t"astro": "^6.0.8",
\t\t"photoswipe": "^5.4.4",
\t\t"tailwindcss": "^4.2.2"
\t},
\t"devDependencies": {
\t\t"typescript": "^5.7.3"
\t}
}`

const TEMPLATE_ASTRO_CONFIG = `import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import node from '@astrojs/node'

export default defineConfig({
\toutput: 'server',
\tadapter: node({
\t\tmode: 'standalone'
\t}),
\tvite: {
\t\tplugins: [tailwindcss()]
\t}
})`

const TEMPLATE_TSCONFIG = `{
\t"extends": "astro/tsconfigs/strict",
\t"include": [".astro/types.d.ts", "**/*"],
\t"exclude": ["dist"],
\t"compilerOptions": {
\t\t"baseUrl": ".",
\t\t"paths": {
\t\t\t"@/*": ["src/*"]
\t\t}
\t}
}`

const TEMPLATE_RUSH_TS = `import { RushCMSClient } from '@rushcms/client'

export const rush = new RushCMSClient({
\tbaseUrl: import.meta.env.RUSH_API_URL,
\tapiToken: import.meta.env.RUSH_API_TOKEN,
\tsiteSlug: import.meta.env.RUSH_SITE_SLUG,
\tcache: {
\t\tenabled: true,
\t\tfreshTtl: 60,
\t\tstaleTtl: 300
\t}
})`

const TEMPLATE_INDEX_PAGE = `---
import { rush } from '@/lib/rush'

let collections: any[] = []
try {
\tconst response = await rush.getCollections()
\tcollections = response.data || []
} catch (error) {
\tconsole.error('Failed to fetch collections:', error)
}
---

<html lang="pt-BR">
\t<head>
\t\t<meta charset="utf-8" />
\t\t<meta name="viewport" content="width=device-width, initial-scale=1" />
\t\t<title>{import.meta.env.RUSH_SITE_SLUG}</title>
\t</head>
\t<body class="min-h-screen bg-gray-50 p-8">
\t\t<h1 class="text-3xl font-bold mb-8">{import.meta.env.RUSH_SITE_SLUG}</h1>
\t\t<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
\t\t\t{collections.map((col) => (
\t\t\t\t<a href={\`/\${col.slug}\`} class="block bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow">
\t\t\t\t\t<h2 class="text-xl font-semibold">{col.name}</h2>
\t\t\t\t</a>
\t\t\t))}
\t\t</div>
\t</body>
</html>`

const TEMPLATE_GLOBAL_CSS = `@import "tailwindcss";`

const TEMPLATE_GITIGNORE = `node_modules/
dist/
.astro/
.env
.env.production`

export async function init(options: InitOptions) {
	console.log(pc.cyan('\nRushCMS Init'))
	console.log(pc.gray('Create a new Rush CMS project with Astro\n'))

	const rl = createInterface({ input: process.stdin, output: process.stdout })

	try {
		const projectName = options.name || await prompt(rl, 'Project name', 'my-rushcms-site')
		const apiUrl = await prompt(rl, 'Rush CMS API URL', 'https://app.rushcms.com/api/v1')
		const apiToken = await prompt(rl, 'API Token')
		const siteSlug = await prompt(rl, 'Site slug')

		if (!apiToken) {
			console.log(pc.red('\nAPI token is required.'))
			return
		}
		if (!siteSlug) {
			console.log(pc.red('\nSite slug is required.'))
			return
		}

		const projectDir = path.resolve(process.cwd(), projectName)

		console.log(pc.gray(`\nCreating project at ${projectDir}...`))

		await fs.mkdir(path.join(projectDir, 'src', 'lib'), { recursive: true })
		await fs.mkdir(path.join(projectDir, 'src', 'pages'), { recursive: true })
		await fs.mkdir(path.join(projectDir, 'src', 'styles'), { recursive: true })
		await fs.mkdir(path.join(projectDir, 'public'), { recursive: true })

		await fs.writeFile(
			path.join(projectDir, 'package.json'),
			TEMPLATE_PACKAGE_JSON.replace('{{name}}', projectName)
		)
		await fs.writeFile(path.join(projectDir, 'astro.config.ts'), TEMPLATE_ASTRO_CONFIG)
		await fs.writeFile(path.join(projectDir, 'tsconfig.json'), TEMPLATE_TSCONFIG)
		await fs.writeFile(path.join(projectDir, '.gitignore'), TEMPLATE_GITIGNORE)
		await fs.writeFile(path.join(projectDir, 'src', 'lib', 'rush.ts'), TEMPLATE_RUSH_TS)
		await fs.writeFile(path.join(projectDir, 'src', 'pages', 'index.astro'), TEMPLATE_INDEX_PAGE)
		await fs.writeFile(path.join(projectDir, 'src', 'styles', 'global.css'), TEMPLATE_GLOBAL_CSS)

		const envContent = [
			`RUSH_API_URL=${apiUrl}`,
			`RUSH_API_TOKEN=${apiToken}`,
			`RUSH_SITE_SLUG=${siteSlug}`
		].join('\n')

		await fs.writeFile(path.join(projectDir, '.env'), envContent)
		await fs.writeFile(path.join(projectDir, '.env.example'), envContent.replace(apiToken, 'your-api-token-here'))

		console.log(pc.gray('Installing dependencies with bun...'))

		try {
			execSync('bun install', { cwd: projectDir, stdio: 'inherit' })
		} catch {
			console.log(pc.yellow('bun not found, trying pnpm...'))
			try {
				execSync('pnpm install', { cwd: projectDir, stdio: 'inherit' })
			} catch {
				console.log(pc.yellow('Run "npm install" manually in the project directory.'))
			}
		}

		console.log(pc.green(`\n\u2714 Project created at ${projectName}/`))
		console.log(pc.gray('\nNext steps:'))
		console.log(pc.white(`  cd ${projectName}`))
		console.log(pc.white('  bun run dev'))
		console.log()
	} finally {
		rl.close()
	}
}
