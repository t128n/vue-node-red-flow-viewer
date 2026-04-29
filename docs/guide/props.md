# API Reference

## Imports

```js
import { FlowViewer, transformFlow, setImageContent } from 'vue-node-red-flow-viewer'
import 'vue-node-red-flow-viewer/style.css'
```

## `<FlowViewer>`

| Prop        | Type     | Default   | Description                |
| ----------- | -------- | --------- | -------------------------- |
| `flow-data` | `Array`  | Required  | Node-RED flow JSON array.  |
| `flow-id`   | `String` | `null`    | Initial tab or subflow ID. |
| `options`   | `Object` | See below | Rendering options.         |

### Options

Default options:

```js
{
  arrows: false,
  gridlines: true,
  images: true,
  linklines: false,
  labels: true,
}
```

| Option      | Type      | Description                                                              |
| ----------- | --------- | ------------------------------------------------------------------------ |
| `gridlines` | `Boolean` | Show the dotted canvas background.                                       |
| `labels`    | `Boolean` | Show node labels.                                                        |
| `images`    | `Boolean` | Show node icons when an icon is available.                               |
| `linklines` | `Boolean` | Draw dashed virtual lines between linked `link out` and `link in` nodes. |
| `arrows`    | `Boolean` | Present in defaults, but not currently rendered as arrowheads.           |

Pass the whole options object when overriding defaults.

## Behavior

FlowViewer is read-only:

- nodes are not draggable,
- wires cannot be edited,
- elements are not selectable,
- users can pan and zoom,
- the view fits after initialization and tab changes,
- the built-in controls fit the view and copy the flow JSON.

The parent element must have a height.

## CSS Variables

Set these variables on the component or a wrapper class.

| Variable                 | Default            | Description                  |
| ------------------------ | ------------------ | ---------------------------- |
| `--nr-flow-bg`           | `#ffffff`          | Canvas background.           |
| `--nr-grid-color`        | `#d1d5db`          | Grid dots and light borders. |
| `--nr-node-radius`       | `5px`              | Standard node radius.        |
| `--nr-wire-color`        | `#999`             | Wire color.                  |
| `--nr-wire-width`        | `3`                | Wire width variable.         |
| `--nr-font-family`       | system UI stack    | Label font.                  |
| `--nr-label-font-size`   | `14px`             | Node label size.             |
| `--nr-label-color`       | `#000000`          | Node label text color. Stays dark by default since node backgrounds are always light pastels. |
| `--nr-port-color`        | `rgb(217,217,217)` | Port fill.                   |
| `--nr-port-border-color` | `rgb(153,153,153)` | Port border.                 |
| `--nr-group-radius`      | `5px`              | Group radius.                |
| `--nr-group-label-size`  | `12px`             | Group label size.            |
| `--nr-tab-bg`            | `#f1f5f9`          | Tab bar background.          |
| `--nr-tab-active-bg`     | `#ffffff`          | Active tab background.       |
| `--nr-tab-text`          | `#64748b`          | Inactive tab text.           |
| `--nr-tab-active-text`   | `#0f172a`          | Active tab text.             |
| `--nr-tab-hover-bg`      | `rgba(255,255,255,0.5)` | Tab hover background.   |
| `--nr-btn-bg`            | `#ffffff`          | Control button background.   |
| `--nr-btn-bg-hover`      | `#f8fafc`          | Control button hover background. |

## `transformFlow(flowData, flowId, options)`

Converts Node-RED flow JSON into Vue Flow `nodes` and `edges`.

```js
import { transformFlow } from 'vue-node-red-flow-viewer'

const { nodes, edges } = transformFlow(flow, 'main-tab', {
  gridlines: true,
  images: true,
  labels: true,
  linklines: true,
})
```

Use this helper when you need to inspect or test the transformed graph without rendering the component.

## `setImageContent(content)`

Replaces the icon content map.

```js
import { setImageContent } from 'vue-node-red-flow-viewer'

setImageContent({
  'function.svg': 'data:image/svg+xml;base64,...',
  'debug.svg': 'data:image/svg+xml;base64,...',
})
```

Calling `setImageContent` replaces the whole map, so include every icon you want to keep available.
