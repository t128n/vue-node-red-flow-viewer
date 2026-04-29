# Component props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `flow-data` | `NodeRedNode[]` | Required | Provides the Node-RED export array that becomes Vue Flow nodes, edges, tabs, groups, and subflows. Use the full export so referenced tabs and subflows can render. |
| `flow-id` | `string \| null` | `null` | Selects the tab or subflow shown in the canvas. When omitted, the viewer opens the first discovered tab or subflow. |
| `options` | `FlowViewerOptions` | See option defaults | Changes which visual layers appear in the viewer. Pass a complete object when overriding defaults. |
| `options.gridlines` | `boolean` | `true` | Shows or hides the dotted canvas background. Turn it off when the viewer sits inside a dense UI. |
| `options.images` | `boolean` | `true` | Shows or hides node icons when an icon is available. Hide icons when labels need more visual weight. |
| `options.labels` | `boolean` | `true` | Shows or hides text inside nodes. Hide labels for compact overview maps. |
| `options.linklines` | `boolean` | `false` | Draws dashed virtual edges between linked `link out` and `link in` nodes. Enable it when you want Node-RED link relationships visible in the graph. |
| `options.arrows` | `boolean` | `false` | Present in the options type, but not currently rendered as arrowheads. <!-- TODO: confirm --> |
| `auto-fit-view` | `boolean` | `true` | Fits the viewport after the pane is ready, nodes initialize, or the rendered content changes. Disable it when you manage the viewport yourself through the exposed `fitView` method. |
| `fit-view-options` | `FitViewParams` | `{ padding: 0.1 }` | Passes options to Vue Flow's `fitView` call. Use it to adjust viewport padding when the graph auto-fits or the built-in fit button runs. |
