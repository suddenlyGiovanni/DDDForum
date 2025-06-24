import type { SQLOutputValue } from 'node:sqlite'

import { User } from '../../domains/user.ts'

interface UserRow {
	readonly email: string
	readonly first_name: string
	readonly id: number
	readonly last_name: string
	readonly password: string
	readonly username: string
}

export class UserSchema {
	/**
	 * Decodes a database record into a User object.
	 *
	 * @param userRow - A record representing a row from the database, with key-value pairs corresponding to user fields.
	 * @return A User object constructed from the provided database row.
	 * @throws It may throw validations errors
	 */
	static decode(userRow: Record<string, SQLOutputValue>): User {
		UserSchema.assertIsUserRow(userRow)
		return new User({
			email: userRow.email,
			firstName: userRow.first_name,
			id: userRow.id,
			lastName: userRow.last_name,
			password: userRow.password,
			username: userRow.username,
		})
	}

	static encode(user: User): UserRow {
		return {
			email: user.email,
			first_name: user.firstName,
			id: user.id,
			last_name: user.lastName,
			password: user.password,
			username: user.username,
		} satisfies UserRow
	}

	private static assertIsUserRow(
			maybeUserRow: object,
	): asserts maybeUserRow is UserRow {
		if (!UserSchema.isUserRow(maybeUserRow)) {
			throw new Error('Invalid user row object')
		}
	}

	private static isUserRow = (
			maybeUserRow: object,
	): maybeUserRow is UserRow => {
		return (
				typeof maybeUserRow === 'object' &&
				maybeUserRow !== null &&
				'id' in maybeUserRow &&
				typeof maybeUserRow.id === 'number' &&
				'username' in maybeUserRow &&
				typeof maybeUserRow.username === 'string' &&
				'email' in maybeUserRow &&
				typeof maybeUserRow.email === 'string' &&
				'first_name' in maybeUserRow &&
				typeof maybeUserRow.first_name === 'string' &&
				'last_name' in maybeUserRow &&
				typeof maybeUserRow.last_name === 'string' &&
				'password' in maybeUserRow &&
				typeof maybeUserRow.password === 'string'
		)
	}
}
