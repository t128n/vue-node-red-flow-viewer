<template>
  <div class="example-container">
    <div class="viewer-wrapper">
      <FlowViewer :flow-data="flow" :options="{ gridlines: true, images: true, labels: true }" />
    </div>
    <details class="code-details">
      <summary>View Flow JSON</summary>
      <div class="language-json">
        <pre><code>{{ JSON.stringify(flow, null, 2) }}</code></pre>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import type { NodeRedNode } from 'vue-node-red-flow-viewer'

defineProps<{
  flow: NodeRedNode[]
}>()
</script>

<style scoped>
.example-container {
  margin: 20px 0;
}
.viewer-wrapper {
  height: 500px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}
.code-details {
  margin-top: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
.code-details summary {
  padding: 10px;
  cursor: pointer;
  font-weight: 500;
}
.code-details pre {
  margin: 0;
  padding: 15px;
  max-height: 400px;
  overflow: auto;
  font-size: 12px;
}
</style>
