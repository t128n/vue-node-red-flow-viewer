import type { Edge, Node, NodeProps } from '@vue-flow/core'

export interface FlowViewerOptions {
  arrows?: boolean
  gridlines?: boolean
  images?: boolean
  linklines?: boolean
  labels?: boolean
}

export interface NodeRedGroupStyle {
  fill?: string
  'fill-opacity'?: string | number
  stroke?: string
  label?: boolean
  'label-position'?: string
  color?: string
}

export interface NodeRedConnectorTarget {
  id?: string
}

export type NodeRedWireTarget = string
export type NodeRedWire =
  | NodeRedConnectorTarget
  | NodeRedWireTarget
  | (NodeRedConnectorTarget | NodeRedWireTarget)[]

export interface NodeRedSubflowPort {
  x: number
  y: number
  wires?: NodeRedWire[]
}

export interface NodeRedNode {
  id: string
  type: string
  z?: string
  x?: number
  y?: number
  w?: number
  h?: number
  g?: string
  d?: boolean
  wires?: NodeRedWireTarget[][]
  links?: string[]
  in?: NodeRedSubflowPort[]
  out?: NodeRedSubflowPort[]
  status?: NodeRedSubflowPort
  style?: NodeRedGroupStyle
  nodes?: string[]
  name?: string
  label?: string
  text?: string
  info?: string
  color?: string
  icon?: string
  mode?: string
  uncaught?: boolean
  scope?: unknown[]
  method?: string
  url?: string
  statusCode?: string | number
  count?: string | number
  filename?: string
  actfunct?: string
  bias?: string | number
  threshold?: string | number
  flowname?: string
  schematitle?: string
  algname?: string
  port?: string | number
  yamlurl?: string
  sumPass?: boolean
  sumPassPrio?: string | number
}

export interface FlowTab {
  id: string
  label: string
  type: 'subflow' | 'tab' | 'unknown'
}

export interface FlowNodeData extends Record<string, unknown> {
  label: string[]
  color: string
  stroke: string
  width: number
  height: number
  imageSrc: string | null
  outputCount: number
  hasInput: boolean
  disabled: boolean
  nodeType?: string
}

export interface GroupNodeData extends Record<string, unknown> {
  width: number
  height: number
  name?: string
  style?: NodeRedGroupStyle
  disabled: boolean
}

export type FlowViewerNode = Node<FlowNodeData | GroupNodeData>
export type FlowViewerEdge = Edge

export interface TransformResult {
  nodes: FlowViewerNode[]
  edges: FlowViewerEdge[]
}

export type FlowViewerNodeProps = NodeProps<FlowNodeData>
export type FlowViewerGroupNodeProps = NodeProps<GroupNodeData>
