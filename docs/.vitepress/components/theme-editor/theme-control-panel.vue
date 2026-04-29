<script setup lang="ts">
import type { ThemeVariableGroup } from './use-theme-editor'

const props = defineProps<{
  groups: ThemeVariableGroup[]
  values: Record<string, string>
}>()

const emit = defineEmits<{
  applyDarkPreset: []
  applyWarmPreset: []
  reset: []
  updateValue: [name: string, value: string]
}>()

function updateValue(name: string, event: Event): void {
  const target = event.target as HTMLInputElement
  emit('updateValue', name, target.value)
}

function getRangeValue(name: string): number {
  const value = Number.parseFloat(props.values[name])

  return Number.isFinite(value) ? value : 0
}
</script>

<template>
  <section class="theme-controls" aria-label="Theme controls">
    <div class="theme-controls__actions">
      <button class="theme-controls__button" type="button" @click="emit('reset')">Reset</button>
      <button class="theme-controls__button" type="button" @click="emit('applyDarkPreset')">
        Dark
      </button>
      <button class="theme-controls__button" type="button" @click="emit('applyWarmPreset')">
        Warm
      </button>
    </div>

    <div v-for="group in groups" :key="group.title" class="theme-controls__group">
      <h2 class="theme-controls__title">{{ group.title }}</h2>
      <label v-for="variable in group.variables" :key="variable.name" class="theme-controls__field">
        <span class="theme-controls__label">
          <span>{{ variable.label }}</span>
          <code>{{ variable.name }}</code>
        </span>
        <span class="theme-controls__input-row">
          <input
            v-if="variable.kind === 'color'"
            class="theme-controls__color"
            type="color"
            :value="values[variable.name]"
            :aria-label="`${variable.label} color`"
            @input="updateValue(variable.name, $event)"
          />
          <input
            v-else-if="variable.kind === 'number'"
            class="theme-controls__range"
            type="range"
            :min="variable.min"
            :max="variable.max"
            :step="variable.step"
            :value="getRangeValue(variable.name)"
            :aria-label="variable.label"
            @input="updateValue(variable.name, $event)"
          />
          <input
            class="theme-controls__input"
            type="text"
            :value="values[variable.name]"
            :aria-label="`${variable.label} value`"
            @input="updateValue(variable.name, $event)"
          />
        </span>
        <span class="theme-controls__description">{{ variable.description }}</span>
      </label>
    </div>
  </section>
</template>

<style scoped>
.theme-controls {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

.theme-controls__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.theme-controls__button[type='button'] {
  box-sizing: border-box;
  height: 34px;
  min-width: 70px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 7px 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.theme-controls__button[type='button']:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.theme-controls__group {
  display: grid;
  gap: 12px;
}

.theme-controls__title {
  margin: 0;
  border-top: 0;
  padding-top: 0;
  color: var(--vp-c-text-1);
  font-size: 16px;
  line-height: 1.3;
}

.theme-controls__field {
  display: grid;
  gap: 7px;
}

.theme-controls__label {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
}

.theme-controls__label code {
  color: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 500;
}

.theme-controls__input-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 8px;
  align-items: center;
}

.theme-controls__range {
  grid-column: 1 / -1;
  width: 100%;
  accent-color: var(--vp-c-brand-1);
}

.theme-controls__color {
  box-sizing: border-box;
  width: 34px;
  height: 34px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 2px;
  background: var(--vp-c-bg);
}

.theme-controls__input[type='text'] {
  box-sizing: border-box;
  width: 100%;
  height: 34px;
  min-width: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 7px 9px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 13px;
  line-height: 1.2;
}

.theme-controls__range + .theme-controls__input[type='text'] {
  grid-column: 1 / -1;
}

.theme-controls__input:focus-visible,
.theme-controls__color:focus-visible,
.theme-controls__button[type='button']:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.theme-controls__description {
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.4;
}
</style>
