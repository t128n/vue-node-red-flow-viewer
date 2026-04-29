# Usage

Pass the full Node-RED flow export array to `FlowViewer`. The wrapper needs a height because the viewer fills its parent.

```vue
<script setup lang="ts">
import { FlowViewer } from 'vue-node-red-flow-viewer'
import 'vue-node-red-flow-viewer/style.css'

// Use the array exported by Node-RED, including tab and subflow entries.
import flow from './flow.json'
</script>

<template>
  <div class="flow-shell">
    <FlowViewer
      :flow-data="flow"
      flow-id="main-tab-id"
      :options="{
        gridlines: true,
        images: true,
        labels: true,
        linklines: false,
      }"
    />
  </div>
</template>

<style scoped>
.flow-shell {
  /* Vue Flow needs a measurable container before it can fit the graph. */
  height: 520px;
}
</style>
```

Use `flow-id` when you want a specific tab or subflow to open first. Omit it when the first tab discovered in the export is acceptable.

Pass the complete `options` object when you override rendering options. Vue replaces object props instead of deep-merging them with the component defaults.
