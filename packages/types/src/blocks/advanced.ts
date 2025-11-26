import { TipTapContent } from './tiptap'

export type AlertType = 'info' | 'success' | 'warning' | 'error'

export interface AlertBlock {
	type: 'alert'
	data: {
		type: AlertType
		title?: string
		content: TipTapContent
	}
}

export type DividerStyle = 'solid' | 'dashed' | 'dotted'
export type DividerSpacing = 'small' | 'medium' | 'large'

export interface DividerBlock {
	type: 'divider'
	data: {
		style: DividerStyle
		spacing: DividerSpacing
	}
}

export interface CodeBlock {
	type: 'code'
	data: {
		language: string
		code: string
		filename?: string
		show_line_numbers: boolean
		highlight_lines?: string
	}
}

export interface ColumnItem {
	content: TipTapContent
}

export interface ColumnsBlock {
	type: 'columns'
	data: {
		columns: 2 | 3
		gap: 'small' | 'medium' | 'large'
		items: ColumnItem[]
	}
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonBlock {
	type: 'button'
	data: {
		text: string
		url: string
		variant: ButtonVariant
		size: ButtonSize
		icon?: string
		icon_position?: 'left' | 'right'
		open_in_new_tab: boolean
		full_width: boolean
	}
}
