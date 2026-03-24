import type { Collection, CollectionField, Entry } from '@rushcms/types'

export function getFieldsFromCollection(collection: Collection): CollectionField[] {
	if (!collection.options) return []

	const fields: CollectionField[] = []

	for (const section of collection.options.main || []) {
		for (const field of section.fields || []) {
			fields.push(field)
		}
	}

	for (const section of collection.options.sidebar || []) {
		for (const field of section.fields || []) {
			fields.push(field)
		}
	}

	return fields
}

export function getFieldValue(entry: Entry, fieldName: string): unknown {
	if (!entry.data) return undefined
	return entry.data[fieldName]
}

export function findFieldByName(fields: CollectionField[], name: string): CollectionField | undefined {
	return fields.find(f => f.data.config.name === name)
}
