<template>
  <div class="nr-group" :class="{ 'nr-group--disabled': data.disabled }" :style="containerStyle">
    <div v-if="showLabel" :style="labelStyle">{{ data.name }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

import type { FlowViewerGroupNodeProps } from '~/types'

const props = defineProps<FlowViewerGroupNodeProps>()

const showLabel = computed(() => props.data.style?.label && props.data.name)

const containerStyle = computed(() => {
  const s = props.data.style || {}
  const fill = s.fill === 'none' ? 'transparent' : s.fill || 'transparent'
  return {
    width: props.data.width + 'px',
    height: props.data.height + 'px',
    backgroundColor: fill,
    opacity: s['fill-opacity'] || 1,
    border: `2px solid ${s.stroke || 'grey'}`,
    borderRadius: 'var(--nr-group-radius, 5px)',
    position: 'relative',
    boxSizing: 'border-box',
    pointerEvents: 'none',
  } satisfies CSSProperties
})

const labelStyle = computed(() => {
  const pos = props.data.style?.['label-position'] || 'nw'
  const color = props.data.style?.color || 'var(--nr-label-color, #000000)'
  const base: CSSProperties = {
    position: 'absolute',
    color,
    fontSize: 'var(--nr-group-label-size, 12px)',
    fontFamily: 'var(--nr-font-family, Helvetica, sans-serif)',
    whiteSpace: 'nowrap',
    lineHeight: '16px',
    pointerEvents: 'none',
  }
  if (pos[0] === 'n') base.top = '4px'
  else base.bottom = '4px'
  if (pos[1] === 'w') {
    base.left = '4px'
    base.textAlign = 'left'
  } else if (pos[1] === 'e') {
    base.right = '5px'
    base.textAlign = 'right'
  } else {
    base.left = '50%'
    base.transform = 'translateX(-50%)'
    base.textAlign = 'center'
  }
  return base
})
</script>
