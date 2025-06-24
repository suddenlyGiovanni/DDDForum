import { Config } from './config.ts'
import { makeApp } from './controllers/app.ts'
import { openDatabaseSync } from './database/database.ts'

const config = Config.make(process.env)

export const database = openDatabaseSync(
	new URL(`./database/${config.sqliteFileName}`, import.meta.url)
)

const server = makeApp(database).listen(config.port, _ =>
	console.log(`Server is running on port ${config.port}`)
)

const signalsListener: NodeJS.SignalsListener = signal => {
	console.info(`\nsignal "${signal}" received.`)
	console.log('Closing http server.')
	if (database.isOpen) {
		console.log('Closing database connection...')
		database.close()
		if (!database.isOpen) console.log('Database Close')
	}

	server.close(error => {
		if (error === undefined) {
			console.log('Http server closed.')
			process.exit(0)
		} else {
			console.error('Error while closing http server:', error)
			process.exit(1)
		}
	})
}

// Graceful shutdown
process.on('SIGTERM', signalsListener)
process.on('SIGINT', signalsListener)
