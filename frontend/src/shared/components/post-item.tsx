import type * as React from 'react'
import { href, NavLink } from 'react-router'

// TODO: remove this type binding!
import type { Post } from '~/pages/index.tsx'
import { Button } from '~/shared/components/button.tsx'

function computeVoteCount(votes: Post['votes']): number {
	return votes.reduce((acc, vote) => {
		if (vote.voteType === 'Upvote') {
			return acc + 1
		} else {
			return acc - 1
		}
	}, 0)
}

const ArrowIcon: React.FC<
	React.ComponentProps<'svg'> & { title: 'up-vote' | 'down-vote' }
> = ({ className, title, ...props }) => (
	<svg
		aria-label={title}
		className={className}
		height="16"
		role="img"
		viewBox="0 0 16 16"
		width="16"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			className="fill-foreground dark:fill-white"
			d="M4,12l1.41,1.41L11,7.83V20h2V7.83l5.58,5.59L20,12,12,4Z"
			transform="translate(-4 -4)"
		/>
	</svg>
)

export const PostItem: React.FC<{
	post: Post
	onUpvote?: React.MouseEventHandler<SVGSVGElement>
	onDownvote?: React.MouseEventHandler<SVGSVGElement>
}> = ({ post, onDownvote, onUpvote }) => (
	<div className="flex flex-row">
		<div className="post-item-votes mr-4 flex flex-col items-center">
			<div>
				<ArrowIcon onClick={onUpvote} title="up-vote" />
			</div>

			<div>{computeVoteCount(post.votes)}</div>

			<div>
				<ArrowIcon
					className="rotate-180 transform"
					onClick={onDownvote}
					title="down-vote"
				/>
			</div>
		</div>

		<div id="post-item-content">
			<div className="flex flex-row items-center gap-2">
				<div className="post-item-title font-bold text-lg">{post.title}</div>
				<Button asChild variant="link">
					<NavLink to={href('/post/:postId', { postId: String(post.id) })}>
						[[ link ]]
					</NavLink>
				</Button>
			</div>

			<div className="flex flex-row items-center">
				<div className="mr-2 border-r border-r-border pr-2">
					{formatDate(post.dateCreated, new Date())}
				</div>

				<Button asChild variant="link">
					<NavLink
						to={href(`/member/:username`, {
							username: post.memberPostedBy.user.username,
						})}
					>
						by {post.memberPostedBy.user.username}
					</NavLink>
				</Button>

				<div>
					{post.comments.length}{' '}
					{post.comments.length !== 1 ? `comments` : 'comment'}
				</div>
			</div>
		</div>
	</div>
)

/**
 * given a date in ISO format, and the now date, returns a string describing distance to now
 * For example, if the date is 2021-01-01T00:00:00Z and now is 2021-01-02T00:00:00Z,
 * it returns "1 day ago".
 * If the date is 2021-01-01T00:00:00Z and now is 2021-01-01T12:00:00Z,
 * it returns "12 hours ago".
 * If the date is 2021-01-01T00:00:00Z and now is 2021-01-01T00:30:00Z,
 * it returns "30 minutes ago".
 *
 * @todo: implement this function
 * @param isoDate
 * @param now
 */
function formatDate(isoDate: string, _now: Date = new Date()): string {
	return isoDate
}
