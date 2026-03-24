import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		files: ['**/*.ts'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
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
			'@typescript-eslint/no-non-null-assertion': 'warn'
		}
	},
	{
		ignores: [
			'**/dist/**',
			'**/node_modules/**',
			'**/.turbo/**',
			'**/coverage/**',
			'**/*.config.js',
			'**/*.config.ts'
		]
	}
)
