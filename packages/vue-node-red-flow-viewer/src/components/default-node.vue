<template>
  <div
    class="nr-node"
    :class="{ 'nr-node--disabled': data.disabled }"
    :style="{
      width: data.width + 'px',
      height: data.height + 'px',
      backgroundColor: data.color,
      border: `1px solid ${data.stroke}`,
      borderRadius: 'var(--nr-node-radius, 5px)',
      position: 'relative',
      overflow: 'visible',
      boxSizing: 'border-box',
    }"
  >
    <!-- Left icon panel dark overlay -->
    <div
      class="nr-node__icon-panel"
      :style="{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '30px',
        height: '100%',
        background: 'rgba(0,0,0,0.1)',
        borderRadius:
          'calc(var(--nr-node-radius, 5px) - 1px) 0 0 calc(var(--nr-node-radius, 5px) - 1px)',
      }"
    />

    <!-- Vertical separator line -->
    <div
      :style="{
        position: 'absolute',
        left: '29.5px',
        top: '0.5px',
        width: '1px',
        height: data.height - 1 + 'px',
        background: 'rgba(0,0,0,0.1)',
      }"
    />

    <!-- Icon image -->
    <img
      v-if="data.imageSrc"
      :src="data.imageSrc"
      :style="{
        position: 'absolute',
        left: '1px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '28px',
        height: '28px',
        pointerEvents: 'none',
        objectFit: 'contain',
      }"
    />

    <!-- Label -->
    <div
      v-if="data.label?.length"
      :style="{
        position: 'absolute',
        left: '38px',
        top: 0,
        bottom: 0,
        right: '4px',
        fontSize: 'var(--nr-label-font-size, 14px)',
        fontFamily: 'var(--nr-font-family, Helvetica, sans-serif)',
        color: 'var(--nr-label-color, #000000)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        pointerEvents: 'none',
      }"
    >
      <div v-for="(line, i) in data.label" :key="i" style="line-height: 1.2">{{ line }}</div>
    </div>

    <!-- Input handle (left side, centered) -->
    <Handle
      v-if="data.hasInput"
      id="input"
      type="target"
      :position="Position.Left"
      :style="inputHandleStyle"
    />

    <!-- Output handles (right side, one per port) -->
    <Handle
      v-for="i in data.outputCount"
      :key="i - 1"
      :id="`output-${i - 1}`"
      type="source"
      :position="Position.Right"
      :style="outputHandleStyle(i - 1)"
    />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import type { CSSProperties } from 'vue'

import type { FlowViewerNodeProps } from '~/types'

const props = defineProps<FlowViewerNodeProps>()

const PORT_SIZE = 10

const portHandleBase: CSSProperties = {
  background: 'var(--nr-port-color, rgb(217,217,217))',
  border: '1px solid var(--nr-port-border-color, rgb(153,153,153))',
  width: PORT_SIZE + 'px',
  height: PORT_SIZE + 'px',
  borderRadius: '3px',
}

const inputHandleStyle: CSSProperties = {
  ...portHandleBase,
  left: `-${PORT_SIZE / 2}px`,
  top: '50%',
  transform: 'translateY(-50%)',
}

function outputHandleStyle(portIndex: number): CSSProperties {
  const { outputCount, height } = props.data
  const spacing = 13
  const totalHeight = (outputCount - 1) * spacing
  const startTop = (height - totalHeight) / 2
  const topPx = startTop + portIndex * spacing

  return {
    ...portHandleBase,
    right: `-${PORT_SIZE / 2}px`,
    top: `${topPx}px`,
    transform: 'translateY(-50%)',
  }
}
</script>

<style>
.nr-node--disabled {
  stroke-dasharray: 8, 3;
  opacity: 0.6;
}

/* VueFlow overrides for cleaner node rendering */
.vue-flow__node .nr-node .vue-flow__handle {
  border-radius: 3px !important;
}
</style>
