import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"
import path from "node:path"

// Icons Helpers
import Icons from "unplugin-icons/vite"

export default defineConfig({
	plugins: [
		solidPlugin(),
		Icons({
			compiler: "solid",
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve("./src"),
		},
	},
	build: {
		target: "esnext",
		polyfillDynamicImport: false,
	},
})
