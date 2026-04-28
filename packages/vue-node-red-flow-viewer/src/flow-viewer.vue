<template>
  <div class="nr-flowviewer">
    <!-- Tab Bar -->
    <div v-if="tabs.length > 1" class="nr-flowviewer__tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="nr-flowviewer__tab"
        :class="{ 'nr-flowviewer__tab--active': activeTabId === tab.id }"
        @click="selectTab(tab.id)"
      >
        {{ tab.label || tab.id }}
      </button>
    </div>

    <!-- Controls Overlay -->
    <div class="nr-flowviewer__controls">
      <button class="nr-flowviewer__btn" title="Fit View" @click="resetZoom">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
        >
          <path d="M15 3h6v6M9 21H3v-6M21 15v6h-6M3 9V3h6" />
        </svg>
      </button>
      <button class="nr-flowviewer__btn" title="Copy Flow JSON" @click="copyFlow">
        <svg
          v-if="!copied"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          width="16"
          height="16"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
    </div>

    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :node-types="nodeTypes"
      :fit-view-on-init="true"
      :nodes-draggable="false"
      :nodes-connectable="false"
      :elements-selectable="false"
      :zoom-on-scroll="true"
      :pan-on-drag="true"
      @pane-ready="onPaneReady"
      @nodes-initialized="onNodesInitialized"
      :default-edge-options="{
        type: 'default',
        style: {
          stroke: 'var(--nr-wire-color, #999)',
          strokeWidth: 'var(--nr-wire-width, 3)',
        },
      }"
    >
      <Background
        v-if="options.gridlines"
        variant="dots"
        :gap="20"
        :size="1.5"
        :pattern-color="'var(--nr-grid-color, #d1d5db)'"
      />
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { Background } from '@vue-flow/background'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import type { FitViewParams } from '@vue-flow/core'
import { ref, computed, markRaw, watch, nextTick } from 'vue'

import '@vue-flow/core/dist/style.css'

import DefaultNode from '~/components/default-node.vue'
import GroupNode from '~/components/group-node.vue'
import JunctionNode from '~/components/junction-node.vue'
import LinkNode from '~/components/link-node.vue'
import { transformFlow } from '~/composables/use-node-red-transform'
import type {
  FlowTab,
  FlowViewerEdge,
  FlowViewerNode,
  FlowViewerOptions,
  NodeRedNode,
} from '~/types'

export interface FlowViewerProps {
  flowData: NodeRedNode[]
  flowId?: string | null
  options?: FlowViewerOptions
  autoFitView?: boolean
  fitViewOptions?: FitViewParams
}

const props = withDefaults(defineProps<FlowViewerProps>(), {
  flowId: null,
  options: () => ({
    arrows: false,
    gridlines: true,
    images: true,
    linklines: false,
    labels: true,
  }),
  autoFitView: true,
  fitViewOptions: () => ({ padding: 0.1 }),
})

interface LifecyclePayload {
  flowId: string | null
  tab: FlowTab | null
  tabs: FlowTab[]
  nodes: FlowViewerNode[]
  edges: FlowViewerEdge[]
  paneReady: boolean
  [key: string]: unknown
}

const emit = defineEmits<{
  'pane-ready': [payload: LifecyclePayload]
  'nodes-initialized': [payload: LifecyclePayload]
  'tab-change': [payload: LifecyclePayload]
  'viewport-fit': [payload: LifecyclePayload]
  copy: [payload: LifecyclePayload]
  'update:flowId': [flowId: string]
}>()

const { fitView } = useVueFlow()
const activeTabId = ref<string | null>(props.flowId)
const copied = ref(false)
const paneReady = ref(false)

const nodeTypes = markRaw({
  default: DefaultNode,
  junction: JunctionNode,
  link: LinkNode,
  nrGroup: GroupNode,
})

const tabs = computed(() => {
  const t: FlowTab[] = []
  for (const n of props.flowData) {
    if (n.type === 'subflow') {
      t.push({ id: n.id, label: n.name || n.id, type: 'subflow' })
    }
    if (n.type === 'tab') {
      t.push({ id: n.id, label: n.label || n.id, type: 'tab' })
    }
  }
  // If no tabs/subflows found, check if there's any 'z' property we can use
  if (t.length === 0) {
    const zs = new Set<string>()
    for (const n of props.flowData) if (n.z) zs.add(n.z)
    for (const z of zs) t.push({ id: z, label: z, type: 'unknown' })
  }
  return t
})

const activeTab = computed(() => tabs.value.find((tab) => tab.id === activeTabId.value) || null)

// Initialize active tab if not set
watch(
  () => tabs.value,
  (newTabs) => {
    if (!activeTabId.value && newTabs.length > 0) {
      activeTabId.value = newTabs[0].id
    }
  },
  { immediate: true },
)

watch(
  () => props.flowId,
  (flowId) => {
    if (flowId && flowId !== activeTabId.value) {
      activeTabId.value = flowId
    }
  },
)

