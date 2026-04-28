# vue-node-red-flow-viewer

Vue 3 component library for rendering Node-RED flow JSON with Vue Flow.

📚 **[Documentation](https://t128n.github.io/vue-node-red-flow-viewer/)**

This package is a Vue-native adaptation of the original node-red-flowviewer-js work by Gerrit Riessen, rebuilt around Vue single-file components and `@vue-flow/core`.

## Install

```bash
npm install vue-node-red-flow-viewer
```

`vue` is a peer dependency. Vue Flow packages are installed as runtime dependencies.

## Usage

```vue
<script setup>
import { FlowViewer } from 'vue-node-red-flow-viewer'
import 'vue-node-red-flow-viewer/style.css'

const flowData = [
  { id: 'tab1', type: 'tab', label: 'Example' },
  { id: 'inject1', type: 'inject', z: 'tab1', x: 120, y: 80, wires: [['debug1']] },
  { id: 'debug1', type: 'debug', z: 'tab1', x: 320, y: 80, wires: [] },
]
</script>

<template>
  <FlowViewer
    class="viewer"
    :flow-data="flowData"
    :options="{ gridlines: true, images: true, labels: true, linklines: false }"
  />
</template>

<style>
.viewer {
  width: 100%;
  height: 480px;
}
</style>
```

## Exports

- `FlowViewer`: Vue component for rendering a flow tab or subflow.
- `transformFlow(flowdata, flowId, opts)`: converts Node-RED flow JSON into Vue Flow nodes and edges.
- `setImageContent(imageNameToContent)`: registers optional node icon image content.

## Component Props

- `flowData` required: Node-RED flow JSON array.
- `flowId`: tab or subflow id to display. If omitted, the first tab/subflow is selected.
- `options`: `{ arrows, gridlines, images, linklines, labels }`.
- `autoFitView`: automatically fit the viewport after content changes.
- `fitViewOptions`: options passed to Vue Flow `fitView`.

## Events

- `pane-ready`
- `nodes-initialized`
- `tab-change`
- `viewport-fit`
- `copy`
- `update:flowId`

## Styling

The component ships CSS variables for theming:

```css
.viewer {
  --nr-flow-bg: #ffffff;
  --nr-grid-color: #d1d5db;
  --nr-wire-color: #999;
  --nr-wire-width: 3;
}
```

Import `vue-node-red-flow-viewer/style.css` once in the consuming app.

## Development

```bash
npm test
npm run lib:build
npm pack --dry-run
```

## License

Apache-2.0. See `LICENSE` and `NOTICE`.
