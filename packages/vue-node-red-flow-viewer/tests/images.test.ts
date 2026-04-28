import { describe, it, expect, beforeEach } from 'vitest'

import { getImageSrc, setImageContent } from '~/utils/images'

beforeEach(() => {
  // Reset content before each test
  setImageContent({})
})

describe('getImageSrc', () => {
  it('returns null for unknown type when no content is loaded', () => {
    expect(getImageSrc({ type: 'some-unknown-node' })).toBeNull()
  })

  it('returns null for known type when content dict is empty', () => {
    expect(getImageSrc({ type: 'function' })).toBeNull()
  })

  it('returns src after setImageContent registers the filename', () => {
    setImageContent({ 'function.svg': 'data:image/svg+xml;base64,TEST' })
    expect(getImageSrc({ type: 'function' })).toBe('data:image/svg+xml;base64,TEST')
  })

  it('returns null when the mapped filename is missing from content', () => {
    setImageContent({ 'debug.svg': 'data:...' })
    expect(getImageSrc({ type: 'function' })).toBeNull() // function.svg not in dict
  })

  it('uses subflow.svg fallback for subflow type with no icon', () => {
    setImageContent({ 'subflow.svg': 'data:subflow' })
    expect(getImageSrc({ type: 'subflow:abc123' }, {})).toBe('data:subflow')
  })

  it('uses subflowObj.icon over subflow.svg', () => {
    setImageContent({ 'subflow.svg': 'data:generic', 'custom-icon.svg': 'data:custom' })
    expect(getImageSrc({ type: 'subflow:abc' }, { icon: 'custom-icon.svg' })).toBe('data:custom')
  })

  it('returns null for subflow type when neither icon nor subflow.svg is in content', () => {
    setImageContent({})
    expect(getImageSrc({ type: 'subflow:abc' }, {})).toBeNull()
  })

  it('handles link-out mode type key lookup (link outreturn)', () => {
    setImageContent({ 'link-return.svg': 'data:link-return' })
    const src = getImageSrc({ type: 'link out', mode: 'return' })
    expect(src).toBe('data:link-return')
  })

  it('handles link-out link mode', () => {
    setImageContent({ 'link-out.svg': 'data:link-out' })
    const src = getImageSrc({ type: 'link out', mode: 'link' })
    expect(src).toBe('data:link-out')
  })

  it('maps debug type to debug.svg', () => {
    setImageContent({ 'debug.svg': 'data:debug' })
    expect(getImageSrc({ type: 'debug' })).toBe('data:debug')
  })

  it('maps inject type to inject.svg', () => {
    setImageContent({ 'inject.svg': 'data:inject' })
    expect(getImageSrc({ type: 'inject' })).toBe('data:inject')
  })

  it('maps mqtt in to bridge.svg', () => {
    setImageContent({ 'bridge.svg': 'data:bridge' })
    expect(getImageSrc({ type: 'mqtt in' })).toBe('data:bridge')
    expect(getImageSrc({ type: 'mqtt out' })).toBe('data:bridge')
  })

  it('setImageContent completely replaces previous content', () => {
    setImageContent({ 'function.svg': 'data:old' })
    setImageContent({ 'debug.svg': 'data:new' })
    expect(getImageSrc({ type: 'function' })).toBeNull() // old content replaced
    expect(getImageSrc({ type: 'debug' })).toBe('data:new')
  })
})
