import * as React from 'react'

/**
 * Determines whether the component has been rendered on the client side
 * after hydration. It returns `true` once the initial render is complete.
 *
 * @return A boolean value indicating if the component is hydrated.
 */
export function useHydrated(): boolean {
	const [hydrated, setHydrated] = React.useState(false)
	React.useEffect(() => setHydrated(true), [])
	return hydrated
}
