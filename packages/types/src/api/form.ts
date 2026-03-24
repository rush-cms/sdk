export type FormFieldType =
	| 'text'
	| 'textarea'
	| 'email'
	| 'url'
	| 'number'
	| 'select'
	| 'checkbox'
	| 'boolean'
	| 'date'

export interface FormFieldConfig {
	name: string
	label: string
	hint?: string | null
	placeholder?: string | null
	type?: string | null
	default_value?: string | null
	options?: string[]
}

export interface FormFieldValidation {
	is_required?: boolean
	minlength?: number | null
	maxlength?: number | null
}

export interface FormField {
	type: FormFieldType
	data: {
		config: FormFieldConfig
		validation: FormFieldValidation
	}
}

export interface Form {
	id: number
	name: string
	key: string
	description: string | null
	fields: FormField[]
	is_active: boolean
	created_at: string
	updated_at: string
}

export interface FormSubmitPayload {
	data: Record<string, unknown>
	metadata?: Record<string, unknown>
}

export interface FormSubmitResponse {
	data: {
		submission_id: number
	}
	message: string
}
