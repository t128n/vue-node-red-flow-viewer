# Examples

These examples use the same `FlowViewer` component you import in an app. Use the previews to check how common Node-RED export shapes render before wiring your own data.

## Basic flow preview

<ClientOnly>
  <ExampleViewer :flow="basicFlow" />
</ClientOnly>

## Groups preview

<ClientOnly>
  <ExampleViewer :flow="groupsFlow" />
</ClientOnly>

## HTTP API preview

<ClientOnly>
  <ExampleViewer :flow="httpApiFlow" />
</ClientOnly>

## MQTT routing preview

<ClientOnly>
  <ExampleViewer :flow="mqttRoutingFlow" />
</ClientOnly>

## Subflows preview

Subflow definitions render as their own tabs, and subflow instances render as regular nodes on the parent tab.

<ClientOnly>
  <ExampleViewer :flow="subflowsFlow" />
</ClientOnly>

## Basic readonly viewer

Use this when you want to embed a Node-RED flow as documentation, a status page, or a support view.

```vue
<script setup lang="ts">
import { FlowViewer } from 'vue-node-red-flow-viewer'
import 'vue-node-red-flow-viewer/style.css'
import flow from './flow.json'
</script>

<template>
  <div class="flow-viewer">
    <FlowViewer :flow-data="flow" />
  </div>
</template>

<style scoped>
.flow-viewer {
  height: 520px;
}
</style>
```

<script setup>
import basicFlow from '../flows/basic.json'
import groupsFlow from '../flows/groups.json'
import httpApiFlow from '../flows/http-api.json'
import mqttRoutingFlow from '../flows/mqtt-routing.json'
import subflowsFlow from '../flows/subflows.json'
import ExampleViewer from '../.vitepress/components/example-viewer.vue'
</script>

## Multi-tab flow with tab switching

Use `v-model:flow-id` when the parent needs to show or store the active tab. The viewer still renders its built-in tabs when the export contains more than one tab or subflow.

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { FlowViewer } from 'vue-node-red-flow-viewer'
import type { NodeRedNode } from 'vue-node-red-flow-viewer'
import 'vue-node-red-flow-viewer/style.css'
import flow from './flow.json'

const flowData = flow as NodeRedNode[]

const tabs = computed(() =>
  flowData
    .filter((node) => node.type === 'tab' || node.type === 'subflow')
    .map((node) => ({
      id: node.id,
      label: node.label || node.name || node.id,
    })),
)

const activeFlowId = ref(tabs.value[0]?.id ?? null)
</script>

<template>
  <section class="flow-layout">
    <header class="flow-toolbar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        :class="{ active: tab.id === activeFlowId }"
        @click="activeFlowId = tab.id"
      >
        {{ tab.label }}
      </button>
    </header>

    <FlowViewer v-model:flow-id="activeFlowId" :flow-data="flowData" />
  </section>
</template>

<style scoped>
.flow-layout {
  height: 620px;
  display: flex;
  flex-direction: column;
  border: 1px solid #d4d4d4;
}

.flow-toolbar {
  display: flex;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #d4d4d4;
}

.flow-toolbar button {
  padding: 6px 10px;
  border: 1px solid #c7c7c7;
  background: #ffffff;
  cursor: pointer;
}

.flow-toolbar button.active {
  border-color: #8f0000;
  color: #8f0000;
}
</style>
```

## Custom-themed dark viewer

Use CSS variables when the viewer needs to match an application theme.

```vue
<script setup lang="ts">
import { FlowViewer } from 'vue-node-red-flow-viewer'
import 'vue-node-red-flow-viewer/style.css'
import flow from './flow.json'
</script>

<template>
  <div class="flow-viewer dark-flow">
    <FlowViewer
      :flow-data="flow"
      :options="{
        gridlines: true,
        images: true,
        labels: true,
        linklines: true,
      }"
    />
  </div>
</template>

<style scoped>
.flow-viewer {
  height: 520px;
}

.dark-flow {
  --nr-flow-bg: #111820;
  --nr-grid-color: #2e4053;
  --nr-border-color: #465667;
  --nr-accent-color: #ff6b5f;
  --nr-wire-color: #9fb4c8;
  --nr-port-color: #56687a;
  --nr-port-border-color: #b3c3d2;
  --nr-tab-bg: #18222d;
  --nr-tab-active-bg: #253443;
  --nr-tab-hover-bg: #22303e;
  --nr-tab-text: #bfccd8;
  --nr-tab-active-text: #ffffff;
  --nr-btn-bg: #253443;
  --nr-btn-bg-hover: #314456;
}
</style>
```
