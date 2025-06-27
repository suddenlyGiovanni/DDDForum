import type * as React from 'react'

import { Content } from './content.tsx'
import { Header } from './header.tsx'

export const Shell: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<div className="m-4 h-screen w-screen rounded-sm bg-background p-8">
			<Header />
			<Content>{children}</Content>
		</div>
	)
}
