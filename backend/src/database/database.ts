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
 * Executes the SQL schema initialization script from the local `init.sql` file on the provided database instance.
 *
 * Throws an `InitializationError` if reading the script or executing it fails.
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
 * Opens a synchronous SQLite database at the given file path, enables foreign key constraints, and initializes its schema.
 *
 * @param path - The file path to the SQLite database.
 * @returns The opened and initialized database instance.
 * @throws InitializationError if schema initialization fails.
 * @throws DatabaseError if the database cannot be opened or another error occurs.
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
