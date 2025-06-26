import type * as React from 'react'

export const Content: React.FC<React.PropsWithChildren> = ({ children }) => (
	<div className="flex flex-col m-8">{children}</div>
)
