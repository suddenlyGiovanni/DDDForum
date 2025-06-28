import type * as React from 'react'
import { href, Link, useLocation } from 'react-router'

import logo from '~/shared/assets/dddforumlogo.png?url'
import { Button } from '~/shared/components/button'
import { Typography } from '~/shared/components/typography'

const Logo: React.FC = () => (
	<div className="max-w-16">
		<img alt="Logo" src={logo} />
	</div>
)

const Title: React.FC = () => (
	<div className="flex flex-col items-start">
		<Typography.H1 className="m-0">Domain-Driven Designers</Typography.H1>
		<Typography.H3 className="m-0">
			Where awesome domain driven designers are made
		</Typography.H3>
		<Button asChild variant={'secondary'}>
			<Link to={href('/submit')}>submit</Link>
		</Button>
	</div>
)

const shouldShowActionButton = (pathName: string): boolean => {
	switch (pathName) {
		case '/register':
		case '/login':
			return false
		default:
			return true
	}
}

declare namespace HeaderActionButton {
	interface Props {
		/**
		 * User object containing username, or undefined if not logged in
		 */
		readonly user: undefined | { readonly username: string }

		/**
		 * Callback for logout action
		 */
		readonly onLogout: React.MouseEventHandler<HTMLButtonElement>
		/**
		 * Current pathname to determine if action button should be shown
		 */
		readonly pathname: string
	}
}

const HeaderActionButton: React.FC<HeaderActionButton.Props> = ({
	user,
	onLogout,
	pathname,
}) => (
	<div>
		{user ? (
			<div>
				<div>{user.username}</div>
				<u>
					<Button onClick={onLogout} variant={'link'}>
						logout
					</Button>
				</u>
			</div>
		) : shouldShowActionButton(pathname) ? (
			<Button asChild variant={'link'}>
				<Link to={href('/register')}>Join</Link>
			</Button>
		) : null}
	</div>
)

export const Header: React.FC = () => {
	const { pathname } = useLocation()

	return (
		<header className="flex items-center justify-center">
			<Logo />
			<Title />

			<HeaderActionButton
				onLogout={() => {}}
				pathname={pathname}
				user={undefined}
			/>
		</header>
	)
}
