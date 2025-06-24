import { BaseError } from './error.ts'

export class Email {
	/**
	 * Type guard to assert that a string is a valid email.
	 * @throws {EmailValidationError} If the email format is invalid.
	 */
	static assertIsEmail(email: string): asserts email is Email.Type {
		if (!Email.isValidEmail(email)) throw new EmailValidationError(email)
	}

	/**
	 * Type predicate to check if a string is a valid email.
	 */
	static isValidEmail(email: string): email is Email.Type {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
		return emailRegex.test(email)
	}

	/**
	 * Email constructor.
	 * @throws {EmailValidationError} If the email format is invalid.
	 */
	static of(email: string): Email.Type {
		Email.assertIsEmail(email)
		return email
	}
}

export declare namespace Email {
	/**
	 * Email is a string with a specific format.
	 */
	export type Type = string & {
		readonly brand: unique symbol
	}
}

export class EmailValidationError extends BaseError {
	readonly invalidEmail: string

	constructor(invalidEmail: string) {
		super({
			kind: 'ValidationError',
			message: `Invalid email format: ${invalidEmail}`,
			statusCode: 404,
		})
		this.invalidEmail = invalidEmail
		this.name = EmailValidationError.name
	}
}
