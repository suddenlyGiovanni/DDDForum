import type { DatabaseSync } from 'node:sqlite'

import express, { type Router } from 'express'

import { UserRepository } from '../../models/user/user.repository.ts'
import { makeCreateUser } from './create-user.handler.ts'

export const makeUsersRouter = (database: DatabaseSync): Router => {
	const userRepo = UserRepository.make(database)

	return express
		.Router()
		.post('/new', makeCreateUser(userRepo))
}
