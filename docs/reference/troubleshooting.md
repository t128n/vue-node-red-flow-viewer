# Troubleshooting

## The viewer is blank

Problem: The component renders, but the canvas has no visible nodes.

Cause: The viewer fills its parent, and the parent element has no measurable height. This can also happen when `flow-data` is not the Node-RED export array or `flow-id` points to a tab that is not in the export.

Fix:

```vue
<div style="height: 520px">
  <FlowViewer :flow-data="flow" />
</div>
```

## The graph is unstyled

Problem: Nodes, tabs, controls, or the canvas look broken.

Cause: The package stylesheet was not imported.

Fix:

```ts
import 'vue-node-red-flow-viewer/style.css'
```

## Vue reports a missing dependency

Problem: Your build fails before the viewer renders.

Cause: The app does not satisfy the package peer dependency on Vue 3.

Fix:

```bash
npm install vue@^3.3.0
```

## Gridlines, icons, or labels disappear after setting options

Problem: A visual layer disappears when you only changed one option.

Cause: Vue replaces the `options` object prop instead of deep-merging it with the component defaults.

Fix:

```vue
<FlowViewer
  :flow-data="flow"
  :options="{
    gridlines: true,
    images: true,
    labels: true,
    linklines: false,
  }"
/>
```

## The wrong tab opens

Problem: The viewer opens a different tab or subflow than you expected.

Cause: Without `flow-id`, the component selects the first discovered tab or subflow from the export.

Fix:

```vue
<FlowViewer :flow-data="flow" flow-id="main-tab-id" />
```

## Link nodes do not show relationships

Problem: `link in` and `link out` nodes appear, but no dashed relationship line connects them.

Cause: Node-RED link nodes use the `links` field instead of normal `wires`, and virtual link lines are disabled by default.

Fix:

```vue
<FlowViewer
  :flow-data="flow"
  :options="{
    gridlines: true,
    images: true,
    labels: true,
    linklines: true,
  }"
/>
```

## The viewer looks skewed

Problem: Nodes, labels, ports, or wires look stretched, offset, or misaligned.

Cause: Global content styles from the host app can leak into the viewer. Documentation frameworks such as Astro Starlight may apply typography, spacing, or box-model rules to every element inside a prose/content container.

Fix:

Wrap the viewer in a parent element that opts out of content styling. In Astro Starlight, use `not-content`:

```astro
<div class="not-content flow-viewer">
  <FlowViewer flowData={flow} />
</div>
```

For other frameworks, apply a small reset to the parent wrapper:

```css
.flow-viewer {
  height: 520px;
  font: revert;
  line-height: normal;
  letter-spacing: normal;
  box-sizing: border-box;
}

.flow-viewer *,
.flow-viewer *::before,
.flow-viewer *::after {
  box-sizing: border-box;
}
```
