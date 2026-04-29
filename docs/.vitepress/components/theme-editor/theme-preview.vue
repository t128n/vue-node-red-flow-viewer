<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { NodeRedNode } from 'vue-node-red-flow-viewer'
import { FlowViewer } from 'vue-node-red-flow-viewer'

defineProps<{
  flow: NodeRedNode[]
  previewStyle: CSSProperties
}>()
</script>

<template>
  <section class="theme-preview" aria-label="Theme preview">
    <FlowViewer
      class="theme-preview__viewer"
      :flow-data="flow"
      :options="{ gridlines: true, images: true, labels: true }"
      :style="previewStyle"
    />
  </section>
</template>

<style scoped>
.theme-preview {
  height: min(720px, calc(100vh - 210px));
  min-height: 620px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.theme-preview__viewer {
  min-height: 100%;
}

@media (max-width: 720px) {
  .theme-preview {
    height: 440px;
    min-height: 440px;
  }
}
</style>
