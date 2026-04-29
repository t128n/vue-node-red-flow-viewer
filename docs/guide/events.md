# Events

Most events use a lifecycle payload:

```ts
interface LifecyclePayload {
  flowId: string | null
  tab: FlowTab | null
  tabs: FlowTab[]
  nodes: FlowViewerNode[]
  edges: FlowViewerEdge[]
  paneReady: boolean
  [key: string]: unknown
}
```

| Event               | Payload                                                  | When it fires                                                                                                                                                                         |
| ------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pane-ready`        | `LifecyclePayload & { instance: unknown }`               | Fires after Vue Flow reports that the pane is ready. Use it when you need access to the rendered graph state.                                                                         |
| `nodes-initialized` | `LifecyclePayload`                                       | Fires after Vue Flow initializes the current nodes. The viewer also attempts to fit the viewport after this event when `auto-fit-view` is enabled.                                    |
| `tab-change`        | `LifecyclePayload & { previousFlowId: string \| null }`  | Fires after a user selects a different built-in tab. It does not fire when the selected tab button is already active.                                                                 |
| `viewport-fit`      | `LifecyclePayload & { reason: string; fitted: boolean }` | Fires after the viewer calls Vue Flow's `fitView`. The `reason` value identifies whether the fit came from pane readiness, node initialization, content changes, or the reset button. |
| `copy`              | `LifecyclePayload & { flowJson: string }`                | Fires after the built-in copy button writes the formatted flow JSON to the clipboard. Browser clipboard permission rules still apply.                                                 |
| `update:flowId`     | `string`                                                 | Fires when the user selects a different built-in tab. Use `v-model:flow-id` if the parent should track the active tab.                                                                |
