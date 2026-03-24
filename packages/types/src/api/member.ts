export type MemberStatus = 'active' | 'inactive' | 'suspended' | 'pending'

export interface Member {
	id: number
	name: string
	email: string
	phone: string | null
	auth0_id: string | null
	avatar_url: string | null
	role: string
	metadata: Record<string, unknown> | null
	status: MemberStatus
	created_at: string
	updated_at: string
}

export interface MemberUpdatePayload {
	name?: string
	email?: string
	phone?: string | null
	auth0_id?: string | null
	avatar_url?: string | null
	role?: string
	metadata?: Record<string, unknown> | null
	status?: MemberStatus
}

export interface MembersQueryParams {
	status?: MemberStatus
	role?: string
	search?: string
	per_page?: number
	page?: number
}
