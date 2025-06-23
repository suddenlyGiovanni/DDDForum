import type { Email } from '../../domains/email.ts'
import type { User } from '../../domains/user.ts'

export interface EditUserDto {
	readonly email: Email.Type
	readonly firstName: string
	readonly id?: User.Id
	readonly lastName: string
	readonly username: string
}

export interface CreateUserDto {
	readonly email: Email.Type
	readonly firstName: string
	readonly id?: User.Id
	readonly lastName: string
	readonly username: string
}
