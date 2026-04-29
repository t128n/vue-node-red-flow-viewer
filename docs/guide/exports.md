# Exports

## `FlowViewer`

Signature:

```ts
import type { DefineComponent } from 'vue'

const FlowViewer: DefineComponent<FlowViewerProps>
```

Purpose: renders a read-only Node-RED flow export as Vue Flow nodes and edges, including tabs, groups, subflows, labels, icons, wires, pan, zoom, fit controls, and copy controls.

Usage:

```vue
<FlowViewer :flow-data="flow" />
```

## `transformFlow`

Signature:

```ts
function transformFlow(
  flowdata: NodeRedNode[],
  flowId: string,
  opts?: FlowViewerOptions,
): TransformResult
```

Purpose: converts a Node-RED flow array into Vue Flow `nodes` and `edges` for a single tab or subflow. Use it when you need to inspect, test, or render the transformed graph outside the component.

Usage:

```ts
const { nodes, edges } = transformFlow(flow, 'main-tab-id', { labels: true, images: true })
```

## `setImageContent`

Signature:

```ts
function setImageContent(content: Record<string, string>): void
```

Purpose: replaces the icon content map used to resolve Node-RED icon filenames to image sources. Include every icon you want available because the call replaces the current map.

Usage:

```ts
setImageContent({ 'function.svg': 'data:image/svg+xml;base64,...' })
```
