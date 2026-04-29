# Custom Theming

FlowViewer is fully styled via CSS custom properties. Override them on any ancestor element to theme the viewer without touching component internals.

## CSS variables

| Variable                    | Default           | Controls                  |
| --------------------------- | ----------------- | ------------------------- |
| `--nr-flow-bg`              | `#f3f3f3`         | Canvas background         |
| `--nr-grid-color`           | `#d4d4d4`         | Grid dot color            |
| `--nr-border-color`         | `#c7c7c7`         | Tab / control borders     |
| `--nr-accent-color`         | `#8f0000`         | Active tab accent         |
| `--nr-wire-color`           | `#999999`         | Wire stroke               |
| `--nr-wire-width`           | `3`               | Wire thickness (px)       |
| `--nr-port-color`           | `#d9d9d9`         | Port fill                 |
| `--nr-port-border-color`    | `#999999`         | Port border               |
| `--nr-node-radius`          | `5px`             | Node corner radius        |
| `--nr-group-radius`         | `5px`             | Group corner radius       |
| `--nr-label-color`          | `#333333`         | Node / group label        |
| `--nr-label-font-size`      | `14px`            | Node label size           |
| `--nr-group-label-size`     | `12px`            | Group label size          |
| `--nr-font-family`          | Helvetica / Arial | Viewer font               |
| `--nr-node-icon-panel-bg`   | `rgba(0,0,0,.08)` | Icon strip background     |
| `--nr-node-separator-color` | `rgba(0,0,0,.12)` | Icon / label separator    |
| `--nr-node-shadow`          | `0 1px 4px …`     | Node drop shadow          |
| `--nr-tab-bg`               | `#eeeeee`         | Tab bar background        |
| `--nr-tab-active-bg`        | `#ffffff`         | Active tab background     |
| `--nr-tab-hover-bg`         | `#f8f8f8`         | Tab hover background      |
| `--nr-tab-text`             | `#666666`         | Inactive tab label        |
| `--nr-tab-active-text`      | `#333333`         | Active tab label          |
| `--nr-btn-bg`               | `#f8f8f8`         | Control button background |
| `--nr-btn-bg-hover`         | `#ffffff`         | Control button hover      |

Use the interactive **[Theme Editor](/examples/theme-editor)** to tune values live and copy the generated CSS.

---

## Default

<ClientOnly>
  <ThemedViewer :flow="flow" label="Default" />
</ClientOnly>

---

## Dark

<ClientOnly>
  <ThemedViewer
    :flow="flow"
    label="Dark"
    :theme="darkTheme"
    :snippet="darkSnippet"
  />
</ClientOnly>

```vue
<template>
  <div class="flow-viewer dark">
    <FlowViewer :flow-data="flow" />
  </div>
</template>

<style>
.flow-viewer.dark {
  --nr-flow-bg: #1e1e2e;
  --nr-grid-color: #374151;
  --nr-border-color: #4b5563;
  --nr-accent-color: #ff6b6b;
  --nr-wire-color: #94a3b8;
  --nr-port-color: #4b5563;
  --nr-port-border-color: #94a3b8;
  --nr-label-color: #e2e8f0;
  --nr-tab-bg: #111827;
  --nr-tab-active-bg: #1f2937;
  --nr-tab-hover-bg: #273244;
  --nr-tab-text: #cbd5e1;
  --nr-tab-active-text: #ffffff;
  --nr-btn-bg: #1f2937;
  --nr-btn-bg-hover: #374151;
  --nr-node-icon-panel-bg: rgba(255, 255, 255, 0.08);
  --nr-node-separator-color: rgba(255, 255, 255, 0.12);
  --nr-node-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}
</style>
```

---

## Warm

<ClientOnly>
  <ThemedViewer
    :flow="flow"
    label="Warm"
    :theme="warmTheme"
    :snippet="warmSnippet"
  />
</ClientOnly>

```vue
<template>
  <div class="flow-viewer warm">
    <FlowViewer :flow-data="flow" />
  </div>
</template>

<style>
.flow-viewer.warm {
  --nr-flow-bg: #fff7ed;
  --nr-grid-color: #fed7aa;
  --nr-border-color: #fdba74;
  --nr-accent-color: #c2410c;
  --nr-wire-color: #9a3412;
  --nr-tab-bg: #ffedd5;
  --nr-tab-active-bg: #ffffff;
  --nr-tab-hover-bg: #fed7aa;
  --nr-tab-text: #7c2d12;
  --nr-tab-active-text: #431407;
  --nr-btn-bg: #fff7ed;
  --nr-btn-bg-hover: #ffffff;
}
</style>
```

---

## High Contrast

<ClientOnly>
  <ThemedViewer
    :flow="flow"
    label="High Contrast"
    :theme="hcTheme"
    :snippet="hcSnippet"
  />
</ClientOnly>

```vue
<template>
  <div class="flow-viewer hc">
    <FlowViewer :flow-data="flow" />
  </div>
</template>

<style>
.flow-viewer.hc {
  --nr-flow-bg: #000000;
  --nr-grid-color: #333333;
  --nr-border-color: #ffffff;
  --nr-accent-color: #ffff00;
  --nr-wire-color: #00ff00;
  --nr-wire-width: 4;
  --nr-port-color: #000000;
  --nr-port-border-color: #ffffff;
  --nr-label-color: #ffffff;
  --nr-tab-bg: #111111;
  --nr-tab-active-bg: #222222;
  --nr-tab-hover-bg: #1a1a1a;
  --nr-tab-text: #cccccc;
  --nr-tab-active-text: #ffff00;
  --nr-btn-bg: #111111;
  --nr-btn-bg-hover: #333333;
  --nr-node-shadow: 0 0 0 2px #ffffff;
  --nr-node-radius: 2px;
}
</style>
```

