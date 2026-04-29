import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/vue-node-red-flow-viewer/',
  title: 'Node-RED Flow Viewer',
  description: 'Vue 3 component for rendering Node-RED flows',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/vue-node-red-flow-viewer/favicon.svg' }],
  ],
  themeConfig: {
    logo: {
      src: '/workflow.svg',
      alt: 'Node-RED Flow Viewer',
    },
    nav: [
      { text: 'Guide', link: '/guide/installation' },
      { text: 'API', link: '/guide/component-props' },
      { text: 'Examples', link: '/examples/basic' },
      { text: 'Theme editor', link: '/examples/theme-editor' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Installation', link: '/guide/installation' },
          { text: 'Usage', link: '/guide/usage' },
        ],
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Component props', link: '/guide/component-props' },
          { text: 'Events', link: '/guide/events' },
          { text: 'Exports', link: '/guide/exports' },
          { text: 'CSS variables', link: '/guide/css-variables' },
        ],
      },
      {
        text: 'Examples',
        items: [
          { text: 'Examples', link: '/examples/basic' },
          { text: 'Custom theming', link: '/examples/theming' },
          { text: 'Theme editor', link: '/examples/theme-editor' },
        ],
      },
      {
        text: 'Reference',
        items: [{ text: 'Troubleshooting', link: '/reference/troubleshooting' }],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/t128n/vue-node-red-flow-viewer' },
      { icon: 'npm', link: 'https://www.npmx.dev/package/vue-node-red-flow-viewer' },
    ],
    footer: {
      message: 'Not affiliated with, endorsed by, or sponsored by Node-RED or nodered.org.',
      copyright: 'Lucide icon ISC. Based on node-red-flowviewer-js by Gerrit Riessen.',
    },
  },
})
