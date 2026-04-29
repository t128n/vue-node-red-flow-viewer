---
layout: home

hero:
  name: |-
    Node-RED
    Flow Viewer
  tagline: 'Vue-based renderer for Node-RED flows.'
  actions:
    - theme: brand
      text: Get started
      link: /guide/installation
    - theme: alt
      text: Component props
      link: /guide/component-props
---

## Install

```bash
pnpm add vue-node-red-flow-viewer
```

```js
import { FlowViewer } from 'vue-node-red-flow-viewer'
import 'vue-node-red-flow-viewer/style.css'
```

## Basic usage

```vue
<template>
  <div class="flow-viewer">
    <FlowViewer :flow-data="flow" />
  </div>
</template>

<script setup>
import { FlowViewer } from 'vue-node-red-flow-viewer'
import 'vue-node-red-flow-viewer/style.css'
import flow from './flow.json'
</script>

<style scoped>
.flow-viewer {
  height: 520px;
}
</style>
```

The wrapper element needs a height because the viewer fills its parent.
