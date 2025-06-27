import type * as React from 'react'

import { Content } from './content.tsx'
import { Header } from './header.tsx'

export const Shell: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<div className="w-screen h-screen p-8 m-4 rounded-sm bg-background">
			<Header />
			<Content>{children}</Content>
		</div>
	)
}
