/** biome-ignore-all lint/a11y/useAltText: <explanation> */
import type * as React from 'react'
import { href, NavLink } from 'react-router'

import arrow from '~/shared/assets/arrow.svg?url'

const PostsViewSwitcher: React.FC = () => (
	<div className="flex mb-6">
		<div
			className="mr-4 text-lg text-(--color-text-muted) cursor-pointer data-active:cursor-pointer data-active:text-(--color-text-dark) first-of-type:pr-4 first-of-type:border-solid first-of-type:border-black"
			data-active
		>
			Popular
		</div>
		<div
			className="mr-4 text-lg text-(--color-text-muted) cursor-pointer data-active:cursor-pointer data-active:text-(--color-text-dark)"
			data-active
		>
			New
		</div>
	</div>
)

const PostItem: React.FC<{
	title: string
	details: string
	votes: number
	comments: number
}> = (
	{ title, details, votes, comments } = {
		details: '2 days ago',
		title: 'First Post',
		votes: 5,
		comments: 0,
	}
) => (
	<div className="post-item flex flex-row">
		<div className="post-item-votes flex flex-col items-center mr-4">
			<div className="post-item-upvote">
				<img src={arrow} />
			</div>
			<div>{votes}</div>
			<div className="post-item-downvote">
				<img src={arrow} className="transform-gpu rotate-180" />
			</div>
		</div>
		<div className="post-item-content">
			<div className="post-item-title text-lg font-bold">{title}</div>
			<div className="post-item-details flex flex-row items-center">
				<div className="pr-2 mr-2 border-r border-r-black">{details}</div>
				<NavLink
					className="font-medium text-(--color-primary) hover:text-(--color-primary-hover) pr-2 mr-2 border-r border-r-black"
					to={href('/member/username')}
				>
					{' '}
					by username{' '}
				</NavLink>
				<div>{comments} comments</div>
			</div>
		</div>
	</div>
)

const PostsList: React.FC = () => (
	<div className="posts-list flex flex-col">
		<PostItem
			comments={0}
			details={'2 days ago'}
			title={'First Post'}
			votes={5}
		/>

		<PostItem
			comments={3}
			details={'1 month ago'}
			title={'Second Post!'}
			votes={2}
		/>
		<PostItem
			comments={7}
			details={'10 days ago'}
			title={'Why DDD?'}
			votes={2}
		/>
	</div>
)

export default function Home() {
	return (
		<>
			<PostsViewSwitcher />
			<PostsList />
		</>
	)
}
