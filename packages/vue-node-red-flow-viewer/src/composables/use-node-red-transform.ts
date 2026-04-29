import type {
  FlowViewerEdge,
  FlowViewerNode,
  FlowViewerOptions,
  NodeRedConnectorTarget,
  NodeRedNode,
  NodeRedWire,
  NodeRedWireTarget,
  TransformResult,
} from '~/types'
import { getNodeColor } from '~/utils/colors'
import { getImageSrc } from '~/utils/images'
import { getNodeLabel, getNodeSize, getLabelParts } from '~/utils/labels'

/**
 * Converts Node-RED flowdata JSON into VueFlow nodes + edges.
 *
 * @param {Array}  flowdata  Raw Node-RED flow array
 * @param {string} flowId    Tab/subflow ID to render
 * @param {object} opts      Rendering options
 * @returns {{ nodes: Array, edges: Array }}
 */
export function transformFlow(
  flowdata: NodeRedNode[],
  flowId: string,
  opts: FlowViewerOptions = {},
): TransformResult {
  const { images = true, labels = true, linklines = false } = opts

  // Build subflow lookup
  const subflows: Record<string, NodeRedNode> = {}
  for (const n of flowdata) {
    if (n.type === 'subflow') subflows[n.id] = n
  }

  // Track which nodes receive wires (need an input handle)
  const hasInputMap: Record<string, boolean> = {}
  for (const n of flowdata) {
    if (n.z !== flowId && n.id !== flowId) continue
    for (const port of n.wires ?? []) {
      if (Array.isArray(port)) {
        for (const targetId of port) hasInputMap[targetId] = true
      }
    }
    // Subflow in-port wires are stored in def.in[].wires, not n.wires
    if (n.type === 'subflow' && n.id === flowId) {
      for (const inp of n.in ?? []) {
        for (const wire of inp.wires ?? []) {
          const targetId = typeof wire === 'string' ? wire : wire.id
          if (targetId) hasInputMap[targetId] = true
        }
      }
    }
  }

  const vfNodes: FlowViewerNode[] = []
  const vfEdges: FlowViewerEdge[] = []
  const groups: Record<string, NodeRedNode> = {}
  const groupBounds: Record<string, { minX: number; minY: number; maxX: number; maxY: number }> = {}

  // First pass: Process nodes and junctions
  for (const obj of flowdata) {
    if (obj.z !== flowId && obj.id !== flowId) continue
    if (obj.type === 'tab' || obj.type === 'ui_spacer') continue

    if (obj.type === 'subflow') {
      addSubflowConnectors(obj, vfNodes, vfEdges)
      continue
    }

    if (obj.type === 'group') {
      groups[obj.id] = { ...obj }
      continue
    }

    if (!obj.x && !obj.y && !obj.wires) continue // config node

    const clr = getNodeColor(obj)
    const subflowObj = subflows[obj.type.replace('subflow:', '')]
    const labelStr = labels ? getNodeLabel(obj, subflowObj ?? {}, flowdata) : ''
    const { lines: labelLines } = getLabelParts(labelStr)
    const { width, height } = getNodeSize(obj, labelStr)
    const imageSrc = images ? getImageSrc(obj, subflowObj) : null
    const outputCount = Math.max((obj.wires ?? []).length, obj.outputs ?? 0)
    const hasInput = !!(hasInputMap[obj.id] || (subflowObj?.in?.length ?? 0) > 0)
    const nodeType = getVueFlowNodeType(obj)

    const objX = obj.x ?? 0
    const objY = obj.y ?? 0
    const posX = Math.round(objX - width / 2)
    const posY = Math.round(objY - height / 2)

    // Update parent group bounds if necessary
    if (obj.g) {
      if (!groupBounds[obj.g]) {
        groupBounds[obj.g] = { minX: posX, minY: posY, maxX: posX + width, maxY: posY + height }
      } else {
        groupBounds[obj.g].minX = Math.min(groupBounds[obj.g].minX, posX)
        groupBounds[obj.g].minY = Math.min(groupBounds[obj.g].minY, posY)
        groupBounds[obj.g].maxX = Math.max(groupBounds[obj.g].maxX, posX + width)
        groupBounds[obj.g].maxY = Math.max(groupBounds[obj.g].maxY, posY + height)
      }
    }

    vfNodes.push({
      id: obj.id,
      type: nodeType,
      position: { x: posX, y: posY },
      style: { width: `${width}px`, height: `${height}px` },
      data: {
        label: labelLines,
        color: clr.fill,
        stroke: clr.stroke,
        width,
        height,
        imageSrc,
        outputCount,
        hasInput,
        disabled: !!obj.d,
        nodeType: obj.type,
      },
      parentNode: obj.g,
      draggable: false,
      selectable: false,
      connectable: false,
    })

    const edgeClass = obj.d ? 'nr-link-disabled' : ''
    const wires = obj.wires ?? []
    for (let portIdx = 0; portIdx < wires.length; portIdx++) {
      const targets = wires[portIdx]
      if (Array.isArray(targets)) {
        for (const targetId of targets) {
          vfEdges.push({
            id: `${obj.id}-p${portIdx}-${targetId}`,
            source: obj.id,
            target: targetId,
            sourceHandle: `output-${portIdx}`,
            targetHandle: 'input',
            class: edgeClass,
            style: { stroke: 'var(--nr-wire-color, #999)', strokeWidth: 3 },
          })
        }
      }
    }
  }

  // Second pass: Process groups and adjust sizes to fit contents
  const PADDING = 12
  const sortedGroups = topoSortGroups(Object.values(groups))

  for (const grp of sortedGroups) {
    let gx = grp.x ?? 0
    let gy = grp.y ?? 0
    let gw = grp.w || 100
    let gh = grp.h || 100

    // Expand group to fit children if needed
    if (groupBounds[grp.id]) {
      const b = groupBounds[grp.id]
      const minX = b.minX - PADDING
      const minY = b.minY - PADDING
      const maxX = b.maxX + PADDING
      const maxY = b.maxY + PADDING

      gx = Math.min(gx, minX)
      gy = Math.min(gy, minY)
      gw = Math.max(gw, maxX - gx)
      gh = Math.max(gh, maxY - gy)
    }

    // Update parent bounds if this group itself has a parent
    if (grp.g) {
      if (!groupBounds[grp.g]) {
        groupBounds[grp.g] = { minX: gx, minY: gy, maxX: gx + gw, maxY: gy + gh }
      } else {
        groupBounds[grp.g].minX = Math.min(groupBounds[grp.g].minX, gx)
        groupBounds[grp.g].minY = Math.min(groupBounds[grp.g].minY, gy)
        groupBounds[grp.g].maxX = Math.max(groupBounds[grp.g].maxX, gx + gw)
        groupBounds[grp.g].maxY = Math.max(groupBounds[grp.g].maxY, gy + gh)
      }
    }

    // Update group object with resolved dimensions for child offset calculation later
    groups[grp.id].x = gx
    groups[grp.id].y = gy
    groups[grp.id].w = gw
    groups[grp.id].h = gh

    vfNodes.unshift({
      id: grp.id,
      type: 'nrGroup',
      position: { x: Math.round(gx), y: Math.round(gy) },
      style: { width: `${gw}px`, height: `${gh}px`, zIndex: -10 },
      data: {
        width: gw,
        height: gh,
        name: grp.name,
        style: grp.style,
        disabled: !!grp.d,
      },
      parentNode: grp.g,
      draggable: false,
      selectable: false,
      connectable: false,
      zIndex: -10,
    })
  }

  // Final pass: Convert absolute child positions to relative
  for (const node of vfNodes) {
    if (!node.parentNode) continue
    const grp = groups[node.parentNode]
    if (!grp) continue
    node.position.x -= Math.round(grp.x ?? 0)
    node.position.y -= Math.round(grp.y ?? 0)
  }

  // Optional: dashed link-lines
  if (linklines) {
    const linkIns: Record<string, boolean> = {}
    for (const n of flowdata) {
      if (n.z === flowId && n.type === 'link in') linkIns[n.id] = true
    }
    for (const n of flowdata) {
      if (n.z !== flowId || n.type !== 'link out') continue
      for (const targetId of n.links || []) {
        if (linkIns[targetId]) {
          vfEdges.push({
            id: `nr-linkline-${n.id}-${targetId}`,
            source: n.id,
            target: targetId,
            sourceHandle: 'link-source',
            targetHandle: 'link-target',
            class: 'nr-link-dashed',
            style: {
              stroke: 'var(--nr-wire-color, #999)',
              strokeWidth: 2,
              strokeDasharray: '25,4',
            },
          })
        }
      }
    }
  }

  return { nodes: vfNodes, edges: vfEdges }
}

