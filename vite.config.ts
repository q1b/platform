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
	// assetsInclude: ["src/assets/fonts/Manrope[wght].woff2"],
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
