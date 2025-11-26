export interface TipTapMark {
	type: 'bold' | 'italic' | 'underline' | 'strike' | 'code' | 'link' | 'highlight'
	attrs?: {
		href?: string
		target?: string
		class?: string
		color?: string
	}
}

export interface TipTapTextNode {
	type: 'text'
	text: string
	marks?: TipTapMark[]
}

export interface TipTapParagraphNode {
	type: 'paragraph'
	content?: TipTapNode[]
}

export interface TipTapHeadingNode {
	type: 'heading'
	attrs: {
		level: 1 | 2 | 3 | 4 | 5 | 6
	}
	content?: TipTapNode[]
}

export interface TipTapBulletListNode {
	type: 'bulletList'
	content: TipTapListItemNode[]
}

export interface TipTapOrderedListNode {
	type: 'orderedList'
	attrs?: {
		start?: number
	}
	content: TipTapListItemNode[]
}

export interface TipTapListItemNode {
	type: 'listItem'
	content: TipTapNode[]
}

export interface TipTapCodeBlockNode {
	type: 'codeBlock'
	attrs?: {
		language?: string
	}
	content?: TipTapTextNode[]
}

export interface TipTapBlockquoteNode {
	type: 'blockquote'
	content: TipTapNode[]
}

export interface TipTapHardBreakNode {
	type: 'hardBreak'
}

export interface TipTapHorizontalRuleNode {
	type: 'horizontalRule'
}

export type TipTapNode =
	| TipTapTextNode
	| TipTapParagraphNode
	| TipTapHeadingNode
	| TipTapBulletListNode
	| TipTapOrderedListNode
	| TipTapListItemNode
	| TipTapCodeBlockNode
	| TipTapBlockquoteNode
	| TipTapHardBreakNode
	| TipTapHorizontalRuleNode

export interface TipTapContent {
	type: 'doc'
	content: TipTapNode[]
}
