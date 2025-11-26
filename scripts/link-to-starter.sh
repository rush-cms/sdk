#!/bin/bash

set -e

echo '🔧 RushCMS SDK - Linking to Next.js Starter'
echo ''

STARTER_PATH='/home/rafhael/www/html/rush-cms/starters/nextjs'

if [ ! -d "$STARTER_PATH" ]; then
	echo '❌ Next.js starter not found at $STARTER_PATH'
	exit 1
fi

echo '📦 Step 1: Building SDK packages...'
pnpm build

echo ''
echo '🔗 Step 2: Linking packages to starter...'

cd "$STARTER_PATH"

if [ ! -f "package.json" ]; then
	echo '❌ package.json not found in starter'
	exit 1
fi

echo 'Adding SDK packages to package.json...'

node -e "
const fs = require('fs')
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))

pkg.dependencies = pkg.dependencies || {}
pkg.dependencies['@rushcms/client'] = 'file:../../sdk/packages/client'
pkg.dependencies['@rushcms/react'] = 'file:../../sdk/packages/react'
pkg.dependencies['@rushcms/types'] = 'file:../../sdk/packages/types'

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2))
console.log('✅ SDK packages added to package.json')
"

echo ''
echo '📥 Step 3: Installing dependencies...'
pnpm install

echo ''
echo '✅ Done! SDK is now linked to the Next.js starter.'
echo ''
echo '📝 Next steps:'
echo '  1. Import the SDK in your code: import { RushCMSClient } from "@rushcms/client"'
echo '  2. Check TESTING_GUIDE.md for usage examples'
echo '  3. Run: pnpm dev'
echo ''
