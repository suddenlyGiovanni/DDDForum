import { BaseError } from './domains/error.ts'
import * as Api from './controllers/api.ts'

export class Config {
	static #instance: Config
	readonly #PORT: number
	readonly #SQLITE_FILE_NAME: string

	private constructor(env: {
		PORT: string
		SQLITE_FILE_NAME: string
	}) {
		this.#PORT = Number(env.PORT)
		this.#SQLITE_FILE_NAME = env.SQLITE_FILE_NAME
	}

	/**
	 * The server port number.
	 */
	get port(): number {
		return this.#PORT
	}

	/**
	 * The database filename.
	 */
	get sqliteFileName(): string {
		return this.#SQLITE_FILE_NAME
	}

	/**
	 * Creates and returns a singleton instance of the Config class using the provided environment variables.
	 * If the environment variables are missing, a ConfigDefect error will be thrown.
	 *
	 * @param env - The {@link NodeJS.ProcessEnv} environment variables.
	 * @return A singleton instance of the Config class.
	 */
	static make(env: NodeJS.ProcessEnv): Config {
		if (!Config.#instance) {
			if (!env['SQLITE_FILE_NAME']) throw new ConfigDefect('SQLITE_FILE_NAME')
			if (!env['PORT']) throw new ConfigDefect('PORT')

			const port = Number(env['PORT'])
			if (Number.isNaN(port) || port < 1 || port > 65535) {
				throw new ConfigDefect(
					'PORT',
					'PORT must be a valid number between 1 and 65535'
				)
			}

			Config.#instance = new Config({
				PORT: env['PORT'],
				SQLITE_FILE_NAME: env['SQLITE_FILE_NAME'],
			})
		}
		return Config.#instance
	}
}

class ConfigDefect extends BaseError {
	constructor(envKey: 'PORT' | 'SQLITE_FILE_NAME', message?: string) {
		super({
			kind: 'ServerError',
			message:
				`The environment variable "${envKey}" is not properly set. \nPlease set it before starting the server.`.concat(
					message ? `\n${message}` : ''
				),
			statusCode: Api.STATUS_CODE.InternalServerError,
		})
		this.name = this.constructor.name
	}
}
