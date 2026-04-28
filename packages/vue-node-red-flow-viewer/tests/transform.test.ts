import { describe, it, expect } from 'vitest'

import { transformFlow } from '~/composables/use-node-red-transform'

const TAB = 'tab1'
const base = [{ id: TAB, type: 'tab', label: 'Test' }]

// ── helpers ──────────────────────────────────────────────────────────────────

function node(id, type, x, y, wires = [], extra = {}) {
  return { id, type, z: TAB, x, y, wires, ...extra }
}

// ── basic node transformation ─────────────────────────────────────────────────

describe('node conversion', () => {
  it('maps position to top-left corner (x - w/2, y - h/2)', () => {
    const flow = [...base, node('n1', 'function', 200, 100)]
    const { nodes } = transformFlow(flow, TAB)
    const flowNode = nodes.find((candidate) => candidate.id === 'n1')
    // default width=100, height=30 (approx, depends on label length)
    expect(flowNode.position.x).toBeLessThan(200)
    expect(flowNode.position.y).toBeLessThan(100)
    expect(flowNode.position.x).toBeGreaterThan(0)
  })

  it('assigns correct VueFlow types', () => {
    const flow = [
      ...base,
      node('j', 'junction', 100, 100, [[]]),
      node('li', 'link in', 100, 150, [[]]),
      node('lo', 'link out', 100, 200, [[]]),
      node('lc', 'link call', 100, 250, [[]]),
      node('fn', 'function', 100, 300, [[]]),
    ]
    const { nodes } = transformFlow(flow, TAB)
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]))
    expect(byId.j.type).toBe('junction')
    expect(byId.li.type).toBe('link')
    expect(byId.lo.type).toBe('link')
    expect(byId.lc.type).toBe('link')
    expect(byId.fn.type).toBe('default')
  })

  it('sets function node color', () => {
    const flow = [...base, node('n1', 'function', 200, 100)]
    const { nodes } = transformFlow(flow, TAB)
    expect(nodes[0].data.color).toBe('#fdd0a2')
  })

  it('respects obj.color override', () => {
    const flow = [...base, node('n1', 'function', 200, 100, [], { color: '#ff0000' })]
    const { nodes } = transformFlow(flow, TAB)
    expect(nodes[0].data.color).toBe('#ff0000')
  })

  it('marks disabled nodes', () => {
    const flow = [...base, node('n1', 'function', 200, 100, [], { d: true })]
    const { nodes } = transformFlow(flow, TAB)
    expect(nodes[0].data.disabled).toBe(true)
  })

  it('excludes config nodes (no x/y/wires)', () => {
    const flow = [...base, { id: 'cfg', type: 'mqtt-broker', z: TAB }]
    const { nodes } = transformFlow(flow, TAB)
    expect(nodes.find((n) => n.id === 'cfg')).toBeUndefined()
  })

  it('excludes tab nodes', () => {
    const flow = [...base, node('n1', 'function', 200, 100)]
    const { nodes } = transformFlow(flow, TAB)
    expect(nodes.every((n) => n.type !== 'tab')).toBe(true)
  })

  it('excludes nodes from other flows', () => {
    const flow = [
      ...base,
      node('n1', 'function', 200, 100),
      { id: 'other', type: 'function', z: 'other-tab', x: 200, y: 100, wires: [] },
    ]
    const { nodes } = transformFlow(flow, TAB)
    expect(nodes.find((n) => n.id === 'other')).toBeUndefined()
    expect(nodes.find((n) => n.id === 'n1')).toBeDefined()
  })

  it('passes label lines in data', () => {
    const flow = [...base, node('n1', 'function', 200, 100, [], { name: 'My Func' })]
    const { nodes } = transformFlow(flow, TAB)
    expect(nodes[0].data.label).toEqual(['My Func'])
  })

  it('sets outputCount from wires length', () => {
    const flow = [...base, node('n1', 'switch', 200, 100, [['n2'], ['n3'], ['n4']])]
    const { nodes } = transformFlow(flow, TAB)
    expect(nodes.find((n) => n.id === 'n1').data.outputCount).toBe(3)
  })

  it('sets hasInput when another node wires to it', () => {
    const flow = [
      ...base,
      node('src', 'inject', 100, 100, [['dst']]),
      node('dst', 'debug', 300, 100, []),
    ]
    const { nodes } = transformFlow(flow, TAB)
    expect(nodes.find((n) => n.id === 'src').data.hasInput).toBe(false)
    expect(nodes.find((n) => n.id === 'dst').data.hasInput).toBe(true)
  })

  it('sets draggable/selectable/connectable to false', () => {
    const flow = [...base, node('n1', 'function', 200, 100)]
    const { nodes } = transformFlow(flow, TAB)
    const n = nodes[0]
    expect(n.draggable).toBe(false)
    expect(n.selectable).toBe(false)
    expect(n.connectable).toBe(false)
  })
})

