import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RushCMSProvider } from '@rushcms/react'
import { rushcmsClient } from './lib/rushcms'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RushCMSProvider client={rushcmsClient}>
			<App />
		</RushCMSProvider>
	</StrictMode>
)
