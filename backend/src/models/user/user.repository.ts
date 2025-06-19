import type { DatabaseSync } from 'node:sqlite'

import type { Email }                      from '../../domains/email.ts'
import type { User }                       from '../../domains/user.ts'
import type { CreateUserDto, EditUserDto } from './user.dto.ts'
import {
	EmailAlreadyTaken,
	UserNotFoundError,
	UsernameAlreadyTaken,
}                                          from './user.error.ts'
import { UserSchema }                      from './user.schema.ts'

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

	createUser({
							 firstName,
							 email,
							 username,
							 lastName,
						 }: CreateUserDto): Promise<User> {
		try {
			if (!this.isUniqueEmail({email})) {
				throw new EmailAlreadyTaken(email)
			}

			if (!this.isUniqueUsername({username})) {
				throw new UsernameAlreadyTaken(username)
			}

			const maybeUserRow = this.#db
			.prepare(
					`
              INSERT INTO users (email, username, first_name, last_name, password)
              VALUES (@email,
                      @username,
                      @firstName,
                      @lastName,
                      @password) RETURNING *;
					`,
			)
			.get({
				email,
				firstName,
				lastName,
				password: generateRandomPassword(10),
				username,
			})

			if (maybeUserRow === undefined) {
				throw new UserNotFoundError(email)
			}

			return Promise.resolve(UserSchema.decode(maybeUserRow))
		} catch (error) {
			return Promise.reject(error)
		}
	}

	getUserByEmail(email: Email.Type): Promise<User> {
		const userRecord = this.#db
		.prepare(`SELECT *
              FROM users
              WHERE users.email = @email;`)
		.get({email})
		if (userRecord === undefined) {
			return Promise.reject(new UserNotFoundError(email))
		}
		return Promise.resolve(UserSchema.decode(userRecord))
	}

	/**
	 * Determines if an email is unique in the users database.
	 * Optionally excludes a specific user ID from the uniqueness check.
	 *
	 * @param args - The arguments for the method.
	 * @param args.email - The email to check for uniqueness.
	 * @param args.id - The ID of the user to exclude from the uniqueness check (optional).
	 *
	 * @return Returns true if the email is unique, otherwise false.
	 */
	private isUniqueEmail({
													email,
													id,
												}: {
		email: Email.Type
		id?: UserId.Type
	}): boolean {
		const count =
				id === undefined
						? this.#db
						.prepare(`
                SELECT COUNT(*) as count
                FROM users
                WHERE users.email = @email;
						`)
						.get({email})?.['count']
						: this.#db
						.prepare(`
                SELECT COUNT(*) as count
                FROM users
                WHERE users.email = @email
                  AND users.id IS NOT @id;
						`)
						.get({
							email,
							id,
						})?.['count']

		return count !== undefined && typeof count === 'number' && count === 0
	}

	/**
	 * Checks whether a given username is unique in the database.
	 *
	 * @param params - The parameters for the method.
	 * @param params.username - The username to check for uniqueness.
	 * @param params.id - The optional user ID to exclude from the uniqueness check.
	 * @return Returns true if the username is unique, otherwise false.
	 */
	private isUniqueUsername({
														 username,
														 id,
													 }: {
		username: string
		id?: UserId.Type
	}): boolean {
		const count =
				id === undefined
						? this.#db
						.prepare(`
                SELECT COUNT(*) as count
                FROM users
                WHERE users.username = @username;
						`)
						.get({username})?.['count']
						: this.#db
						.prepare(`
                SELECT COUNT(*) as count
                FROM users
                WHERE users.username = @username
                  AND users.id IS NOT @id;
						`)
						.get({
							id,
							username,
						})?.['count']

		return count !== undefined && typeof count === 'number' && count === 0
	}
}

function generateRandomPassword(length: number): string {
	const charset =
			'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	let password = ''
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * charset.length)
		password += charset[randomIndex]
	}
	return password
}
