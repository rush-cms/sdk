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
		<div className={cn('relative rounded-lg overflow-hidden bg-[#1e1e1e] my-6 shadow-xl border border-[#3e3e3e]', className)}>
			{(block.data.filename || block.data.language) && (
				<div className='px-4 py-3 bg-[#2d2d2d] text-sm border-b border-[#3e3e3e] flex items-center justify-between'>
					<span className='text-[#d4d4d4] font-medium'>{block.data.filename}</span>
					{block.data.language && (
						<span className='text-xs px-2.5 py-1 bg-[#3e3e3e] text-[#4fc3f7] rounded font-mono uppercase tracking-wider font-semibold'>
							{block.data.language}
						</span>
					)}
				</div>
			)}
			<div className='overflow-x-auto bg-[#1e1e1e]'>
				<pre className='p-4 bg-[#1e1e1e]'>
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
												className={cn({
													'bg-[#264f78]': isHighlighted
												})}
											>
												<td className='pr-4 text-right text-[#858585] select-none w-12 font-mono text-xs'>
													{lineNumber}
												</td>
												<td className='text-[#d4d4d4] font-mono leading-relaxed'>
													{line || '\n'}
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						) : (
							<div className='text-[#d4d4d4] font-mono whitespace-pre leading-relaxed'>
								{block.data.code}
							</div>
						)}
					</code>
				</pre>
			</div>
		</div>
	)
}
