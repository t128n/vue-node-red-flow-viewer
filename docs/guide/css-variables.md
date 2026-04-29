# CSS variables

Set these variables on the viewer wrapper or on `.nr-flowviewer`.

| Variable                    | Default                                          | Effect                                                                                      |
| --------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `--nr-flow-bg`              | `#f3f3f3`                                        | Changes the canvas background color.                                                        |
| `--nr-grid-color`           | `#d4d4d4`                                        | Changes the dotted grid color when `options.gridlines` is enabled.                          |
| `--nr-border-color`         | `#c7c7c7`                                        | Changes borders on tabs and control buttons.                                                |
| `--nr-accent-color`         | `#8f0000`                                        | Changes the active tab top border accent.                                                   |
| `--nr-node-radius`          | `5px`                                            | Changes the corner radius of regular and link nodes.                                        |
| `--nr-node-shadow`          | `0 1px 4px rgba(0, 0, 0, 0.18)`                  | Changes the shadow around regular and link nodes.                                           |
| `--nr-node-icon-panel-bg`   | `rgba(0, 0, 0, 0.08)`                            | Changes the shaded icon strip inside regular nodes.                                         |
| `--nr-node-separator-color` | `rgba(0, 0, 0, 0.12)`                            | Changes the divider between the icon strip and node label.                                  |
| `--nr-wire-color`           | `#999`                                           | Changes normal wires and dashed link lines.                                                 |
| `--nr-wire-width`           | `3`                                              | Changes the default Vue Flow edge width. Some transformed edges set their own stroke width. |
| `--nr-font-family`          | `'Helvetica Neue', Arial, Helvetica, sans-serif` | Changes node labels, group labels, tabs, and controls.                                      |
| `--nr-label-font-size`      | `14px`                                           | Changes text size inside regular nodes.                                                     |
| `--nr-label-color`          | `#333333`                                        | Changes regular node labels and group labels unless the group style defines its own color.  |
| `--nr-port-color`           | `rgb(217, 217, 217)`                             | Changes the fill color of input, output, junction, and link handles.                        |
| `--nr-port-border-color`    | `rgb(153, 153, 153)`                             | Changes the border color of input, output, junction, and link handles.                      |
| `--nr-group-radius`         | `5px`                                            | Changes the corner radius of Node-RED groups.                                               |
| `--nr-group-label-size`     | `12px`                                           | Changes group label text size.                                                              |
| `--nr-tab-bg`               | `#eeeeee`                                        | Changes the tab bar background.                                                             |
| `--nr-tab-active-bg`        | `#ffffff`                                        | Changes the active tab background.                                                          |
| `--nr-tab-text`             | `#666666`                                        | Changes inactive tab text and control icon color.                                           |
| `--nr-tab-active-text`      | `#333333`                                        | Changes active tab text and hovered control icon color.                                     |
| `--nr-tab-hover-bg`         | `#f8f8f8`                                        | Changes inactive tab hover background.                                                      |
| `--nr-btn-bg`               | `#f8f8f8`                                        | Changes the fit and copy button background.                                                 |
| `--nr-btn-bg-hover`         | `#ffffff`                                        | Changes the fit and copy button hover background.                                           |

Minimal theming example:

```vue
<template>
  <div class="viewer">
    <FlowViewer :flow-data="flow" />
  </div>
</template>

<style scoped>
.viewer {
  height: 520px;
  --nr-flow-bg: #101820;
  --nr-grid-color: #314254;
  --nr-wire-color: #88a4bc;
  --nr-tab-bg: #18232e;
  --nr-tab-active-bg: #243444;
  --nr-tab-text: #b7c4cf;
  --nr-tab-active-text: #ffffff;
}
</style>
```
