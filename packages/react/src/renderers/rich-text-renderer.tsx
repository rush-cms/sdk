import {
	TipTapContent,
	TipTapNode,
	TipTapTextNode,
	TipTapParagraphNode,
	TipTapHeadingNode,
	TipTapBulletListNode,
	TipTapOrderedListNode,
	TipTapListItemNode,
	TipTapCodeBlockNode,
	TipTapBlockquoteNode
} from '@rushcms/types'
import { cn } from '../utils'

interface RichTextRendererProps {
	content: TipTapContent
	className?: string
}

export function RichTextRenderer({ content, className }: RichTextRendererProps) {
	if (!content || !content.content || !Array.isArray(content.content)) {
		return null
	}

	return (
		<div className={cn('prose prose-slate max-w-none', className)}>
			{content.content.map((node, index) => (
				<TipTapNodeRenderer key={index} node={node} />
			))}
		</div>
	)
}

interface TipTapNodeRendererProps {
	node: TipTapNode
}

function TipTapNodeRenderer({ node }: TipTapNodeRendererProps) {
	switch (node.type) {
		case 'text':
			return <TextNode node={node} />
		case 'paragraph':
			return <ParagraphNode node={node} />
		case 'heading':
			return <HeadingNode node={node} />
		case 'bulletList':
			return <BulletListNode node={node} />
		case 'orderedList':
			return <OrderedListNode node={node} />
		case 'listItem':
			return <ListItemNode node={node} />
		case 'codeBlock':
			return <CodeBlockNode node={node} />
		case 'blockquote':
			return <BlockquoteNode node={node} />
		case 'hardBreak':
			return <br />
		case 'horizontalRule':
			return <hr />
		default:
			return null
	}
}

function TextNode({ node }: { node: TipTapTextNode }) {
	let content: React.ReactNode = node.text

	if (node.marks && node.marks.length > 0) {
		for (const mark of node.marks) {
			switch (mark.type) {
				case 'bold':
					content = <strong>{content}</strong>
					break
				case 'italic':
					content = <em>{content}</em>
					break
				case 'underline':
					content = <u>{content}</u>
					break
				case 'strike':
					content = <s>{content}</s>
					break
				case 'code':
					content = <code>{content}</code>
					break
				case 'link':
					content = (
						<a
							href={mark.attrs?.href}
							target={mark.attrs?.target}
							className={mark.attrs?.class}
							rel={mark.attrs?.target === '_blank' ? 'noopener noreferrer' : undefined}
						>
							{content}
						</a>
					)
					break
				case 'highlight':
					content = (
						<mark style={mark.attrs?.color ? { backgroundColor: mark.attrs.color } : undefined}>
							{content}
						</mark>
					)
					break
			}
		}
	}

	return <>{content}</>
}

function ParagraphNode({ node }: { node: TipTapParagraphNode }) {
	if (!node.content || node.content.length === 0) {
		return <p className='mb-4'><br /></p>
	}

	return (
		<p className='mb-4'>
			{node.content.map((child, index) => (
				<TipTapNodeRenderer key={index} node={child} />
			))}
		</p>
	)
}

function HeadingNode({ node }: { node: TipTapHeadingNode }) {
	const Tag = `h${node.attrs.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

	const headingClasses = {
		1: 'text-4xl font-extrabold mt-8 mb-4 text-gray-900',
		2: 'text-3xl font-bold mt-8 mb-4 text-gray-900',
		3: 'text-2xl font-bold mt-6 mb-3 text-gray-800',
		4: 'text-xl font-semibold mt-6 mb-3 text-gray-800',
		5: 'text-lg font-semibold mt-4 mb-2 text-gray-700',
		6: 'text-base font-semibold mt-4 mb-2 text-gray-700'
	}

	const className = headingClasses[node.attrs.level as keyof typeof headingClasses] || headingClasses[2]

	return (
		<Tag className={className}>
			{node.content?.map((child, index) => (
				<TipTapNodeRenderer key={index} node={child} />
			))}
		</Tag>
	)
}

function BulletListNode({ node }: { node: TipTapBulletListNode }) {
	return (
		<ul className='mb-4 ml-6 list-disc'>
			{node.content.map((child, index) => (
				<TipTapNodeRenderer key={index} node={child} />
			))}
		</ul>
	)
}

function OrderedListNode({ node }: { node: TipTapOrderedListNode }) {
	return (
		<ol start={node.attrs?.start} className='mb-4 ml-6 list-decimal'>
			{node.content.map((child, index) => (
				<TipTapNodeRenderer key={index} node={child} />
			))}
		</ol>
	)
}

function ListItemNode({ node }: { node: TipTapListItemNode }) {
	return (
		<li>
			{node.content.map((child, index) => (
				<TipTapNodeRenderer key={index} node={child} />
			))}
		</li>
	)
}

function CodeBlockNode({ node }: { node: TipTapCodeBlockNode }) {
	const code = node.content?.map(n => n.text).join('') || ''

	return (
		<pre className={cn('mb-4 p-4 bg-gray-100 rounded-lg overflow-x-auto', node.attrs?.language ? `language-${node.attrs.language}` : undefined)}>
			<code>{code}</code>
		</pre>
	)
}

function BlockquoteNode({ node }: { node: TipTapBlockquoteNode }) {
	return (
		<blockquote className='mb-4 pl-4 border-l-4 border-gray-300 italic text-gray-700'>
			{node.content.map((child, index) => (
				<TipTapNodeRenderer key={index} node={child} />
			))}
		</blockquote>
	)
}
