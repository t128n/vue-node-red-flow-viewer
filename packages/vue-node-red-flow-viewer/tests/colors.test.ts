import { describe, it, expect } from 'vitest'

import { getNodeColor } from '~/utils/colors'

describe('getNodeColor', () => {
  it('returns correct fill for known types', () => {
    expect(getNodeColor({ type: 'function' }).fill).toBe('#fdd0a2')
    expect(getNodeColor({ type: 'debug' }).fill).toBe('#87a980')
    expect(getNodeColor({ type: 'inject' }).fill).toBe('#a6bbcf')
    expect(getNodeColor({ type: 'switch' }).fill).toBe('#E2D96E')
    expect(getNodeColor({ type: 'http in' }).fill).toBe('rgb(231, 231, 174)')
  })

  it('returns default orange for unknown type', () => {
    expect(getNodeColor({ type: 'some-unknown-node-type' }).fill).toBe('rgb(243, 181, 103)')
  })

  it('returns a stroke value for all known types', () => {
    for (const type of ['function', 'debug', 'inject', 'mqtt in', 'junction']) {
      const { stroke } = getNodeColor({ type })
      expect(stroke).toBeTruthy()
      expect(typeof stroke).toBe('string')
    }
  })

  it('obj.color overrides fill but preserves stroke from type', () => {
    const { fill, stroke } = getNodeColor({ type: 'function', color: '#abcdef' })
    expect(fill).toBe('#abcdef')
    expect(stroke).toBeTruthy() // still has function's stroke
  })

  it('obj.color on unknown type still overrides fill with default stroke', () => {
    const { fill, stroke } = getNodeColor({ type: 'exotic-node', color: '#112233' })
    expect(fill).toBe('#112233')
    expect(stroke).toBeTruthy()
  })

  it('junction has grey fill', () => {
    expect(getNodeColor({ type: 'junction' }).fill).toBe('rgb(217, 217, 217)')
  })

  it('link in/out/call all have #ddd fill', () => {
    for (const type of ['link in', 'link out', 'link call']) {
      expect(getNodeColor({ type }).fill).toBe('#ddd')
    }
  })

  it('erlang nodes are mapped', () => {
    expect(getNodeColor({ type: 'erlmodule' }).fill).toBe('#fdd0a2')
    expect(getNodeColor({ type: 'erlsupervisor' }).fill).toBe('#E9967A')
  })

  it('mindmap nodes are mapped', () => {
    expect(getNodeColor({ type: 'Topic' }).fill).toBe('#d0c9f6')
    expect(getNodeColor({ type: 'Idea' }).fill).toBe('#88baff')
  })
})
