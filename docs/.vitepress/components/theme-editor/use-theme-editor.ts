import { computed, reactive, shallowRef } from 'vue'
import type { CSSProperties } from 'vue'

export type ThemeControlKind = 'color' | 'number' | 'text'

export interface ThemeVariableDefinition {
  name: string
  label: string
  description: string
  kind: ThemeControlKind
  defaultValue: string
  min?: number
  max?: number
  step?: number
}

export interface ThemeVariableGroup {
  title: string
  variables: ThemeVariableDefinition[]
}

const themeGroups: ThemeVariableGroup[] = [
  {
    title: 'Canvas',
    variables: [
      {
        name: '--nr-flow-bg',
        label: 'Background',
        description: 'Canvas background.',
        kind: 'color',
        defaultValue: '#f3f3f3',
      },
      {
        name: '--nr-grid-color',
        label: 'Grid',
        description: 'Grid dot color.',
        kind: 'color',
        defaultValue: '#d4d4d4',
      },
      {
        name: '--nr-border-color',
        label: 'Borders',
        description: 'Tab and control border color.',
        kind: 'color',
        defaultValue: '#c7c7c7',
      },
      {
        name: '--nr-accent-color',
        label: 'Accent',
        description: 'Active tab accent color.',
        kind: 'color',
        defaultValue: '#8f0000',
      },
    ],
  },
  {
    title: 'Nodes',
    variables: [
      {
        name: '--nr-node-radius',
        label: 'Node radius',
        description: 'Corner radius for standard nodes.',
        kind: 'number',
        defaultValue: '5px',
        min: 0,
        max: 18,
        step: 1,
      },
      {
        name: '--nr-group-radius',
        label: 'Group radius',
        description: 'Corner radius for groups.',
        kind: 'number',
        defaultValue: '5px',
        min: 0,
        max: 22,
        step: 1,
      },
      {
        name: '--nr-label-font-size',
        label: 'Label size',
        description: 'Node label font size.',
        kind: 'number',
        defaultValue: '14px',
        min: 10,
        max: 22,
        step: 1,
      },
      {
        name: '--nr-group-label-size',
        label: 'Group label size',
        description: 'Group label font size.',
        kind: 'number',
        defaultValue: '12px',
        min: 10,
        max: 20,
        step: 1,
      },
      {
        name: '--nr-label-color',
        label: 'Label color',
        description: 'Node and group label color.',
        kind: 'color',
        defaultValue: '#333333',
      },
      {
        name: '--nr-node-icon-panel-bg',
        label: 'Icon panel',
        description: 'Node icon strip background.',
        kind: 'text',
        defaultValue: 'rgba(0, 0, 0, 0.08)',
      },
      {
        name: '--nr-node-separator-color',
        label: 'Separator',
        description: 'Separator between the icon strip and label.',
        kind: 'text',
        defaultValue: 'rgba(0, 0, 0, 0.12)',
      },
      {
        name: '--nr-node-shadow',
        label: 'Shadow',
        description: 'Node box shadow.',
        kind: 'text',
        defaultValue: '0 1px 4px rgba(0, 0, 0, 0.18)',
      },
      {
        name: '--nr-font-family',
        label: 'Font',
        description: 'Viewer font family.',
        kind: 'text',
        defaultValue: "'Helvetica Neue', Arial, Helvetica, sans-serif",
      },
    ],
  },
  {
    title: 'Wires and Ports',
    variables: [
      {
        name: '--nr-wire-color',
        label: 'Wire',
        description: 'Wire color.',
        kind: 'color',
        defaultValue: '#999999',
      },
      {
        name: '--nr-wire-width',
        label: 'Wire width',
        description: 'Wire width.',
        kind: 'number',
        defaultValue: '3',
        min: 1,
        max: 8,
        step: 1,
      },
      {
        name: '--nr-port-color',
        label: 'Port fill',
        description: 'Port fill color.',
        kind: 'color',
        defaultValue: '#d9d9d9',
      },
      {
        name: '--nr-port-border-color',
        label: 'Port border',
        description: 'Port border color.',
        kind: 'color',
        defaultValue: '#999999',
      },
    ],
  },
  {
    title: 'Tabs and Controls',
    variables: [
      {
        name: '--nr-tab-bg',
        label: 'Tab bar',
        description: 'Tab bar background.',
        kind: 'color',
        defaultValue: '#eeeeee',
      },
      {
        name: '--nr-tab-active-bg',
        label: 'Active tab',
        description: 'Active tab background.',
        kind: 'color',
        defaultValue: '#ffffff',
      },
      {
        name: '--nr-tab-hover-bg',
        label: 'Tab hover',
        description: 'Tab hover background.',
        kind: 'color',
        defaultValue: '#f8f8f8',
      },
      {
        name: '--nr-tab-text',
        label: 'Tab text',
        description: 'Inactive tab text color.',
        kind: 'color',
        defaultValue: '#666666',
      },
      {
        name: '--nr-tab-active-text',
        label: 'Active text',
        description: 'Active tab text color.',
        kind: 'color',
        defaultValue: '#333333',
      },
      {
        name: '--nr-btn-bg',
        label: 'Button',
        description: 'Control button background.',
        kind: 'color',
        defaultValue: '#f8f8f8',
      },
      {
        name: '--nr-btn-bg-hover',
        label: 'Button hover',
        description: 'Control button hover background.',
        kind: 'color',
        defaultValue: '#ffffff',
      },
    ],
  },
]

