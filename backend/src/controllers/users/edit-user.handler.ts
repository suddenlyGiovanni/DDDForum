import type express from 'express'

import * as Api from '../api.ts'
import { Email } from '../../domains/email.ts'
import { BaseError } from '../../domains/error.ts'
import { User } from '../../domains/user.ts'
import type { EditUserDto } from '../../models/user/user.dto.ts'
import {
	EmailAlreadyTaken,
	UserNotFoundError,
	UsernameAlreadyTaken,
} from '../../models/user/user.error.ts'
import type { UserRepository } from '../../models/user/user.repository.ts'
import type { ResponsePayload } from '../api.ts'

class EditUserValidationError extends BaseError {
	readonly field: string

	constructor(field: keyof EditUserDto) {
		super({
			kind: 'ValidationError',
			message: `Invalid ${field} format`,
			statusCode: Api.STATUS_CODE.BadRequest,
		})
		this.field = field
		this.name = EditUserValidationError.name
	}
}

/**
 * Validates and parses a user edit request body into an `EditUserDto`.
 *
 * Ensures that `username`, `firstName`, and `lastName` are present, are strings, and meet length constraints. Optionally parses `email` if provided. Throws an `EditUserValidationError` if any required field is missing or invalid.
 *
 * @param body - The request body containing user fields to update
 * @returns A validated and sanitized `EditUserDto` object
 */
function parseEditUserRequestBody(body: Record<string, unknown>): EditUserDto {
	const userDto = {} as Record<keyof EditUserDto, unknown>

	if ('email' in body && typeof body['email'] === 'string') {
		userDto.email = Email.of(body['email'])
	}

	if ('username' in body && typeof body['username'] === 'string') {
		const trimmedUsername = body['username'].trim()
		if (trimmedUsername.length === 0 || trimmedUsername.length > 50) {
			throw new EditUserValidationError('username')
		}
		userDto.username = trimmedUsername
	} else {
		throw new EditUserValidationError('username')
	}

	if ('firstName' in body && typeof body['firstName'] === 'string') {
		const trimmedFirstName = body['firstName'].trim()
		if (trimmedFirstName.length === 0 || trimmedFirstName.length > 100) {
			throw new EditUserValidationError('firstName')
		}
		userDto.firstName = trimmedFirstName
	} else {
		throw new EditUserValidationError('firstName')
	}

	if ('lastName' in body && typeof body['lastName'] === 'string') {
		const trimmedLastName = body['lastName'].trim()
		if (trimmedLastName.length === 0 || trimmedLastName.length > 100) {
			throw new EditUserValidationError('lastName')
		}
		userDto.lastName = trimmedLastName
	} else {
		throw new EditUserValidationError('lastName')
	}

	return userDto as EditUserDto
}

export const makeEditUser =
	(
		userRepo: UserRepository
	): express.RequestHandler<
		{
			userId: string
		},
		ResponsePayload<Omit<User, 'password'>>,
		{
			readonly email: string
			readonly firstName: string
			readonly lastName: string
			readonly username: string
		},
		never,
		never
	> =>
	async (req, res) => {
		try {
			const editUserDto = parseEditUserRequestBody(req.body)
			const userIdNum = Number(req.params.userId)
			if (
				Number.isNaN(userIdNum) ||
				!Number.isInteger(userIdNum) ||
				userIdNum <= 0
			) {
				throw new EditUserValidationError('id')
			}
			const userId = User.Id(userIdNum)

			const { password, ...user } = await userRepo.editUser(userId, editUserDto)

			res.status(Api.STATUS_CODE.OK).json({
				_tag: 'success',
				data: user,
				error: undefined,
			})
		} catch (error: unknown) {
			let statusCode: Api.StatusCode
			let message: string

			if (
				error instanceof EditUserValidationError ||
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

			res.status(statusCode).json({
				_tag: 'failure',
				data: undefined,
				error: message,
			})
		}
	}
