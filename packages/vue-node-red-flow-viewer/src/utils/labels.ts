import type { NodeRedNode } from '~/types'

// Canvas-based text measurement — no DOM insertion needed
let measureCanvas: HTMLCanvasElement | null = null

function measureText(text: string): number {
  if (typeof document === 'undefined') return (text?.length || 0) * 7.5
  if (!measureCanvas) measureCanvas = document.createElement('canvas')
  const ctx = measureCanvas.getContext('2d')
  if (!ctx) return (text?.length || 0) * 7.5 // jsdom / headless fallback
  ctx.font = '14px Helvetica'
  return ctx.measureText(text || '').width
}

function convertHtmlEntities(text: string): string {
  const map = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    '#39': "'",
    '#x2F': '/',
    '#x60': '`',
    '#x3D': '=',
  }
  return text.replace(/[&]([^;]+);/g, (e, m: keyof typeof map) => map[m] || e)
}

function convertLineBreakCharacter(str: string): string[] {
  const result: string[] = []
  const lines = str.split(/\\n /)
  if (lines.length > 1) {
    let i = 0
    for (i = 0; i < lines.length - 1; i++) {
      if (/\\$/.test(lines[i])) {
        result.push(lines[i] + '\\n ' + lines[i + 1])
        i++
      } else {
        result.push(lines[i])
      }
    }
    if (i === lines.length - 1) result.push(lines[lines.length - 1])
  } else {
    result.push(...lines)
  }
  return result.map((l) => convertHtmlEntities(l.replace(/\\\\n /g, '\\n ').trim()))
}

export function getLabelParts(str: string): { lines: string[]; width: number } {
  const lines = convertLineBreakCharacter(str || '')
  const width = Math.max(...lines.map((l) => measureText(l)), 0)
  return { lines, width }
}

export function getNodeSize(
  obj: Pick<NodeRedNode, 'type' | 'wires'>,
  labelText: string,
): { width: number; height: number } {
  const byType: Record<string, { width: number; height: number }> = {
    junction: { width: 10, height: 10 },
    'link in': { width: 30, height: 30 },
    'link out': { width: 30, height: 30 },
  }
  if (byType[obj.type]) return byType[obj.type]

  const { lines, width: textWidth } = getLabelParts(labelText || '')
  const txtW = textWidth + 60

  let width = Math.max(100, txtW)
  let height = 30 // Node-RED standard height

  // Scale height only if there are many output ports
  const wireCount = (obj.wires || []).length
  if (wireCount > 2) height = Math.max(height, 15 * wireCount)
  // Scale height if there are multiple lines (rare in standard NR nodes but possible)
  if (lines.length > 1) height = Math.max(height, lines.length * 20 + 4)

  return { width, height }
}

// ── Label functions (ported from labelByFunct.js) ─────────────────────────

type LabelFn = (obj: NodeRedNode, sub: Partial<NodeRedNode>, flowdata: NodeRedNode[]) => string

const defaultLabel: LabelFn = (obj, sub) =>
  obj.name || obj.label || obj.text || sub?.name || obj.type

const mindMapLabel: LabelFn = (obj) =>
  (obj.name || obj.label || obj.info || obj.text || '').replace(/(.{40,60})([ \n\t])/g, '$1\\n$2') +
  (obj.sumPass ? ' ⭄' : '') +
  (obj.sumPassPrio && parseInt(String(obj.sumPassPrio)) !== 0 ? ` (${obj.sumPassPrio})` : '')

const catchLabel: LabelFn = (obj) => {
  let sub = ''
  if (obj.uncaught) sub = ': uncaught'
  else if (obj.scope) sub = ': ' + obj.scope.length
  else sub = ': all'
  return obj.name || obj.type + sub
}

const linkCallLabel: LabelFn = (obj, _sub, flowdata) => {
  if (!obj.links?.length) return obj.name || obj.type
  let lbl
  for (const n of flowdata || []) {
    if (n.id === obj.links[0]) {
      lbl = (labelFnByType[n.type] || defaultLabel)(n, {}, flowdata)
      break
    }
  }
  return obj.name || lbl || obj.type
}

const joinLabel: LabelFn = (obj, sub, flowdata) =>
  obj.mode === 'custom' && obj.count ? `join ${obj.count}` : defaultLabel(obj, sub, flowdata)

const yaml2FlowLabel: LabelFn = (obj, sub, flowdata) => {
  if (obj.yamlurl?.trim()) {
    const parts = obj.yamlurl.split('/')
    parts.pop()
    const q = parts.pop()
    const p = parts.pop()
    return obj.name || `${p}/${q}` || obj.type
  }
  return defaultLabel(obj, sub, flowdata)
}

const labelFnByType: Record<string, LabelFn> = {
  catch: catchLabel,
  file: (obj) => obj.name || obj.filename || obj.type,
  'file in': (obj) => obj.name || obj.filename || obj.type,
  'http response': (obj) => obj.name || 'http' + (obj.statusCode ? ` (${obj.statusCode})` : ''),
  'http in': (obj) => obj.name || `[${obj.method}] ${obj.url}`,
  join: joinLabel,
  'link call': linkCallLabel,
  BlogPageInfo: (obj, _sub, flowdata) => {
    if (obj.name) return obj.name
    for (const n of flowdata || []) {
      if (
        n.type === 'link in' &&
        n.name?.startsWith('[blog] ') &&
        (n.wires?.[0] || []).includes(obj.id)
      ) {
        return n.name.substring(7)
      }
    }
    return obj.type
  },
  Topic: mindMapLabel,
  Observation: mindMapLabel,
  Question: mindMapLabel,
  Thought: mindMapLabel,
  Idea: mindMapLabel,
  Analogy: mindMapLabel,
  Aphorism: mindMapLabel,
  Poesie: mindMapLabel,
  Humour: mindMapLabel,
  Treasure: mindMapLabel,
  Consequence: mindMapLabel,
  Advantage: mindMapLabel,
  Disadvantage: mindMapLabel,
  Text: mindMapLabel,
  'Blog-Post': mindMapLabel,
  Comment: mindMapLabel,
  Codebase: mindMapLabel,
  Sketch: mindMapLabel,
  Inspiration: mindMapLabel,
  Quote: mindMapLabel,
  Definition: mindMapLabel,
  Book: mindMapLabel,
  Author: mindMapLabel,
  'nnb-layer-node': (obj) => obj.name || `${obj.actfunct}: ${obj.bias}, ${obj.threshold}`,
  FlowHubPull: (obj) => obj.name || obj.flowname || obj.type,
  FlowHubPush: (obj) => obj.name || obj.flowname || obj.type,
  JsonSchemaValidatorWithDocu: (obj) => obj.name || obj.schematitle || obj.type,
  Flow2UML: (obj) => obj.name || obj.type,
  AutoAlign: (obj) => obj.name || obj.algname || obj.type,
  PkgFile: (obj) => obj.name || obj.filename || obj.type,
  'tcp in': (obj) => obj.name || `${obj.type} ${obj.port}`,
  'udp in': (obj) => obj.name || `${obj.type} ${obj.port}`,
  Yaml2Flow: yaml2FlowLabel,
  _default: defaultLabel,
}

export function getNodeLabel(
  obj: NodeRedNode,
  subflowObj: Partial<NodeRedNode>,
  flowdata: NodeRedNode[],
): string {
  const fn = labelFnByType[obj.type] || labelFnByType['_default']
  return (fn || defaultLabel)(obj, subflowObj || {}, flowdata || [])
}