const darkPreset: Record<string, string> = {
  '--nr-flow-bg': '#1e1e2e',
  '--nr-grid-color': '#374151',
  '--nr-border-color': '#4b5563',
  '--nr-accent-color': '#ff6b6b',
  '--nr-wire-color': '#94a3b8',
  '--nr-port-color': '#4b5563',
  '--nr-port-border-color': '#94a3b8',
  '--nr-tab-bg': '#111827',
  '--nr-tab-active-bg': '#1f2937',
  '--nr-tab-hover-bg': '#273244',
  '--nr-tab-text': '#cbd5e1',
  '--nr-tab-active-text': '#ffffff',
  '--nr-btn-bg': '#1f2937',
  '--nr-btn-bg-hover': '#374151',
}

const warmPreset: Record<string, string> = {
  '--nr-flow-bg': '#fff7ed',
  '--nr-grid-color': '#fed7aa',
  '--nr-border-color': '#fdba74',
  '--nr-accent-color': '#c2410c',
  '--nr-wire-color': '#9a3412',
  '--nr-tab-bg': '#ffedd5',
  '--nr-tab-active-bg': '#ffffff',
  '--nr-tab-hover-bg': '#fed7aa',
  '--nr-tab-text': '#7c2d12',
  '--nr-tab-active-text': '#431407',
  '--nr-btn-bg': '#fff7ed',
  '--nr-btn-bg-hover': '#ffffff',
}

const allVariables = themeGroups.flatMap((group) => group.variables)

function getDefaultValues(): Record<string, string> {
  return Object.fromEntries(allVariables.map((variable) => [variable.name, variable.defaultValue]))
}

function formatCssValue(variable: ThemeVariableDefinition, value: string): string {
  if (variable.kind !== 'number') {
    return value.trim()
  }

  const numericValue = Number.parseFloat(value)

  if (!Number.isFinite(numericValue)) {
    return variable.defaultValue
  }

  return variable.defaultValue.endsWith('px') ? `${numericValue}px` : String(numericValue)
}

export function useThemeEditor() {
  const values = reactive(getDefaultValues())
  const copied = shallowRef(false)

  const previewStyle = computed<CSSProperties>(
    () =>
      Object.fromEntries(
        allVariables.map((variable) => [
          variable.name,
          formatCssValue(variable, values[variable.name]),
        ]),
      ) as CSSProperties,
  )

  const cssSnippet = computed(() => {
    const declarations = allVariables
      .map((variable) => `  ${variable.name}: ${formatCssValue(variable, values[variable.name])};`)
      .join('\n')

    return `.flow-viewer {\n  height: 520px;\n${declarations}\n}`
  })

  function applyPreset(preset: Record<string, string>): void {
    for (const variable of allVariables) {
      values[variable.name] = preset[variable.name] ?? variable.defaultValue
    }
  }

  function reset(): void {
    applyPreset({})
  }

  function updateValue(name: string, value: string): void {
    values[name] = value
  }

  async function copyCss(): Promise<void> {
    await navigator.clipboard.writeText(cssSnippet.value)
    copied.value = true
    window.setTimeout(() => {
      copied.value = false
    }, 1800)
  }

  return {
    copied,
    cssSnippet,
    darkPreset,
    previewStyle,
    reset,
    themeGroups,
    values,
    warmPreset,
    copyCss,
    applyPreset,
    updateValue,
  }
}
