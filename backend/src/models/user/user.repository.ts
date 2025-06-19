import type { DatabaseSync } from 'node:sqlite'

import type { Email } from '../../domains/email.ts'
import type { User } from '../../domains/user.ts'
import type { CreateUserDto, EditUserDto } from './user.dto.ts'
import { UserSchema } from './user.schema.ts'

/**
 * A repository for managing users.
 * This repository provides methods to create, edit, and retrieve users.
 */
export class UserRepository {
	static #instance: UserRepository | undefined = undefined
	readonly #db: DatabaseSync

	/**
	 * Private constructor to enforce singleton pattern.
	 * @param db - The database connection or instance.
	 */
	private constructor(db: DatabaseSync) {
		this.#db = db
	}

	/**
	 * Creates a singleton instance of UserRepository.
	 */
	static make(db: DatabaseSync): UserRepository {
		if (UserRepository.#instance === undefined) {
			UserRepository.#instance = new UserRepository(db)
		}
		return UserRepository.#instance
	}
}
