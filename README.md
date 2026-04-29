# vue-node-red-flow-viewer

[![Version](https://npmx.dev/api/registry/badge/version/vue-node-red-flow-viewer)](https://npmx.dev/package/vue-node-red-flow-viewer)
[![License](https://npmx.dev/api/registry/badge/license/vue-node-red-flow-viewer)](https://npmx.dev/package/vue-node-red-flow-viewer)
[![Downloads](https://npmx.dev/api/registry/badge/downloads/vue-node-red-flow-viewer)](https://npmx.dev/package/vue-node-red-flow-viewer)
[![Types](https://npmx.dev/api/registry/badge/types/vue-node-red-flow-viewer)](https://npmx.dev/package/vue-node-red-flow-viewer)
[![Dependencies](https://npmx.dev/api/registry/badge/dependencies/vue-node-red-flow-viewer)](https://npmx.dev/package/vue-node-red-flow-viewer)

Vue 3 component library for rendering Node-RED flow JSON with Vue Flow.

📚 **[Documentation](https://t128n.github.io/vue-node-red-flow-viewer/)**

This package is a Vue-native adaptation of the original node-red-flowviewer-js work by Gerrit Riessen, rebuilt around Vue single-file components and `@vue-flow/core`.

## Install

```bash
npm install vue-node-red-flow-viewer
```

`vue@^3.3.0` is a peer dependency. Vue Flow packages are installed as runtime dependencies.

Import the stylesheet once in your app:

```ts
import 'vue-node-red-flow-viewer/style.css'
```

## Usage

```vue
<script setup lang="ts">
import { FlowViewer } from 'vue-node-red-flow-viewer'
import 'vue-node-red-flow-viewer/style.css'

const flowData = [
  { id: 'tab1', type: 'tab', label: 'Example' },
  { id: 'inject1', type: 'inject', z: 'tab1', x: 120, y: 80, wires: [['debug1']] },
  { id: 'debug1', type: 'debug', z: 'tab1', x: 320, y: 80, wires: [] },
]
</script>

<template>
  <div class="viewer">
    <FlowViewer
      :flow-data="flowData"
      :options="{ gridlines: true, images: true, labels: true, linklines: false }"
    />
  </div>
</template>

<style scoped>
.viewer {
  height: 480px;
}
</style>
```

The wrapper needs a height because the viewer fills its parent. Pass the full Node-RED export array so tabs, groups, wires, and subflows can render.

## Exports

- `FlowViewer`: Vue component for rendering a read-only flow tab or subflow.
- `transformFlow(flowdata, flowId, opts)`: converts Node-RED flow JSON into Vue Flow nodes and edges.
- `setImageContent(content)`: replaces the icon content map used for node images.

## Component props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `flowData` | `NodeRedNode[]` | Required | Node-RED flow export array. |
| `flowId` | `string \| null` | `null` | Tab or subflow id to display. If omitted, the first tab or subflow is selected. |
| `options` | `FlowViewerOptions` | See docs | Controls gridlines, icons, labels, dashed link lines, and the currently unused `arrows` option. |
| `autoFitView` | `boolean` | `true` | Fits the viewport after initialization and content changes. |
| `fitViewOptions` | `FitViewParams` | `{ padding: 0.1 }` | Options passed to Vue Flow `fitView`. |

## Events

- `pane-ready`
- `nodes-initialized`
- `tab-change`
- `viewport-fit`
- `copy`
- `update:flowId`

See the [events docs](https://t128n.github.io/vue-node-red-flow-viewer/guide/events.html) for payload details.

## Styling

The component ships CSS variables for theming:

```css
.viewer {
  --nr-flow-bg: #f3f3f3;
  --nr-grid-color: #d4d4d4;
  --nr-wire-color: #999;
  --nr-wire-width: 3;
}
```

See the [CSS variables docs](https://t128n.github.io/vue-node-red-flow-viewer/guide/css-variables.html) for the full list.

## Development

```bash
pnpm install
pnpm test
pnpm build
pnpm docs:build
```

## License

Apache-2.0. See `LICENSE` and `NOTICE`.
