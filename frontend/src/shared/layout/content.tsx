import type * as React from 'react'

export const Content: React.FC<React.PropsWithChildren> = ({ children }) => (
	<div className="m-8 flex flex-col">{children}</div>
)
