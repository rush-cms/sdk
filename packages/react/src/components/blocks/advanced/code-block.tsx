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
		<div className={cn('relative rounded-lg overflow-hidden bg-gray-900 my-6', className)}>
			{block.data.filename && (
				<div className='px-4 py-2 bg-gray-800 text-sm text-gray-300 border-b border-gray-700'>
					{block.data.filename}
				</div>
			)}
			<div className='overflow-x-auto'>
				<pre className='p-4'>
					<code className={`language-${block.data.language} text-sm`}>
						{block.data.show_line_numbers ? (
							<table className='w-full border-collapse'>
								<tbody>
									{lines.map((line, index) => {
										const lineNumber = index + 1
										const isHighlighted = highlightedLines.has(lineNumber)

										return (
											<tr
												key={index}
												className={cn({
													'bg-blue-900/30': isHighlighted
												})}
											>
												<td className='pr-4 text-right text-gray-500 select-none w-12'>
													{lineNumber}
												</td>
												<td className='text-gray-100'>
													{line || '\n'}
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						) : (
							<div className='text-gray-100'>
								{block.data.code}
							</div>
						)}
					</code>
				</pre>
			</div>
		</div>
	)
}
