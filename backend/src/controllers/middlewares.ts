import type { ErrorRequestHandler, RequestHandler } from 'express'

import { BaseError, type Errors } from '../domains/error.ts'
import * as Api from './api.ts'

export const loggerMiddleware: RequestHandler = (req, _res, next) => {
	console.log(`${req.method} ${req.url}`)
	next()
}
export const catchAllErrorMiddleware: ErrorRequestHandler<
	Record<string, string>,
	Api.ResponsePayload<never>
> = (error: unknown, req, res, _next) => {
	// Defaults
	let statusCode: Api.StatusCode = Api.STATUS_CODE.InternalServerError
	let errorKind: Errors.Kind = 'ServerError'
	let message: string = 'Internal Server Error'
	let statusMessage: Api.StatusText =
		Api.STATUS_TEXT[Api.STATUS_CODE.InternalServerError]
	let stack: string | undefined

	// Custom error recognition
	if (BaseError.isBaseError(error)) {
		// Recognize as our custom error shape
		statusCode = error.statusCode
		errorKind = error.kind
		message = error.message
		statusMessage = error.statusMessage
		stack = error.stack
	} else if (BaseError.isError(error)) {
		// General JS errors
		message = error.message
		stack = error.stack
	}

	// Logging: always log type, status, url, and stack for actual server errors
	console.error(
		`[${new Date().toISOString()}] [${errorKind}] ${req.method} ${req.url} -> [${statusCode} ${statusMessage}]: ${message}`
	)

	if (stack) {
		console.error(stack)
	}

	res.status(statusCode).json({
		_tag: 'failure',
		data: undefined,
		error: message,
	})
}
