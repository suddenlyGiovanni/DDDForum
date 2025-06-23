import type { DatabaseSync } from 'node:sqlite'
import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'

import type { Email } from '../../domains/email.ts'
import type { User } from '../../domains/user.ts'
import type { CreateUserDto, EditUserDto } from './user.dto.ts'
import {
	EmailAlreadyTaken,
	UserNotFoundError,
	UsernameAlreadyTaken,
} from './user.error.ts'
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

	createUser({
		firstName,
		email,
		username,
		lastName,
	}: CreateUserDto): Promise<User> {
		try {
			if (!this.isUniqueEmail({ email })) {
				throw new EmailAlreadyTaken(email)
			}

			if (!this.isUniqueUsername({ username })) {
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
					`
				)
				.get({
					email,
					firstName,
					lastName,
					password: generateRandomPassword(10),
					username,
				})

			assert(maybeUserRow, 'Failed to create the user')

			return Promise.resolve(UserSchema.decode(maybeUserRow))
		} catch (error) {
			return Promise.reject(error)
		}
	}

	editUser(
		id: User.Id,
		{ email, firstName, lastName, username }: EditUserDto
	): Promise<User> {
		try {
			const maybeUserRecord = this.#db
				.prepare(`
          SELECT *
          FROM users
          WHERE users.id = @id;
			`)
				.get({ id })

			if (maybeUserRecord === undefined) {
				throw new UserNotFoundError(email)
			}

			if (
				!this.isUniqueEmail({
					email,
					id,
				})
			) {
				throw new EmailAlreadyTaken(email)
			}

			if (
				!this.isUniqueUsername({
					id,
					username,
				})
			) {
				throw new UsernameAlreadyTaken(username)
			}

			const editedUserRecord = this.#db
				.prepare(`
          UPDATE users
          SET email = @email,
              first_name = @firstName,
              last_name = @lastName,
              username = @username
          WHERE users.id = @id RETURNING *;
			`)
				.get({
					email,
					firstName,
					id,
					lastName,
					username,
				})

			assert(editedUserRecord, new UserNotFoundError(email))

			return Promise.resolve(UserSchema.decode(editedUserRecord))
		} catch (error) {
			return Promise.reject(error)
		}
	}

	getUserByEmail(email: Email.Type): Promise<User> {
		try {
			const userRecord = this.#db
				.prepare(`
          SELECT *
          FROM users
          WHERE users.email = @email;
			`)
				.get({ email })

			if (userRecord === undefined) throw new UserNotFoundError(email)

			return Promise.resolve(UserSchema.decode(userRecord))
		} catch (error) {
			return Promise.reject(error)
		}
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
		id?: User.Id
	}): boolean {
		const count =
			id === undefined
				? this.#db
						.prepare(`
                SELECT COUNT(*) as count
                FROM users
                WHERE users.email = @email;
						`)
						.get({ email })?.['count']
				: this.#db
						.prepare(`
                SELECT COUNT(*) as count
                FROM users
                WHERE users.email = @email
                    AND users.id != @id;

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
		id?: User.Id
	}): boolean {
		const count =
			id === undefined
				? this.#db
						.prepare(`
                SELECT COUNT(*) as count
                FROM users
                WHERE users.username = @username;
						`)
						.get({ username })?.['count']
				: this.#db
						.prepare(`
                SELECT COUNT(*) as count
                FROM users
                WHERE users.username = @username
                  AND users.id != @id;
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
	const randomValues = randomBytes(length)
	return Array.from(randomValues)
		.map(byte => charset[byte % charset.length])
		.join('')
}
