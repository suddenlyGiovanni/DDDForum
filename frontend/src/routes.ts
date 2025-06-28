import { index, type RouteConfig, route } from '@react-router/dev/routes'

export default [
	index('pages/index.tsx'),
	route('submit', 'pages/submit.tsx'),
	route('member/:username', 'pages/member.tsx'),
	route('post/:postId', 'pages/post.tsx'),
] satisfies RouteConfig
