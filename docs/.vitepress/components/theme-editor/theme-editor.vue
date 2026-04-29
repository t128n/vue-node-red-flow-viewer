<script setup lang="ts">
import type { NodeRedNode } from 'vue-node-red-flow-viewer'

import ThemeControlPanel from './theme-control-panel.vue'
import ThemePreview from './theme-preview.vue'
import ThemeSnippet from './theme-snippet.vue'
import { useThemeEditor } from './use-theme-editor'

defineProps<{
  flow: NodeRedNode[]
}>()

const {
  copied,
  cssSnippet,
  darkPreset,
  previewStyle,
  reset,
  themeGroups,
  values,
  warmPreset,
  copyCss,
  applyPreset,
  updateValue,
} = useThemeEditor()
</script>

<template>
  <div class="theme-editor">
    <div class="theme-editor__workspace">
      <ThemeControlPanel
        class="theme-editor__controls"
        :groups="themeGroups"
        :values="values"
        @reset="reset"
        @update-value="updateValue"
        @apply-dark-preset="applyPreset(darkPreset)"
        @apply-warm-preset="applyPreset(warmPreset)"
      />
      <div class="theme-editor__output">
        <ThemePreview :flow="flow" :preview-style="previewStyle" />
        <ThemeSnippet :copied="copied" :css-snippet="cssSnippet" @copy="copyCss" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-editor {
  margin: 24px 0;
}

.theme-editor__workspace {
  display: grid;
  grid-template-columns: minmax(360px, 440px) minmax(680px, 1fr);
  gap: 28px;
  align-items: start;
}

.theme-editor__controls {
  position: sticky;
  top: 88px;
  max-height: calc(100vh - 112px);
  overflow: auto;
  padding-right: 4px;
}

.theme-editor__output {
  display: grid;
  min-width: 0;
  gap: 18px;
}

@media (max-width: 1180px) {
  .theme-editor__workspace {
    grid-template-columns: 1fr;
  }

  .theme-editor__controls {
    position: static;
    max-height: none;
    overflow: visible;
    padding-right: 0;
  }
}
</style>
