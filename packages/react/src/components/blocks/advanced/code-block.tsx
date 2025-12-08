import { CodeBlock as CodeBlockType } from '@rushcms/types'
import { cn, parseHighlightLines } from '../../../utils'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
	block: CodeBlockType
	className?: string
}

export function CodeBlock({ block, className }: CodeBlockProps) {
	if (!block.data.code) {
		return null
	}

	const highlightedLines = parseHighlightLines(block.data.highlight_lines)

	return (
		<div className={cn('code-block relative rounded-lg overflow-hidden my-6 shadow-xl border border-gray-700', className)}>
			{(block.data.filename || block.data.language) && (
				<div className='code-block-header px-4 py-3 text-sm border-b border-gray-700 flex items-center justify-between'>
					<span className='code-block-filename font-medium'>{block.data.filename}</span>
					{block.data.language && (
						<span className='code-block-language text-xs px-2.5 py-1 rounded font-mono uppercase tracking-wider font-semibold'>
							{block.data.language}
						</span>
					)}
				</div>
			)}
			<div className='code-block-content overflow-x-auto'>
				<SyntaxHighlighter
					language={block.data.language || 'text'}
					style={vscDarkPlus}
					showLineNumbers={block.data.show_line_numbers}
					wrapLines={true}
					lineProps={(lineNumber) => {
						const isHighlighted = highlightedLines.has(lineNumber)
						return {
							className: isHighlighted ? 'code-line-highlighted' : ''
						}
					}}
					customStyle={{
						margin: 0,
						padding: '1rem',
						background: '#1e1e1e',
						fontSize: '0.875rem',
						lineHeight: '1.625'
					}}
					codeTagProps={{
						style: {
							fontFamily: 'var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
						}
					}}
				>
					{block.data.code}
				</SyntaxHighlighter>
			</div>
		</div>
	)
}
