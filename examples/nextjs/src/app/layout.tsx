import type { Metadata } from 'next'
import { RushCMSProvider } from '@rushcms/react'
import { rushcmsClient } from '@/lib/rushcms'
import './globals.css'

export const metadata: Metadata = {
	title: 'RushCMS Next.js Example',
	description: 'Example application using RushCMS SDK with Next.js'
}

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<body>
				<RushCMSProvider client={rushcmsClient}>
					{children}
				</RushCMSProvider>
			</body>
		</html>
	)
}
