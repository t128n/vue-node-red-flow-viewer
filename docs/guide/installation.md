# Installation

Install the package from npm:

```bash
npm install vue-node-red-flow-viewer
```

The package has one peer dependency:

```bash
npm install vue@^3.3.0
```

Import the component styles once in your app entry file or in the SFC that renders the viewer:

```ts
import 'vue-node-red-flow-viewer/style.css'
```

The stylesheet contains the viewer layout, Vue Flow styling, node styles, tab styles, controls, and CSS variables. Without it, the component can render as unstyled or visually broken.
