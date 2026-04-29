---
aside: false
pageClass: theme-editor-page
---

# Theme Editor

Tune the FlowViewer CSS variables against a live flow preview, then copy the generated wrapper styles into your app.

<ClientOnly>
  <ThemeEditor :flow="basicFlow" />
</ClientOnly>

```vue
<template>
  <div class="flow-viewer">
    <FlowViewer :flow-data="flow" />
  </div>
</template>
```

<script setup>
import basicFlow from '../flows/basic.json'
import ThemeEditor from '../.vitepress/components/theme-editor/theme-editor.vue'
</script>
