import type express from 'express'

import { Email, EmailValidationError } from '../../domains/email.ts'
import type { User } from '../../domains/user.ts'
import { UserNotFoundError } from '../../models/user/user.error.ts'
import type { UserRepository } from '../../models/user/user.repository.ts'
import * as Api from '../api.ts'

export const makeGetUserByEmail =
	(
		userRepo: UserRepository
	): express.RequestHandler<
		never,
		Api.ResponsePayload<Omit<User, 'password'>>,
		never,
		{
			email: string
		},
		never
	> =>
	async (req, res) => {
		try {
			const email = Email.of(req.query.email)
			const { password, ...user } = await userRepo.getUserByEmail(email)
			res.status(Api.STATUS_CODE.OK).json({
				_tag: 'success',
				data: user,
				error: undefined,
			})
		} catch (error) {
			let statusCode: number
			let message: string

			if (
				error instanceof UserNotFoundError ||
				error instanceof EmailValidationError
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
