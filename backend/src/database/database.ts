import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'

import { BaseError } from '../domains/error.ts'


class InitializationError extends BaseError {
	constructor(message: string, options?: ErrorOptions) {
		super({
			kind: 'ServerError',
			message,
			statusCode: 500,
		}, options)
	}
}

class DatabaseError extends BaseError {
	constructor(message: string, options?: ErrorOptions) {
		super({
			kind: 'ServerError',
			message,
			statusCode: 500,
		}, options)
	}
}


/**
 * Initializes the database schema by executing the init.sql file.
 *
 * @param database - The database instance to initialize.
 */
function initializeSchema(database: DatabaseSync): void {
	try {
		const initScript = readFileSync(
				new URL('./init.sql', import.meta.url),
				'utf-8',
		)
		database.exec(initScript)
	} catch (error) {
		const message = 'Failed to initialize database schema: '
		if (BaseError.isError(error)) {
			throw new InitializationError(message.concat(error.message), {cause: error.cause})
		} else {
			throw new InitializationError(message.concat(String(error)))
		}
	}
}

/**
 * Opens a synchronous database connection to the specified path and initializes it.
 *
 * @param {URL} path - The file path to the database.
 * @return A database instance with foreign keys enabled and schema initialized.
 */
export function openDatabaseSync(path: URL): DatabaseSync {
	let database: undefined | DatabaseSync

	try {
		database = new DatabaseSync(path, {
			enableForeignKeyConstraints: true,
			open: false,
		})
		database.open()
		initializeSchema(database)
		return database
	} catch (error) {
		const message = `Failed to open database at ${path.pathname}: `
		database?.isOpen && database.close()
		if (error instanceof InitializationError) {
			throw error
		} else if (BaseError.isError(error)) {
			throw new DatabaseError(message.concat(error.message), {cause: error.cause})
		} else {
			throw new DatabaseError(message.concat(String(error)))
		}
	}
}
