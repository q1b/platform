import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

// Icons Helpers
import Icons from "unplugin-icons/vite"

export default defineConfig({
  plugins: [
    solidPlugin(),
    Icons({
      compiler: "solid",
    }),
  ],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});
