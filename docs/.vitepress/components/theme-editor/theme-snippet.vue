<script setup lang="ts">
defineProps<{
  copied: boolean
  cssSnippet: string
}>()

const emit = defineEmits<{
  copy: []
}>()
</script>

<template>
  <section class="theme-snippet" aria-label="Generated CSS">
    <div class="theme-snippet__header">
      <h2 class="theme-snippet__title">CSS Variables</h2>
      <button class="theme-snippet__button" type="button" @click="emit('copy')">
        {{ copied ? 'Copied' : 'Copy CSS' }}
      </button>
    </div>
    <pre class="theme-snippet__code"><code>{{ cssSnippet }}</code></pre>
  </section>
</template>

<style scoped>
.theme-snippet {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.theme-snippet__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 10px 12px;
}

.theme-snippet__title {
  margin: 0;
  border-top: 0;
  padding-top: 0;
  color: var(--vp-c-text-1);
  font-size: 15px;
  line-height: 1.3;
}

.theme-snippet__button[type='button'] {
  box-sizing: border-box;
  height: 34px;
  min-width: 88px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 6px;
  padding: 7px 11px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.theme-snippet__button[type='button']:hover {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}

.theme-snippet__button[type='button']:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.theme-snippet__code {
  margin: 0;
  max-height: 420px;
  overflow: auto;
  padding: 14px;
  color: var(--vp-c-text-1);
  font-size: 12px;
  line-height: 1.6;
  white-space: pre;
}
</style>
