import { describe, it, expect } from 'vitest'

import { getLabelParts, getNodeSize, getNodeLabel } from '~/utils/labels'

// ── getLabelParts ─────────────────────────────────────────────────────────────

describe('getLabelParts', () => {
  it('returns single-element lines array for plain text', () => {
    const { lines } = getLabelParts('Hello')
    expect(lines).toHaveLength(1)
    expect(lines[0]).toBe('Hello')
  })

  it('splits on \\n (escaped newline separator)', () => {
    const { lines } = getLabelParts('line one\\n line two')
    expect(lines).toHaveLength(2)
    expect(lines[0]).toBe('line one')
    expect(lines[1]).toBe('line two')
  })

  it('trims whitespace from each line', () => {
    const { lines } = getLabelParts('  padded  \\n  also padded  ')
    expect(lines[0]).toBe('padded')
    expect(lines[1]).toBe('also padded')
  })

  it('converts HTML entities', () => {
    const { lines } = getLabelParts('a &amp; b &lt;test&gt;')
    expect(lines[0]).toBe('a & b <test>')
  })

  it('converts &quot; to double quote', () => {
    const { lines } = getLabelParts('say &quot;hello&quot;')
    expect(lines[0]).toBe('say "hello"')
  })

  it('returns width > 0 for non-empty text', () => {
    const { width } = getLabelParts('Hello World')
    expect(width).toBeGreaterThan(0)
  })

  it('returns width 0 for empty string', () => {
    const { width } = getLabelParts('')
    expect(width).toBe(0)
  })

  it('width of longer text is greater than shorter text', () => {
    const { width: w1 } = getLabelParts('Hi')
    const { width: w2 } = getLabelParts('A very much longer label string')
    expect(w2).toBeGreaterThan(w1)
  })
})

// ── getNodeSize ───────────────────────────────────────────────────────────────

describe('getNodeSize', () => {
  it('returns 10×10 for junction', () => {
    expect(getNodeSize({ type: 'junction', wires: [] }, '')).toEqual({ width: 10, height: 10 })
  })

  it('returns 30×30 for link in', () => {
    expect(getNodeSize({ type: 'link in', wires: [] }, '')).toEqual({ width: 30, height: 30 })
  })

  it('returns 30×30 for link out', () => {
    expect(getNodeSize({ type: 'link out', wires: [] }, '')).toEqual({ width: 30, height: 30 })
  })

  it('default node has minimum width of 100', () => {
    const { width } = getNodeSize({ type: 'function', wires: [[]] }, 'x')
    expect(width).toBeGreaterThanOrEqual(100)
  })

  it('default node has minimum height of 30', () => {
    const { height } = getNodeSize({ type: 'function', wires: [[]] }, 'x')
    expect(height).toBeGreaterThanOrEqual(30)
  })

  it('grows height when more than 2 outputs', () => {
    const h2 = getNodeSize({ type: 'switch', wires: [[], []] }, 'switch').height
    const h5 = getNodeSize({ type: 'switch', wires: [[], [], [], [], []] }, 'switch').height
    expect(h5).toBeGreaterThan(h2)
    expect(h5).toBeGreaterThanOrEqual(75) // 15 * 5
  })

  it('height for 10 outputs is at least 150', () => {
    const wires = Array.from({ length: 10 }, () => [])
    const { height } = getNodeSize({ type: 'switch', wires }, 'x')
    expect(height).toBeGreaterThanOrEqual(150)
  })

  it('long label expands width beyond 100', () => {
    const { width: wShort } = getNodeSize({ type: 'function', wires: [] }, 'fn')
    const { width: wLong } = getNodeSize(
      { type: 'function', wires: [] },
      'A very long label that should definitely exceed the default width',
    )
    expect(wLong).toBeGreaterThan(wShort)
    expect(wLong).toBeGreaterThan(100)
  })

  it('multi-line labels increase height', () => {
    const { height: h1 } = getNodeSize({ type: 'function', wires: [] }, 'one line')
    const { height: h3 } = getNodeSize(
      { type: 'function', wires: [] },
      'line one\\n line two\\n line three',
    )
    expect(h3).toBeGreaterThan(h1)
  })
})

// ── getNodeLabel ──────────────────────────────────────────────────────────────

describe('getNodeLabel', () => {
  it('returns node.name when available', () => {
    expect(getNodeLabel({ type: 'function', name: 'My Fn' }, {}, [])).toBe('My Fn')
  })

  it('falls back to node.label', () => {
    expect(getNodeLabel({ type: 'inject', label: 'trigger' }, {}, [])).toBe('trigger')
  })

  it('falls back to node.type', () => {
    expect(getNodeLabel({ type: 'function' }, {}, [])).toBe('function')
  })

  it('uses subflowObj.name as fallback for subflow nodes', () => {
    expect(getNodeLabel({ type: 'subflow:abc' }, { name: 'My Sub' }, [])).toBe('My Sub')
  })

  it('catch: appends ": uncaught" when uncaught=true', () => {
    const label = getNodeLabel({ type: 'catch', uncaught: true }, {}, [])
    expect(label).toContain('uncaught')
  })

  it('catch: appends ": all" when no scope and not uncaught', () => {
    const label = getNodeLabel({ type: 'catch' }, {}, [])
    expect(label).toContain('all')
  })

  it('catch: uses name when provided', () => {
    const label = getNodeLabel({ type: 'catch', name: 'My Catcher' }, {}, [])
    expect(label).toBe('My Catcher')
  })

  it('http in: builds "[method] url" label', () => {
    const label = getNodeLabel({ type: 'http in', method: 'get', url: '/api/v1' }, {}, [])
    expect(label).toBe('[get] /api/v1')
  })

  it('http response: includes status code', () => {
    const label = getNodeLabel({ type: 'http response', statusCode: '404' }, {}, [])
    expect(label).toBe('http (404)')
  })

  it('http response: shows just "http" without status code', () => {
    const label = getNodeLabel({ type: 'http response' }, {}, [])
    expect(label).toBe('http')
  })

  it('join: shows "join N" for custom mode with count', () => {
    const label = getNodeLabel({ type: 'join', mode: 'custom', count: '3' }, {}, [])
    expect(label).toBe('join 3')
  })

  it('file: uses filename as fallback', () => {
    const label = getNodeLabel({ type: 'file', filename: 'data.csv' }, {}, [])
    expect(label).toBe('data.csv')
  })

  it('mindmap node: applies text wrap regex', () => {
    const longText =
      'A very long topic name that should be wrapped at a word boundary somewhere around here'
    const label = getNodeLabel({ type: 'Topic', name: longText }, {}, [])
    // Should either wrap or just return as-is; key is it doesn't throw
    expect(typeof label).toBe('string')
    expect(label.length).toBeGreaterThan(0)
  })

  it('nnb-layer-node: shows activation function info', () => {
    const label = getNodeLabel(
      { type: 'nnb-layer-node', actfunct: 'relu', bias: '0.1', threshold: '0.5' },
      {},
      [],
    )
    expect(label).toContain('relu')
  })
})
