# Troubleshooting

## The Viewer Is Blank

The parent element probably has no height.

```vue
<div style="height: 500px">
  <FlowViewer :flow-data="flow" />
</div>
```

Also check that `flow-data` is an array and that `flow-id`, when provided, matches a tab or subflow ID.

## Gridlines or Icons Disappear

Pass a complete `options` object.

```vue
<FlowViewer
  :flow-data="flow"
  :options="{
    gridlines: true,
    images: true,
    labels: false,
    linklines: false,
  }"
/>
```

Vue does not deep-merge object prop defaults.

## The Wrong Tab Opens

Pass the tab or subflow ID explicitly.

```vue
<FlowViewer :flow-data="flow" flow-id="main-tab-id" />
```

## Link Nodes Are Not Connected

Normal wires come from the Node-RED `wires` array. Link nodes use `links`. Enable virtual link lines when you want those relationships drawn.

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

## Copy JSON Fails

The copy button uses `navigator.clipboard.writeText`. Browsers may require HTTPS, `localhost`, or clipboard permission.
