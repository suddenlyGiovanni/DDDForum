import { Email } from './email.ts'

export declare namespace User {
	/**
	 * A unique identifier for a user.
	 */
	export type Id = number & {
		readonly brand: unique symbol
	}
}

export class User {
	readonly email: Email.Type
	readonly firstName: string
	readonly id: User.Id
	readonly lastName: string
	readonly password: string
	readonly username: string

	constructor(
		email: string,
		firstName: string,
		id: number,
		lastName: string,
		password: string,
		username: string
	) {
		this.email = Email.of(email)
		this.firstName = firstName
		this.id = User.Id(id)
		this.lastName = lastName
		this.password = password
		this.username = username
	}

	/** UserId.Type constructor */
	static Id = (value: number): User.Id => value as User.Id
}
