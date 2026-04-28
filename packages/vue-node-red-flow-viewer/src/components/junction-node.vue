<template>
  <div
    class="nr-node--junction"
    :class="{ 'nr-node--disabled': data.disabled }"
    :style="{
      width: '10px',
      height: '10px',
      backgroundColor: 'var(--nr-port-color, rgb(217,217,217))',
      border: `1px solid var(--nr-port-border-color, rgb(153,153,153))`,
      borderRadius: '2px',
      position: 'relative',
    }"
  >
    <Handle id="input" type="target" :position="Position.Left" :style="handleStyle('left')" />
    <Handle id="output-0" type="source" :position="Position.Right" :style="handleStyle('right')" />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import type { CSSProperties } from 'vue'

import type { FlowViewerNodeProps } from '~/types'

defineProps<FlowViewerNodeProps>()

function handleStyle(side: 'left' | 'right'): CSSProperties {
  return {
    background: 'var(--nr-port-color, rgb(217,217,217))',
    border: '1px solid var(--nr-port-border-color, rgb(153,153,153))',
    width: '6px',
    height: '6px',
    borderRadius: '2px',
    top: '50%',
    transform: 'translateY(-50%)',
    [side === 'left' ? 'left' : 'right']: '-3px',
  }
}
</script>
