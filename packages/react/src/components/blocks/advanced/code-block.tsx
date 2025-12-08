import { CodeBlock as CodeBlockType } from '@rushcms/types'
import { cn, parseHighlightLines } from '../../../utils'

interface CodeBlockProps {
	block: CodeBlockType
	className?: string
}

export function CodeBlock({ block, className }: CodeBlockProps) {
	if (!block.data.code) {
		return null
	}

	const lines = block.data.code.split('\n')
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
				<pre className='p-4'>
					<code className={`language-${block.data.language} text-sm block`}>
						{block.data.show_line_numbers ? (
							<table className='w-full border-collapse'>
								<tbody>
									{lines.map((line, index) => {
										const lineNumber = index + 1
										const isHighlighted = highlightedLines.has(lineNumber)

										return (
											<tr
												key={index}
												className={cn('code-line', {
													'code-line-highlighted': isHighlighted
												})}
											>
												<td className='code-line-number pr-4 text-right select-none w-12 font-mono text-xs'>
													{lineNumber}
												</td>
												<td className='code-line-text font-mono leading-relaxed'>
													{line || '\n'}
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						) : (
							<div className='code-text font-mono whitespace-pre leading-relaxed'>
								{block.data.code}
							</div>
						)}
					</code>
				</pre>
			</div>
		</div>
	)
}
