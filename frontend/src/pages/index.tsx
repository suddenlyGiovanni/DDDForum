import type * as React from 'react'

import { PostItem } from '~/shared/components/post-item.tsx'
import { cn } from '~/shared/styles/utils.ts'

import type { Route } from './+types/index.ts'

interface Vote {
	readonly id: number
	readonly postId: number
	readonly voteType: 'Upvote' | 'Downvote'
}

type Comment = {}

export interface Post {
	readonly id: number
	readonly title: string
	readonly dateCreated: string
	readonly memberPostedBy: {
		user: {
			readonly username: string
		}
	}
	readonly comments: Comment[]
	readonly votes: Vote[]
}

const mockPosts: readonly Post[] = [
	{
		comments: [{}],
		dateCreated: '2020-01-01',
		id: 1,
		memberPostedBy: {
			user: {
				username: 'jdVance',
			},
		},
		title: 'First post!',
		votes: [{ id: 1, postId: 1, voteType: 'Upvote' }],
	},
	{
		comments: [],
		dateCreated: '2021-01-01',
		id: 2,
		memberPostedBy: {
			user: {
				username: 'realDonaldTrump',
			},
		},
		title: 'Second post!',
		votes: [{ id: 1, postId: 2, voteType: 'Upvote' }],
	},
	{
		comments: [],
		dateCreated: '2021-01-01',
		id: 3,
		memberPostedBy: {
			user: {
				username: 'AOC',
			},
		},
		title: 'Another Post!',
		votes: [{ id: 1, postId: 2, voteType: 'Upvote' }],
	},

	{
		comments: [],
		dateCreated: '2021-01-01',
		id: 4,
		memberPostedBy: {
			user: {
				username: 'BerniSanders',
			},
		},
		title: 'A rant',
		votes: [{ id: 1, postId: 2, voteType: 'Upvote' }],
	},
]

export function loader(_: Route.LoaderArgs) {
	return { posts: mockPosts }
}

const PostsViewSwitcher: React.FC = () => (
	<div className="mb-6 flex flex-row">
		<div
			className={cn(
				'mr-4 cursor-pointer pr-4 text-lg text-muted-foreground',
				'border-foreground border-r-2 border-b-background border-solid',
				'data-active:cursor-pointer data-active:text-muted-foreground'
			)}
			data-active
		>
			Popular
		</div>
		<div
			className={cn(
				'mr-4 cursor-pointer text-lg text-muted',
				'data-active:cursor-pointer data-active:text-muted-foreground'
			)}
		>
			New
		</div>
	</div>
)

const PostsList: React.FC<{ posts: readonly Post[] }> = ({ posts }) => (
	<div className="flex flex-col gap-4">
		{posts.map(post => (
			<PostItem key={post.id} post={post} />
		))}
	</div>
)

export default function Index({ loaderData }: Route.ComponentProps) {
	return (
		<>
			<PostsViewSwitcher />
			<PostsList posts={loaderData.posts} />
		</>
	)
}