function getVueFlowNodeType(obj: NodeRedNode): 'junction' | 'link' | 'default' {
  if (obj.type === 'junction') return 'junction'
  if (obj.type === 'link in' || obj.type === 'link out' || obj.type === 'link call') return 'link'
  return 'default'
}

function addSubflowConnectors(
  def: NodeRedNode,
  vfNodes: FlowViewerNode[],
  vfEdges: FlowViewerEdge[],
): void {
  const base = { draggable: false, selectable: false, connectable: false }

  const inputs = def.in ?? []
  for (let i = 0; i < inputs.length; i++) {
    const inp = inputs[i]
    const id = `${def.id}-in-${i}`
    vfNodes.push({
      ...base,
      id,
      type: 'default',
      position: { x: inp.x - 20, y: inp.y - 20 },
      style: { width: '40px', height: '40px' },
      data: {
        label: ['input'],
        color: '#ddd',
        stroke: 'rgb(153,153,153)',
        width: 40,
        height: 40,
        outputCount: 1,
        hasInput: false,
        imageSrc: null,
        disabled: false,
      },
    })
    for (const wire of connectorTargets(inp.wires)) {
      const targetId = typeof wire === 'string' ? wire : wire.id
      if (targetId) {
        vfEdges.push({
          id: `${id}-to-${targetId}`,
          source: id,
          target: targetId,
          sourceHandle: 'output-0',
          targetHandle: 'input',
          style: { stroke: 'var(--nr-wire-color, #999)', strokeWidth: 4 },
        })
      }
    }
  }

  const outputs = def.out ?? []
  for (let i = 0; i < outputs.length; i++) {
    const out = outputs[i]
    const id = `${def.id}-out-${i}`
    vfNodes.push({
      ...base,
      id,
      type: 'default',
      position: { x: out.x - 20, y: out.y - 20 },
      style: { width: '40px', height: '40px' },
      data: {
        label: ['output', String(i + 1)],
        color: '#ddd',
        stroke: 'rgb(153,153,153)',
        width: 40,
        height: 40,
        outputCount: 0,
        hasInput: true,
        imageSrc: null,
        disabled: false,
      },
    })
    for (const wire of connectorTargets(out.wires)) {
      const sourceId = typeof wire === 'string' ? wire : wire.id
      const port = typeof wire === 'string' ? 0 : (wire.port ?? 0)
      if (sourceId) {
        vfEdges.push({
          id: `${sourceId}-p${port}-to-${id}`,
          source: sourceId,
          target: id,
          sourceHandle: `output-${port}`,
          targetHandle: 'input',
          style: { stroke: 'var(--nr-wire-color, #999)', strokeWidth: 4 },
        })
      }
    }
  }

  if (def.status) {
    const id = `${def.id}-status`
    vfNodes.push({
      ...base,
      id,
      type: 'default',
      position: { x: def.status.x - 20, y: def.status.y - 20 },
      style: { width: '40px', height: '40px' },
      data: {
        label: ['status'],
        color: '#ddd',
        stroke: 'rgb(153,153,153)',
        width: 40,
        height: 40,
        outputCount: 0,
        hasInput: true,
        imageSrc: null,
        disabled: false,
      },
    })
  }
}

function connectorTargets(
  wires: NodeRedWire[] = [],
): (NodeRedConnectorTarget | NodeRedWireTarget)[] {
  return wires.flatMap((wire) => (Array.isArray(wire) ? wire : [wire]))
}

// Sort groups so inner groups come before outer ones (for sizing propagation)
function topoSortGroups(groups: NodeRedNode[]): NodeRedNode[] {
  const groupMap: Record<string, NodeRedNode> = {}
  groups.forEach((g) => (groupMap[g.id] = g))

  function getDepth(id: string): number {
    let depth = 0
    let curr = groupMap[id]
    while (curr && curr.g) {
      depth++
      curr = groupMap[curr.g]
    }
    return depth
  }

  return [...groups].sort((a, b) => getDepth(b.id) - getDepth(a.id))
}
