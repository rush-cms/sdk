#!/usr/bin/env node
import { cac } from 'cac'
import { version } from '../package.json'
import { codegen } from './commands/codegen'
import { init } from './commands/init'

const cli = cac('rushcms')

cli
	.command('init [name]', 'Create a new Rush CMS project with Astro')
	.action(async (name) => {
		try {
			await init({ name })
		} catch (error) {
			console.error('Error initializing project:', error)
			process.exit(1)
		}
	})

cli
	.command('codegen', 'Generate TypeScript types from RushCMS collection schemas')
	.option('--out <path>', 'Output file path', {
		default: 'rushcms-env.d.ts'
	})
	.action(async (options) => {
		try {
			await codegen(options)
		} catch (error) {
			console.error('Error generating types:', error)
			process.exit(1)
		}
	})

cli.help()
cli.version(version)
cli.parse()