// ── edge (wire) conversion ────────────────────────────────────────────────────

describe('edge conversion', () => {
  it('creates one edge per wire target', () => {
    const flow = [
      ...base,
      node('n1', 'function', 100, 100, [['n2', 'n3']]),
      node('n2', 'debug', 300, 80, []),
      node('n3', 'debug', 300, 120, []),
    ]
    const { edges } = transformFlow(flow, TAB)
    expect(edges).toHaveLength(2)
  })

  it('assigns correct source/target and handle IDs', () => {
    const flow = [
      ...base,
      node('n1', 'function', 100, 100, [['n2'], ['n3']]),
      node('n2', 'debug', 300, 80, []),
      node('n3', 'debug', 300, 120, []),
    ]
    const { edges } = transformFlow(flow, TAB)
    const e0 = edges.find((e) => e.target === 'n2')
    expect(e0.source).toBe('n1')
    expect(e0.sourceHandle).toBe('output-0')
    expect(e0.targetHandle).toBe('input')

    const e1 = edges.find((e) => e.target === 'n3')
    expect(e1.sourceHandle).toBe('output-1')
  })

  it('adds nr-link-disabled class for disabled source nodes', () => {
    const flow = [
      ...base,
      node('n1', 'function', 100, 100, [['n2']], { d: true }),
      node('n2', 'debug', 300, 100, []),
    ]
    const { edges } = transformFlow(flow, TAB)
    expect(edges[0].class).toContain('nr-link-disabled')
  })

  it('does not add disabled class for enabled nodes', () => {
    const flow = [
      ...base,
      node('n1', 'function', 100, 100, [['n2']]),
      node('n2', 'debug', 300, 100, []),
    ]
    const { edges } = transformFlow(flow, TAB)
    expect(edges[0].class).toBeFalsy()
  })

  it('generates no edges when wires array is empty', () => {
    const flow = [...base, node('n1', 'debug', 100, 100, [])]
    const { edges } = transformFlow(flow, TAB)
    expect(edges).toHaveLength(0)
  })
})

// ── groups ────────────────────────────────────────────────────────────────────

describe('group conversion', () => {
  it('creates an nrGroup node', () => {
    const flow = [
      ...base,
      { id: 'g1', type: 'group', z: TAB, x: 100, y: 100, w: 300, h: 200, nodes: ['n1'], style: {} },
      node('n1', 'function', 200, 150, []),
    ]
    const { nodes } = transformFlow(flow, TAB)
    const g = nodes.find((n) => n.id === 'g1')
    expect(g).toBeDefined()
    expect(g.type).toBe('nrGroup')
  })

  it('positions group with the current group padding', () => {
    const flow = [
      ...base,
      { id: 'g1', type: 'group', z: TAB, x: 100, y: 80, w: 300, h: 200, nodes: [], style: {} },
    ]
    const { nodes } = transformFlow(flow, TAB)
    const g = nodes.find((n) => n.id === 'g1')
    expect(g.position.x).toBe(88)
    expect(g.position.y).toBe(68)
  })

  it('sets group width/height from w/h plus current group padding', () => {
    const flow = [
      ...base,
      { id: 'g1', type: 'group', z: TAB, x: 100, y: 80, w: 300, h: 200, nodes: [], style: {} },
    ]
    const { nodes } = transformFlow(flow, TAB)
    const g = nodes.find((n) => n.id === 'g1')
    expect(g.data.width).toBe(324)
    expect(g.data.height).toBe(224)
  })

  it('sets parentNode on child nodes inside a group', () => {
    const flow = [
      ...base,
      { id: 'g1', type: 'group', z: TAB, x: 100, y: 100, w: 300, h: 200, nodes: ['n1'], style: {} },
      node('n1', 'function', 200, 150, [], { g: 'g1' }),
    ]
    const { nodes } = transformFlow(flow, TAB)
    const child = nodes.find((n) => n.id === 'n1')
    expect(child.parentNode).toBe('g1')
  })

  it('converts absolute child position to relative', () => {
    const flow = [
      ...base,
      { id: 'g1', type: 'group', z: TAB, x: 100, y: 100, w: 300, h: 200, nodes: ['n1'], style: {} },
      node('n1', 'function', 200, 150, [], { g: 'g1' }),
    ]
    const { nodes } = transformFlow(flow, TAB)
    const child = nodes.find((n) => n.id === 'n1')
    const group = nodes.find((n) => n.id === 'g1')

    // Child position must be relative to the group's VueFlow position.
    // Verify the invariant: child_relative + group_vf_pos == node_absolute_tl
    // (group.position is g.x-5, g.y-5)
    const nodeAbsTLx = parseFloat(child.style.width) * -0.5 + 200
    const nodeAbsTLy = parseFloat(child.style.height) * -0.5 + 150
    expect(child.position.x).toBeCloseTo(nodeAbsTLx - group.position.x, 1)
    expect(child.position.y).toBeCloseTo(nodeAbsTLy - group.position.y, 1)
  })

  it('groups appear before children in the nodes array', () => {
    const flow = [
      ...base,
      { id: 'g1', type: 'group', z: TAB, x: 100, y: 100, w: 300, h: 200, nodes: ['n1'], style: {} },
      node('n1', 'function', 200, 150, [], { g: 'g1' }),
    ]
    const { nodes } = transformFlow(flow, TAB)
    const gIdx = nodes.findIndex((n) => n.id === 'g1')
    const nIdx = nodes.findIndex((n) => n.id === 'n1')
    expect(gIdx).toBeLessThan(nIdx)
  })
})

