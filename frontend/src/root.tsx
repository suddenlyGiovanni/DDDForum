import type * as React from 'react'
import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from 'react-router'

import favicon from '~/shared/assets/dddforumlogo.png?url'
import { Shell } from '~/shared/layout/shell.tsx'
import tailwind from '~/shared/styles/tailwind.css?url'

import type { Route } from './+types/root.ts'

export const links: Route.LinksFunction = () => [
	{ href: favicon, rel: 'icon' },
	{ href: 'https://fonts.googleapis.com', rel: 'preconnect' },
	{
		crossOrigin: 'anonymous',
		href: 'https://fonts.gstatic.com',
		rel: 'preconnect',
	},
	{
		href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
		rel: 'stylesheet',
	},
	{ href: tailwind, rel: 'stylesheet' },
]

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html className="scheme-light-dark" lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta content="width=device-width, initial-scale=1" name="viewport" />
				<meta content="light only" name="color-scheme" />
				<Meta />
				<Links />
			</head>
			<body className="m-0 flex min-h-screen min-w-sm items-center">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	return (
		<Shell>
			<Outlet />
		</Shell>
	)
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = 'Oops!'
	let details = 'An unexpected error occurred.'
	let stack: string | undefined

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? '404' : 'Error'
		details =
			error.status === 404
				? 'The requested page could not be found.'
				: error.statusText || details
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message
		stack = error.stack
	}

	return (
		<main className="container mx-auto p-4 pt-16">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full overflow-x-auto p-4">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	)
}
