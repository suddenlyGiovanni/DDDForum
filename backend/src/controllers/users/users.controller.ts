import type { DatabaseSync } from 'node:sqlite'

import express, { type Router } from 'express'

import { UserRepository }     from '../../models/user/user.repository.ts'
import { makeCreateUser }     from './create-user.handler.ts'
import { makeGetUserByEmail } from './get-user-by-email.handler.ts'

export const makeUsersRouter = (database: DatabaseSync): Router => {
	const userRepo = UserRepository.make(database)

	return express
	.Router()
	.get('/', makeGetUserByEmail(userRepo))
	.post('/new', makeCreateUser(userRepo))
}
