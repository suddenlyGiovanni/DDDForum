import type { Config } from '@react-router/dev/config'

export default {
	// Config options...
	appDirectory: 'src',
	future: {
		unstable_middleware: false,
		unstable_optimizeDeps: false,
		unstable_splitRouteModules: false,
		unstable_subResourceIntegrity: false,
		unstable_viteEnvironmentApi: false,
	},
	serverModuleFormat: 'esm',
	// Server-side render by default, to enable SPA mode set this to `false`
	ssr: true,
} satisfies Config
