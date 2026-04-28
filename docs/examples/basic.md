# Examples

These examples render bundled Node-RED flow exports with the same `FlowViewer` component used in applications.

## Basic Pipeline

<ClientOnly>
  <ExampleViewer :flow="basicFlow" />
</ClientOnly>

## Groups

<ClientOnly>
  <ExampleViewer :flow="groupsFlow" />
</ClientOnly>

## HTTP API

<ClientOnly>
  <ExampleViewer :flow="httpApiFlow" />
</ClientOnly>

## MQTT Routing

<ClientOnly>
  <ExampleViewer :flow="mqttRoutingFlow" />
</ClientOnly>

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

<script setup>
import basicFlow from '../flows/basic.json'
import groupsFlow from '../flows/groups.json'
import httpApiFlow from '../flows/http-api.json'
import mqttRoutingFlow from '../flows/mqtt-routing.json'
import ExampleViewer from '../.vitepress/components/example-viewer.vue'
</script>
