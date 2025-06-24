import type express from 'express'

import * as Api from '../api.ts'
import { Email } from '../../domains/email.ts'
import { BaseError } from '../../domains/error.ts'
import type { CreateUserDto } from '../../models/user/user.dto.ts'
import {
	EmailAlreadyTaken,
	UserNotFoundError,
	UsernameAlreadyTaken,
} from '../../models/user/user.error.ts'
import type { UserRepository } from '../../models/user/user.repository.ts'
import type { ResponsePayload } from '../api.ts'

class CreateUserValidationError extends BaseError {
	readonly field: string

	constructor(field: keyof CreateUserDto) {
		super({
			kind: 'ValidationError',
			message: `Invalid ${field} format`,
			statusCode: Api.STATUS_CODE.BadRequest,
		})
		this.field = field
		this.name = CreateUserValidationError.name
	}
}

/**
 * Validates and parses a user creation request body into a `CreateUserDto`.
 *
 * Ensures required fields (`username`, `firstName`, `lastName`) are present, are strings, and meet length constraints. Optionally parses `email` if provided. Throws a `CreateUserValidationError` if any required field is missing or invalid.
 *
 * @param body - The incoming request body containing user data
 * @returns The validated and parsed `CreateUserDto`
 * @throws CreateUserValidationError if a required field is missing or invalid
 */
function parseCreateUserRequestBody(
	body: Record<string, unknown>
): CreateUserDto {
	const userDto = {} as Record<keyof CreateUserDto, unknown>

	if ('email' in body && typeof body['email'] === 'string') {
		userDto.email = Email.of(body['email'])
	}

	if ('username' in body && typeof body['username'] === 'string') {
		const trimmedUsername = body['username'].trim()
		if (trimmedUsername.length === 0 || trimmedUsername.length > 50) {
			throw new CreateUserValidationError('username')
		}
		userDto.username = trimmedUsername
	} else {
		throw new CreateUserValidationError('username')
	}

	if ('firstName' in body && typeof body['firstName'] === 'string') {
		const trimmedFirstName = body['firstName'].trim()
		if (trimmedFirstName.length === 0 || trimmedFirstName.length > 100) {
			throw new CreateUserValidationError('firstName')
		}
		userDto.firstName = trimmedFirstName
	} else {
		throw new CreateUserValidationError('firstName')
	}

	if ('lastName' in body && typeof body['lastName'] === 'string') {
		const trimmedLastName = body['lastName'].trim()
		if (trimmedLastName.length === 0 || trimmedLastName.length > 100) {
			throw new CreateUserValidationError('lastName')
		}
		userDto.lastName = trimmedLastName
	} else {
		throw new CreateUserValidationError('lastName')
	}

	return userDto as CreateUserDto
}

export const makeCreateUser =
	(
		userRepo: UserRepository
	): express.RequestHandler<
		never,
		ResponsePayload<CreateUserDto>,
		Record<string, unknown>,
		never,
		never
	> =>
	async (req, res) => {
		const userDto = parseCreateUserRequestBody(req.body)

		try {
			const user = await userRepo.createUser(userDto)
			res.status(Api.STATUS_CODE.Created).json({
				_tag: 'success',
				data: user,
				error: undefined,
			})
		} catch (error) {
			let statusCode: Api.StatusCode
			let message: string

			if (
				error instanceof CreateUserValidationError ||
				error instanceof EmailAlreadyTaken ||
				error instanceof UsernameAlreadyTaken ||
				error instanceof UserNotFoundError
			) {
				statusCode = error.statusCode
				message = error.message
			} else {
				statusCode = Api.STATUS_CODE.InternalServerError
				message = 'Internal Server Error'
			}

			console.error(error)
			res.status(statusCode).json({
				_tag: 'failure',
				data: undefined,
				error: message,
			})
		}
	}
