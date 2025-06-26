import { index, type RouteConfig, route } from '@react-router/dev/routes'

export default [
	index('pages/home.tsx'),
	route('register', 'pages/registration.tsx'),
	route('login', 'pages/login.tsx'),
	route('submit', 'pages/submit.tsx'),
] satisfies RouteConfig
