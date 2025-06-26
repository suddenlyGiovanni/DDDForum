import { href, Link } from 'react-router'

import { Input } from './registration.tsx'

export default function Login() {
	return (
		<div className="content-container flex flex-col m-8">
			<div className="registration-form w-lg max-w-3xl my-0 mx-auto">
				<div>Login</div>
				<Input
					className="registration email"
					placeholder="email"
					type="email"
				/>
				<Input placeholder="username" type="text" />
				<div>
					<div className="to-login">
						<div>Don't have an account?</div>
						<Link
							className="font-medium text-(--color-primary) hover:text-(--color-primary-hover)"
							to={href('/register')}
						>
							Register
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
