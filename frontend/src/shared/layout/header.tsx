import type * as React from 'react'
import { href, Link } from 'react-router'

import logo from '~/shared/assets/dddforumlogo.png?url'

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
			<h1 className="text-5xl m-0">Domain-Driven Designers</h1>
			<h3 className="m-0 text-muted font-semibold">
				Where awesome domain driven designers are made
			</h3>
			<Link
				className="font-medium text-primary hover:text-(--color-link-hover)"
				to={href('/submit')}
			>
				submit
			</Link>
		</div>
	)
}

const HeaderActionButton: React.FC = () => {
	return (
		<div>
			<Link
				className="font-medium text-primary hover:text-(--color-link-hover)"
				to={href('/register')}
			>
				Join
			</Link>
		</div>
	)
}

export function Header() {
	return (
		<header className="flex justify-center items-center">
			<Logo />
			<Title />
			<HeaderActionButton />
		</header>
	)
}
