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

			Config.#instance = new Config({
				PORT: env['PORT'],
				SQLITE_FILE_NAME: env['SQLITE_FILE_NAME'],
			})
		}
		return Config.#instance
	}

	/**
	 * The database filename.
	 */
	get sqliteFileName(): string {
		return this.#SQLITE_FILE_NAME
	}

	/**
	 * The server port number.
	 */
	get port(): number {
		return this.#PORT
	}
}

class ConfigDefect extends Error {
	constructor(envKey: string) {
		super(
				`The environment variable "${envKey}" is not set. Please set it before starting the server.`,
		)
		this.name = 'ConfigDefect'
	}
}
