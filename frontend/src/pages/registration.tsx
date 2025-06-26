import type * as React from 'react'
import { href, Link } from 'react-router'

export const Input: React.FC<React.ComponentProps<'input'>> = ({
	type,
	placeholder,
}) => (
	<input
		className="box-border block w-full py-2 px-4 mb-2 text-base text-(--color-text-form) border-3 border-(--color-border) rounded-sm transition duration-200"
		placeholder={placeholder}
		type={type}
	/>
)

export default function Registration() {
	return (
		<div className="content-container flex flex-col m-8">
			<div className="registration-form w-lg max-w-3xl my-0 mx-auto">
				<div>Create Account</div>
				<Input placeholder="email" type="email" />
				<Input placeholder="username" type="text" />
				<Input placeholder="first name" type="text" />
				<Input placeholder="last name" type="text" />
				<div>
					<div className="to-login">
						<div>Already have an account?</div>
						<Link
							className="font-medium text-(--color-primary) hover:text-(--color-primary-hover)"
							to={href('/login')}
						>
							Login
						</Link>
					</div>
					<button
						className="submit-button py-2.5 px-5 text-base font-medium cursor-pointer bg-(--color-background-button-dark) border-solid border-transparent border rounded-lg transition duration-250 hover:border-(--color-primary) focus:outline-4 focus-visible:outline-4"
						type="submit"
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	)
}
