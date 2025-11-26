export class RushCMSError extends Error {
	constructor(
		message: string,
		public statusCode?: number,
		public response?: unknown
	) {
		super(message)
		this.name = 'RushCMSError'
		Object.setPrototypeOf(this, RushCMSError.prototype)
	}
}

export class RushCMSNotFoundError extends RushCMSError {
	constructor(resource: string) {
		super(`${resource} not found`, 404)
		this.name = 'RushCMSNotFoundError'
		Object.setPrototypeOf(this, RushCMSNotFoundError.prototype)
	}
}

export class RushCMSUnauthorizedError extends RushCMSError {
	constructor() {
		super('Unauthorized: Invalid or missing API token', 401)
		this.name = 'RushCMSUnauthorizedError'
		Object.setPrototypeOf(this, RushCMSUnauthorizedError.prototype)
	}
}

export class RushCMSForbiddenError extends RushCMSError {
	constructor(resource: string) {
		super(`Forbidden: You don't have permission to access ${resource}`, 403)
		this.name = 'RushCMSForbiddenError'
		Object.setPrototypeOf(this, RushCMSForbiddenError.prototype)
	}
}

export class RushCMSValidationError extends RushCMSError {
	constructor(
		message: string,
		public errors?: Record<string, string[]>
	) {
		super(message, 422)
		this.name = 'RushCMSValidationError'
		Object.setPrototypeOf(this, RushCMSValidationError.prototype)
	}
}
