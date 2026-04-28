# Getting Started

## Installation

```bash
pnpm add vue-node-red-flow-viewer
```

Other package managers work too:

```bash
npm install vue-node-red-flow-viewer
yarn add vue-node-red-flow-viewer
```

## Basic Usage

Import the component and stylesheet, then pass a Node-RED flow export.

```vue
<template>
  <div class="viewer">
    <FlowViewer :flow-data="flow" />
  </div>
</template>

<script setup>
import { FlowViewer } from 'vue-node-red-flow-viewer'
import 'vue-node-red-flow-viewer/style.css'
import flow from './flow.json'
</script>

<style scoped>
.viewer {
  height: 500px;
}
</style>
```

`flow-data` must be the array exported by Node-RED. The viewer uses the exported node positions, wires, groups, tabs, and subflows.

## Select a Tab

When the export contains multiple tabs or subflows, pass `flow-id` to choose the initial view.

```vue
<FlowViewer :flow-data="flow" flow-id="main-tab-id" />
```

If `flow-id` is not provided, the first discovered tab or subflow is shown.

## Configure Rendering

```vue
<FlowViewer
  :flow-data="flow"
  :options="{
    gridlines: true,
    images: true,
    labels: true,
    linklines: false,
  }"
/>
```

Pass a complete options object when overriding defaults. Vue does not deep-merge object prop defaults.

## Style the Viewer

The component exposes CSS variables on the root viewer element.

```css
.viewer {
  height: 500px;
  --nr-flow-bg: #0b1020;
  --nr-grid-color: #26324f;
  --nr-wire-color: #9aa7bd;
  --nr-tab-bg: #111827;
  --nr-tab-active-bg: #1f2937;
  --nr-tab-text: #9ca3af;
  --nr-tab-active-text: #f9fafb;
}
```

For all props, options, helpers, and CSS variables, see the [API Reference](/guide/props).
