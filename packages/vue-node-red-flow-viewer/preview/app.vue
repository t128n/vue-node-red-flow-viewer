<template>
  <div class="shell">
    <header class="header">
      <span class="header__logo">⬡ Node-RED FlowViewer</span>
      <span class="header__sub">Vue component preview</span>
    </header>

    <nav class="tabs">
      <button
        v-for="demo in demos"
        :key="demo.id"
        class="tab"
        :class="{ 'tab--active': active === demo.id }"
        @click="active = demo.id"
      >
        <span class="tab__icon">{{ demo.icon }}</span>
        {{ demo.label }}
      </button>
    </nav>

    <div class="options">
      <label class="opt"><input type="checkbox" v-model="opts.gridlines" /> Grid</label>
      <label class="opt"><input type="checkbox" v-model="opts.labels" /> Labels</label>
      <label class="opt"><input type="checkbox" v-model="opts.linklines" /> Link lines</label>
      <span class="opt opt--info">
        Icons: run <code>pnpm generate</code> then call
        <code>setImageContent(imageNameToContent)</code>
      </span>
    </div>

    <main class="canvas-wrap">
      <FlowViewer :key="active" :flow-data="currentFlow" :options="opts" class="canvas" />
    </main>

    <details class="inspector">
      <summary>Flow JSON — {{ currentFlow.length }} nodes</summary>
      <pre class="inspector__code">{{ JSON.stringify(currentFlow, null, 2) }}</pre>
    </details>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import { FlowViewer } from '~/index'

import basicFlow from './flows/basic.json'
import groupsFlow from './flows/groups.json'
import httpFlow from './flows/http-api.json'
import mindFlow from './flows/mindmap.json'
import mqttFlow from './flows/mqtt-routing.json'

const demos = [
  { id: 'basic', label: 'Basic Pipeline', icon: '⚙', flow: basicFlow },
  { id: 'groups', label: 'Groups & Nesting', icon: '▣', flow: groupsFlow },
  { id: 'http', label: 'HTTP API', icon: '🌐', flow: httpFlow },
  { id: 'mqtt', label: 'MQTT Routing', icon: '📡', flow: mqttFlow },
  { id: 'mindmap', label: 'Mind Map', icon: '🧠', flow: mindFlow },
]

const active = ref('basic')
const opts = ref({ gridlines: true, labels: true, linklines: false, images: true })

const currentFlow = computed(() => demos.find((d) => d.id === active.value)?.flow ?? [])
</script>

<style>
html,
body,
#app {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fafafa;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
  background: #1e2433;
  color: #fff;
  font-size: 15px;
  flex-shrink: 0;
}
.header__logo {
  font-weight: 600;
}
.header__sub {
  color: #8899bb;
  font-size: 13px;
}

.tabs {
  display: flex;
  gap: 2px;
  padding: 8px 12px 0;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}
.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: #555;
  border-bottom: 2px solid transparent;
  transition:
    color 0.15s,
    border-color 0.15s;
}
.tab:hover {
  color: #1a56db;
}
.tab--active {
  color: #1a56db;
  border-bottom-color: #1a56db;
  font-weight: 600;
}
.tab__icon {
  font-size: 16px;
}

.options {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 6px 18px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 13px;
  flex-shrink: 0;
}
.opt {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  color: #444;
}
.opt--info {
  margin-left: auto;
  color: #888;
}
.opt--info code {
  background: #eee;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
}

.canvas-wrap {
  flex: 1;
  min-height: 0;
  position: relative;
}
.canvas {
  width: 100%;
  height: 100%;
}

.inspector {
  flex-shrink: 0;
  border-top: 1px solid #e2e8f0;
  background: #fff;
  font-size: 12px;
}
.inspector summary {
  padding: 6px 18px;
  cursor: pointer;
  color: #666;
  user-select: none;
}
.inspector__code {
  max-height: 200px;
  overflow: auto;
  padding: 10px 18px;
  background: #1e2433;
  color: #c9d1d9;
  font-size: 11px;
  line-height: 1.5;
}
</style>
