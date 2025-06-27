import type * as React from 'react'
import { href, Link } from 'react-router'

import logo from '~/shared/assets/dddforumlogo.png?url'
import { Button } from '~/shared/components/button'
import { Typography } from '~/shared/components/typography'

const Logo: React.FC = () => {
	return (
		<div className="max-w-16">
			<img src={logo} />
		</div>
	)
}

const Title: React.FC = () => {
	return (
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
}

const HeaderActionButton: React.FC = () => {
	return (
		<div>
			<Button asChild variant={'link'}>
				<Link to={href('/register')}>Join</Link>
			</Button>
		</div>
	)
}

export const Header = () => (
	<header className="flex justify-center items-center">
		<Logo />
		<Title />
		<HeaderActionButton />
	</header>
)
