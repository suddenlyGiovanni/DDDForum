import type { Route } from './+types/member.ts'

export default function Member({ params }: Route.ComponentProps) {
	return <>Member Page for "{params.username}"</>
}
