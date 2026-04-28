import DefaultTheme from 'vitepress/theme'
import type { App } from 'vue'
import { FlowViewer } from 'vue-node-red-flow-viewer'

import 'vue-node-red-flow-viewer/style.css'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    app.component('FlowViewer', FlowViewer)
  },
}
