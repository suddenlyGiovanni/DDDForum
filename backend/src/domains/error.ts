import * as Api from '../controllers/api.ts'

export declare namespace Errors {
	const ErrorEnum: {
		/**
		 * These are errors related to the application’s services, such as the database.
		 * For instance, if a username is already taken or an email is already in use, these would be considered application-level errors.
		 * When these errors occur, we use a 409 status code to represent the conflict.
		 */
		ApplicationError: 'ApplicationError'

		/**
		 * Server errors are unrelated to the user input or the application.
		 * An example of this would be an improperly configured database connection.
		 * We don’t want to return all the details of these errors to the client.
		 * Instead, we wrap everything in a try-catch block, and if an error is caught, we return a server error.
		 * We use a 500 status code to represent these types of errors.
		 */
		ServerError: 'ServerError'

		/**
		 * Validation errors are about the data itself.
		 * For example, an invalid email would trigger a validation error.
		 * We use a 400 status code for these types of errors.
		 */
		ValidationError: 'ValidationError'
	}

	type Kind = (typeof ErrorEnum)[keyof typeof ErrorEnum]

	type StatusCode = Api.StatusCode

	type StatusText = Api.StatusText

	interface Base extends Error {
		readonly _tag: 'BaseError'
		readonly kind: Errors.Kind
		readonly statusCode: Errors.StatusCode
		readonly statusMessage: Errors.StatusText
	}
}

export class BaseError extends Error implements Errors.Base {
	readonly _tag = 'BaseError'
	readonly kind: Errors.Kind
	readonly statusCode: Errors.StatusCode
	readonly statusMessage: Errors.StatusText

	constructor(
		{
			kind,
			message,
			statusCode,
		}: {
			statusCode: Errors.StatusCode
			kind: Errors.Kind
			message: string
		},
		options?: ErrorOptions
	) {
		const statusMessage = Api.STATUS_TEXT[statusCode]

		super(`${kind} | ${statusCode} ${statusMessage}:: ${message}`, options)
		this.statusCode = statusCode
		this.statusMessage = statusMessage
		this.kind = kind
	}

	static isBaseError(error: unknown): error is BaseError {
		return (
			BaseError.isError(error) &&
			'_tag' in error &&
			error._tag === 'BaseError' &&
			'kind' in error &&
			typeof error.kind === 'string' &&
			'statusCode' in error &&
			typeof error.statusCode === 'number' &&
			'statusMessage' in error &&
			typeof error.statusMessage === 'string'
		)
	}

	static isError(error: unknown): error is Error {
		return error != null && error instanceof Error
	}
}