const transformed = computed(() => {
  if (!activeTabId.value) return { nodes: [], edges: [] }
  return transformFlow(props.flowData, activeTabId.value, props.options)
})

const nodes = computed(() => transformed.value.nodes)
const edges = computed(() => transformed.value.edges)

watch(
  [activeTabId, nodes],
  () => {
    autoFitFlowView('content-change')
  },
  { flush: 'post' },
)

function getLifecyclePayload(extra: Record<string, unknown> = {}): LifecyclePayload {
  return {
    flowId: activeTabId.value,
    tab: activeTab.value,
    tabs: tabs.value,
    nodes: nodes.value,
    edges: edges.value,
    paneReady: paneReady.value,
    ...extra,
  }
}

function selectTab(tabId: string): void {
  if (tabId === activeTabId.value) return

  const previousFlowId = activeTabId.value
  activeTabId.value = tabId
  emit('update:flowId', tabId)
  emit('tab-change', getLifecyclePayload({ previousFlowId }))
}

function fitFlowView(reason = 'manual'): Promise<boolean> {
  if (!paneReady.value) return Promise.resolve(false)

  return nextTick(() => {
    return fitView(props.fitViewOptions).then((fitted) => {
      emit('viewport-fit', getLifecyclePayload({ reason, fitted }))
      return fitted
    })
  })
}

function autoFitFlowView(reason: string): Promise<boolean> {
  if (!props.autoFitView) return Promise.resolve(false)
  return fitFlowView(reason)
}

function onPaneReady(instance: unknown): void {
  paneReady.value = true
  emit('pane-ready', getLifecyclePayload({ instance }))
  autoFitFlowView('pane-ready')
}

function onNodesInitialized(): void {
  emit('nodes-initialized', getLifecyclePayload())
  autoFitFlowView('nodes-initialized')
}

function resetZoom(): Promise<boolean> {
  return fitFlowView('reset')
}

function copyFlow(): void {
  const flowJson = JSON.stringify(props.flowData, null, 2)
  navigator.clipboard.writeText(flowJson).then(() => {
    copied.value = true
    emit('copy', getLifecyclePayload({ flowJson }))
    setTimeout(() => (copied.value = false), 2000)
  })
}

defineExpose({
  activeTabId,
  tabs,
  nodes,
  edges,
  fitView: fitFlowView,
  resetZoom,
  selectTab,
})
</script>

<style>
.nr-flowviewer {
  --nr-flow-bg: #ffffff;
  --nr-grid-color: #d1d5db;
  --nr-node-radius: 5px;
  --nr-wire-color: #999;
  --nr-wire-width: 3;
  --nr-font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --nr-label-font-size: 14px;
  --nr-port-color: rgb(217, 217, 217);
  --nr-port-border-color: rgb(153, 153, 153);
  --nr-group-radius: 5px;
  --nr-group-label-size: 12px;
  --nr-tab-bg: #f1f5f9;
  --nr-tab-active-bg: #ffffff;
  --nr-tab-text: #64748b;
  --nr-tab-active-text: #0f172a;

  width: 100%;
  height: 100%;
  background-color: var(--nr-flow-bg);
  font-family: var(--nr-font-family);
  position: relative;
  display: flex;
  flex-direction: column;
}

.nr-flowviewer__tabs {
  display: flex;
  background: var(--nr-tab-bg);
  padding: 4px 4px 0;
  gap: 2px;
  border-bottom: 1px solid var(--nr-grid-color);
  flex-shrink: 0;
  overflow-x: auto;
}

.nr-flowviewer__tab {
  padding: 6px 16px;
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  font-size: 12px;
  cursor: pointer;
  color: var(--nr-tab-text);
  white-space: nowrap;
  transition: all 0.2s;
}

.nr-flowviewer__tab:hover {
  background: rgba(255, 255, 255, 0.5);
}

.nr-flowviewer__tab--active {
  background: var(--nr-tab-active-bg);
  border-color: var(--nr-grid-color);
  color: var(--nr-tab-active-text);
  font-weight: 600;
}

.nr-flowviewer__controls {
  position: absolute;
  right: 12px;
  bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
}

.nr-flowviewer__btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid var(--nr-grid-color);
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  color: var(--nr-tab-text);
  transition: all 0.2s;
}

.nr-flowviewer__btn:hover {
  background: #f8fafc;
  color: var(--nr-tab-active-text);
  border-color: var(--nr-tab-text);
}

/* Edge styles */
.vue-flow__edge.nr-link-disabled .vue-flow__edge-path {
  stroke: rgb(204, 204, 204);
  stroke-dasharray: 10, 8;
  stroke-width: 2;
}

.vue-flow__edge.nr-link-dashed .vue-flow__edge-path {
  stroke: var(--nr-wire-color, #999);
  stroke-width: 2;
  stroke-dasharray: 25, 4;
}

.vue-flow__node.selected > div {
  box-shadow: none;
}

.vue-flow__node[data-id] .nr-group {
  pointer-events: none;
}

.vue-flow__background {
  background-color: var(--nr-flow-bg);
}
</style>
