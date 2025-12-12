import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
		},
		plugins: {
			react: reactPlugin,
			'react-hooks': reactHooksPlugin
		},
		rules: {
			'quotes': ['error', 'single', { avoidEscape: true }],
			'semi': ['error', 'never'],
			'indent': ['error', 'tab', { SwitchCase: 1 }],
			'comma-dangle': ['error', 'never'],
			'no-trailing-spaces': 'error',
			'@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-non-null-assertion': 'warn',
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn'
		},
		settings: {
			react: {
				version: 'detect'
			}
		}
	},
	{
		ignores: [
			'**/dist/**',
			'**/node_modules/**',
			'**/.turbo/**',
			'**/coverage/**',
			'examples/**',
			'**/*.config.js',
			'**/*.config.ts'
		]
	}
)
