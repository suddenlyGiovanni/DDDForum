import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'

/**
 * Initializes the database schema by executing the init.sql file.
 *
 * @param {DatabaseSync} database - The database instance to initialize.
 */
function initializeSchema(database: DatabaseSync): void {
	const initScript = readFileSync(
			new URL('./init.sql', import.meta.url),
			'utf-8',
	)
	database.exec(initScript)
}

/**
 * Opens a synchronous database connection to the specified path and initializes it.
 *
 * @param {URL} path - The file path to the database.
 * @return A database instance with foreign keys enabled and schema initialized.
 */
export function openDatabaseSync(path: URL): DatabaseSync {
	const database = new DatabaseSync(path, {
		enableForeignKeyConstraints: true,
		open: false,
	})
	database.open()
	initializeSchema(database)
	return database
}
