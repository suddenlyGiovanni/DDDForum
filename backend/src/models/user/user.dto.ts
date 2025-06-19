import type { Email } from '../../domains/email.ts'

export interface EditUserDto {
	readonly email: Email.Type
	readonly firstName: string
	readonly lastName: string
	readonly username: string
}

export interface CreateUserDto {
	readonly email: Email.Type
	readonly firstName: string
	readonly lastName: string
	readonly username: string
}
