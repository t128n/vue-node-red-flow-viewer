<template>
  <div :id="scopeId" class="example-container">
    <div v-if="label" class="theme-label">{{ label }}</div>
    <div class="viewer-wrapper">
      <FlowViewer :flow-data="flow" :options="{ gridlines: true, images: true, labels: true }" />
    </div>
    <details v-if="snippet" class="code-details">
      <summary>CSS snippet</summary>
      <div class="language-css">
        <pre><code>{{ snippet }}</code></pre>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import type { NodeRedNode } from 'vue-node-red-flow-viewer'

const props = defineProps<{
  flow: NodeRedNode[]
  theme?: Record<string, string>
  label?: string
  snippet?: string
}>()

const scopeId = `tv-${Math.random().toString(36).slice(2, 9)}`
let styleEl: HTMLStyleElement | null = null

function applyTheme(theme: Record<string, string> | undefined) {
  if (!styleEl || !theme) return
  const vars = Object.entries(theme)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ')
  styleEl.textContent = `#${scopeId} .nr-flowviewer { ${vars} }`
}

onMounted(() => {
  styleEl = document.createElement('style')
  document.head.appendChild(styleEl)
  applyTheme(props.theme)
})

watch(() => props.theme, applyTheme)

onUnmounted(() => {
  styleEl?.remove()
})
</script>

<style scoped>
.example-container {
  margin: 20px 0;
}
.theme-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.viewer-wrapper {
  height: 420px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
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
  max-height: 300px;
  overflow: auto;
  font-size: 12px;
}
</style>
