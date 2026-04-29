# Subflows

Subflows are reusable flow snippets defined once and instantiated multiple times. FlowViewer renders both the **subflow definitions** (shown as their own tabs) and every **subflow instance** node on the parent tab.

## How it works

A Node-RED export that uses subflows contains two kinds of entries:

| Entry type | `type` field | Rendered as |
|---|---|---|
| Subflow definition | `"subflow"` | Separate tab with the internal wiring |
| Subflow instance | `"subflow:<definition-id>"` | Regular node on the parent tab |

Pass the full export array — including subflow definitions — to `flow-data` and FlowViewer handles the rest.

## Example: Normalize Value & Format Report

Two reusable subflows (`Normalize Value`, `Format Report`) are defined and then instantiated four times on the `Subflow Usage` tab.

<ClientOnly>
  <ExampleViewer :flow="subflowsFlow" />
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
// Export the full flow from Node-RED — subflow definitions are included automatically
import flow from './flow.json'
</script>

<style scoped>
.viewer { height: 500px; }
</style>
```

> **Tip:** In Node-RED, use **Export → Download** to get a JSON file that includes all subflow definitions referenced by the selected flow.

<script setup>
import subflowsFlow from '../flows/subflows.json'
import ExampleViewer from '../.vitepress/components/example-viewer.vue'
</script>
