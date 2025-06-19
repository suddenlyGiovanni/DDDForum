import type { Email } from '../../domains/email.ts'
import { BaseError }  from '../../domains/error.ts'

export class UserNotFoundError extends BaseError {
	readonly email: Email.Type

	constructor(email: Email.Type) {
		super({
			kind: 'ApplicationError',
			message: `User not found for email "${email}"`,
			statusCode: 404,
		})
		this.email = email
		this.name = UserNotFoundError.name
	}
}

export class UsernameAlreadyTaken extends BaseError {
	readonly username: string

	constructor(username: string) {
		super({
			kind: 'ApplicationError',
			message: `Username "${username}" already taken`,
			statusCode: 409,
		})
		this.username = username
		this.name = UsernameAlreadyTaken.name
	}
}

export class EmailAlreadyTaken extends BaseError {
	readonly email: Email.Type

	constructor(email: Email.Type) {
		super({
			kind: 'ApplicationError',
			message: `Email "${email}" already taken`,
			statusCode: 409,
		})
		this.email = email
		this.name = UserNotFoundError.name
	}
}
