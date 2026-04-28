import { fileURLToPath } from 'node:url'

import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

const srcDir = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm', 'cjs'],
  platform: 'neutral',
  fixedExtension: false,
  sourcemap: true,
  clean: true,
  alias: {
    '~': srcDir,
  },
  plugins: [Vue({ isProduction: true })],
  dts: {
    vue: true,
    sourcemap: true,
  },
  deps: {
    neverBundle: ['vue', '@vue-flow/core', '@vue-flow/background'],
  },
})
