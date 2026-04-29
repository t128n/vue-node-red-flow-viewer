<template>
  <div
    class="nr-node--link"
    :class="{ 'nr-node--disabled': data.disabled }"
    :style="{
      width: '30px',
      height: '30px',
      backgroundColor: data.color || '#ddd',
      border: `1px solid ${data.stroke || 'rgb(153,153,153)'}`,
      borderRadius: 'var(--nr-node-radius, 5px)',
      position: 'relative',
      overflow: 'visible',
      boxShadow: 'var(--nr-node-shadow, 0 1px 4px rgba(0, 0, 0, 0.18))',
    }"
  >
    <img
      v-if="data.imageSrc"
      :src="data.imageSrc"
      :style="{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '28px',
        height: '28px',
        pointerEvents: 'none',
      }"
    />

    <!-- link out / link call receive input on the left -->
    <Handle
      v-if="data.nodeType !== 'link in'"
      id="input"
      type="target"
      :position="Position.Left"
      :style="handleStyle"
    />

    <!-- link in / link call send output on the right -->
    <Handle
      v-if="data.nodeType !== 'link out'"
      id="output-0"
      type="source"
      :position="Position.Right"
      :style="handleStyle"
    />

    <!-- Virtual handles for link-lines (always present but invisible) -->
    <Handle
      id="link-source"
      type="source"
      :position="Position.Right"
      style="opacity: 0; pointer-events: none; right: 0; top: 50%; transform: translateY(-50%)"
    />
    <Handle
      id="link-target"
      type="target"
      :position="Position.Left"
      style="opacity: 0; pointer-events: none; left: 0; top: 50%; transform: translateY(-50%)"
    />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import type { CSSProperties } from 'vue'

import type { FlowViewerNodeProps } from '~/types'

defineProps<FlowViewerNodeProps>()

const handleStyle: CSSProperties = {
  background: 'var(--nr-port-color, rgb(217,217,217))',
  border: '1px solid var(--nr-port-border-color, rgb(153,153,153))',
  width: '10px',
  height: '10px',
  borderRadius: '3px',
  top: '50%',
  transform: 'translateY(-50%)',
}
</script>
