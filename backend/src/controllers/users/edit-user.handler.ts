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

function parseEditUserRequestBody(body: Record<string, unknown>): EditUserDto {
	const userDto = {} as Record<keyof EditUserDto, unknown>

	if ('email' in body && typeof body['email'] === 'string') {
		userDto.email = Email.of(body['email'])
	}

	if ('username' in body && typeof body['username'] === 'string') {
		userDto.username = body['username']
	} else {
		throw new EditUserValidationError('username')
	}

	if ('firstName' in body && typeof body['firstName'] === 'string') {
		userDto.firstName = body['firstName']
	} else {
		throw new EditUserValidationError('firstName')
	}

	if ('lastName' in body && typeof body['lastName'] === 'string') {
		userDto.lastName = body['lastName']
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
			const userId = User.Id(Number(req.params.userId))

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
