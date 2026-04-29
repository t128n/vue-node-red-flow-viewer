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

| Variable                    | Default               | Description                                                                                   |
| --------------------------- | --------------------- | --------------------------------------------------------------------------------------------- |
| `--nr-flow-bg`              | `#f3f3f3`             | Canvas background.                                                                            |
| `--nr-grid-color`           | `#d4d4d4`             | Grid dots.                                                                                    |
| `--nr-border-color`         | `#c7c7c7`             | Tabs and control borders.                                                                     |
| `--nr-accent-color`         | `#8f0000`             | Node-RED red accent used on active tabs.                                                      |
| `--nr-node-radius`          | `5px`                 | Standard node radius.                                                                         |
| `--nr-node-shadow`          | subtle black shadow   | Node shadow.                                                                                  |
| `--nr-node-icon-panel-bg`   | `rgba(0,0,0,0.08)`    | Node icon strip background.                                                                   |
| `--nr-node-separator-color` | `rgba(0,0,0,0.12)`    | Separator between node icon strip and label.                                                  |
| `--nr-wire-color`           | `#999`                | Wire color.                                                                                   |
| `--nr-wire-width`           | `3`                   | Wire width variable.                                                                          |
| `--nr-font-family`          | Helvetica/Arial stack | Label font.                                                                                   |
| `--nr-label-font-size`      | `14px`                | Node label size.                                                                              |
| `--nr-label-color`          | `#333333`             | Node label text color. Stays dark by default since node backgrounds are always light pastels. |
| `--nr-port-color`           | `rgb(217,217,217)`    | Port fill.                                                                                    |
| `--nr-port-border-color`    | `rgb(153,153,153)`    | Port border.                                                                                  |
| `--nr-group-radius`         | `5px`                 | Group radius.                                                                                 |
| `--nr-group-label-size`     | `12px`                | Group label size.                                                                             |
| `--nr-tab-bg`               | `#eeeeee`             | Tab bar background.                                                                           |
| `--nr-tab-active-bg`        | `#ffffff`             | Active tab background.                                                                        |
| `--nr-tab-text`             | `#666666`             | Inactive tab text.                                                                            |
| `--nr-tab-active-text`      | `#333333`             | Active tab text.                                                                              |
| `--nr-tab-hover-bg`         | `#f8f8f8`             | Tab hover background.                                                                         |
| `--nr-btn-bg`               | `#f8f8f8`             | Control button background.                                                                    |
| `--nr-btn-bg-hover`         | `#ffffff`             | Control button hover background.                                                              |

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
