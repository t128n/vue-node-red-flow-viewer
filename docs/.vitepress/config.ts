import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/vue-node-red-flow-viewer/',
  title: 'Node-RED FlowViewer',
  description: 'Vue 3 component for rendering Node-RED flows',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/vue-node-red-flow-viewer/favicon.svg' }],
  ],
  themeConfig: {
    logo: {
      src: '/workflow.svg',
      alt: 'Node-RED FlowViewer',
    },
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/guide/props' },
      { text: 'Examples', link: '/examples/basic' },
    ],
    sidebar: [
      {
        text: 'Documentation',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'API Reference', link: '/guide/props' },
          { text: 'Examples', link: '/examples/basic' },
          { text: 'Troubleshooting', link: '/reference/errors' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/t128n/vue-node-red-flow-viewer' }],
    footer: {
      message: 'Not affiliated with, endorsed by, or sponsored by Node-RED or nodered.org.',
      copyright: 'Lucide icon ISC. Based on node-red-flowviewer-js by Gerrit Riessen.',
    },
  },
})
