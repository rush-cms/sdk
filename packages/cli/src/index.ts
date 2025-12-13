#!/usr/bin/env node
import { cac } from 'cac'
import { version } from '../package.json'
import { codegen } from './commands/codegen'

const cli = cac('rushcms')

cli
    .command('codegen', 'Generate TypeScript types from RushCMS schema')
    .option('--out <path>', 'Output file path', {
        default: 'rushcms-env.d.ts',
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