// ── link-lines ────────────────────────────────────────────────────────────────

describe('linklines option', () => {
  it('adds dashed edges between link-out and link-in when enabled', () => {
    const flow = [
      ...base,
      node('li', 'link in', 300, 100, []),
      node('lo', 'link out', 100, 100, [], { links: ['li'] }),
    ]
    const { edges } = transformFlow(flow, TAB, { linklines: true })
    const dashed = edges.filter((e) => e.class === 'nr-link-dashed')
    expect(dashed).toHaveLength(1)
    expect(dashed[0].source).toBe('lo')
    expect(dashed[0].target).toBe('li')
  })

  it('does not add dashed edges when disabled (default)', () => {
    const flow = [
      ...base,
      node('li', 'link in', 300, 100, []),
      node('lo', 'link out', 100, 100, [], { links: ['li'] }),
    ]
    const { edges } = transformFlow(flow, TAB)
    expect(edges.filter((e) => e.class === 'nr-link-dashed')).toHaveLength(0)
  })

  it('only draws link-lines to link-in nodes in the same flow', () => {
    const flow = [
      ...base,
      node('li', 'link in', 300, 100, []),
      node('lo', 'link out', 100, 100, [], { links: ['li', 'external-li'] }),
    ]
    const { edges } = transformFlow(flow, TAB, { linklines: true })
    const dashed = edges.filter((e) => e.class === 'nr-link-dashed')
    expect(dashed).toHaveLength(1) // only 'li', not 'external-li'
  })
})

// ── subflow connectors ────────────────────────────────────────────────────────

describe('subflow connector nodes', () => {
  it('creates input connector nodes for a subflow definition', () => {
    const flow = [
      ...base,
      {
        id: TAB,
        type: 'subflow',
        z: TAB,
        x: 0,
        y: 0,
        in: [{ x: 100, y: 100, wires: [['n1']] }],
        out: [],
      },
      node('n1', 'function', 200, 100),
    ]
    // When flowId == subflow id, the subflow definition is rendered
    const { nodes } = transformFlow(flow, TAB)
    const inputConnectors = nodes.filter((n) => n.id.includes('-in-'))
    expect(inputConnectors).toHaveLength(1)
  })

  it('creates edges from subflow input connectors', () => {
    const flow = [
      ...base,
      {
        id: TAB,
        type: 'subflow',
        z: TAB,
        x: 0,
        y: 0,
        in: [{ x: 100, y: 100, wires: [['n1']] }],
        out: [],
      },
      node('n1', 'function', 200, 100),
    ]
    const { edges } = transformFlow(flow, TAB)
    const connEdge = edges.find((e) => e.target === 'n1')
    expect(connEdge).toBeDefined()
    expect(connEdge.source).toContain('-in-')
  })
})
