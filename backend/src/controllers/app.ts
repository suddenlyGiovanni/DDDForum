import type { DatabaseSync } from 'node:sqlite'

import express, { type Express } from 'express'

import { catchAllErrorMiddleware, loggerMiddleware } from './middlewares.ts'
import { makeUsersRouter } from './users/users.controller.ts'

export const makeApp = (database: DatabaseSync): Express =>
	express()
		.use(express.json())
		.use(loggerMiddleware)
		.use('/users', makeUsersRouter(database))
		.use(catchAllErrorMiddleware)