<script setup>
import basicFlow from '../flows/basic.json'
import ThemedViewer from '../.vitepress/components/themed-viewer.vue'

const flow = basicFlow

const darkTheme = {
  '--nr-flow-bg': '#1e1e2e',
  '--nr-grid-color': '#374151',
  '--nr-border-color': '#4b5563',
  '--nr-accent-color': '#ff6b6b',
  '--nr-wire-color': '#94a3b8',
  '--nr-port-color': '#4b5563',
  '--nr-port-border-color': '#94a3b8',
  '--nr-label-color': '#e2e8f0',
  '--nr-tab-bg': '#111827',
  '--nr-tab-active-bg': '#1f2937',
  '--nr-tab-hover-bg': '#273244',
  '--nr-tab-text': '#cbd5e1',
  '--nr-tab-active-text': '#ffffff',
  '--nr-btn-bg': '#1f2937',
  '--nr-btn-bg-hover': '#374151',
  '--nr-node-icon-panel-bg': 'rgba(255,255,255,0.08)',
  '--nr-node-separator-color': 'rgba(255,255,255,0.12)',
  '--nr-node-shadow': '0 2px 8px rgba(0,0,0,0.5)',
}

const warmTheme = {
  '--nr-flow-bg': '#fff7ed',
  '--nr-grid-color': '#fed7aa',
  '--nr-border-color': '#fdba74',
  '--nr-accent-color': '#c2410c',
  '--nr-wire-color': '#9a3412',
  '--nr-tab-bg': '#ffedd5',
  '--nr-tab-active-bg': '#ffffff',
  '--nr-tab-hover-bg': '#fed7aa',
  '--nr-tab-text': '#7c2d12',
  '--nr-tab-active-text': '#431407',
  '--nr-btn-bg': '#fff7ed',
  '--nr-btn-bg-hover': '#ffffff',
}

const hcTheme = {
  '--nr-flow-bg': '#000000',
  '--nr-grid-color': '#333333',
  '--nr-border-color': '#ffffff',
  '--nr-accent-color': '#ffff00',
  '--nr-wire-color': '#00ff00',
  '--nr-wire-width': '4',
  '--nr-port-color': '#000000',
  '--nr-port-border-color': '#ffffff',
  '--nr-label-color': '#ffffff',
  '--nr-tab-bg': '#111111',
  '--nr-tab-active-bg': '#222222',
  '--nr-tab-hover-bg': '#1a1a1a',
  '--nr-tab-text': '#cccccc',
  '--nr-tab-active-text': '#ffff00',
  '--nr-btn-bg': '#111111',
  '--nr-btn-bg-hover': '#333333',
  '--nr-node-shadow': '0 0 0 2px #ffffff',
  '--nr-node-radius': '2px',
}

const darkSnippet = `.flow-viewer {
  --nr-flow-bg: #1e1e2e;
  --nr-grid-color: #374151;
  --nr-border-color: #4b5563;
  --nr-accent-color: #ff6b6b;
  --nr-wire-color: #94a3b8;
  --nr-port-color: #4b5563;
  --nr-port-border-color: #94a3b8;
  --nr-label-color: #e2e8f0;
  --nr-tab-bg: #111827;
  --nr-tab-active-bg: #1f2937;
  --nr-tab-hover-bg: #273244;
  --nr-tab-text: #cbd5e1;
  --nr-tab-active-text: #ffffff;
  --nr-btn-bg: #1f2937;
  --nr-btn-bg-hover: #374151;
}`

const warmSnippet = `.flow-viewer {
  --nr-flow-bg: #fff7ed;
  --nr-grid-color: #fed7aa;
  --nr-border-color: #fdba74;
  --nr-accent-color: #c2410c;
  --nr-wire-color: #9a3412;
  --nr-tab-bg: #ffedd5;
  --nr-tab-active-bg: #ffffff;
  --nr-tab-hover-bg: #fed7aa;
  --nr-tab-text: #7c2d12;
  --nr-tab-active-text: #431407;
  --nr-btn-bg: #fff7ed;
  --nr-btn-bg-hover: #ffffff;
}`

const hcSnippet = `.flow-viewer {
  --nr-flow-bg: #000000;
  --nr-grid-color: #333333;
  --nr-border-color: #ffffff;
  --nr-accent-color: #ffff00;
  --nr-wire-color: #00ff00;
  --nr-wire-width: 4;
  --nr-port-color: #000000;
  --nr-port-border-color: #ffffff;
  --nr-label-color: #ffffff;
  --nr-tab-bg: #111111;
  --nr-tab-active-bg: #222222;
  --nr-tab-hover-bg: #1a1a1a;
  --nr-tab-text: #cccccc;
  --nr-tab-active-text: #ffff00;
  --nr-btn-bg: #111111;
  --nr-btn-bg-hover: #333333;
  --nr-node-shadow: 0 0 0 2px #ffffff;
  --nr-node-radius: 2px;
}`
</script>
