import type { Route } from './+types/post.ts'

export default function Post({ params }: Route.ComponentProps) {
	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Post "{params.postId}"</h1>
			<p className="mb-4">
				This is a placeholder for the post content. You can add your post
				details here.
			</p>
			<p className="mb-4">
				You can also add comments and interact with the post as needed.
			</p>
			<p className="mb-4">
				Feel free to customize this page according to your requirements.
			</p>
		</div>
	)
}
