import type { NodeRedNode } from '~/types'
import { imageNameToContent } from '~/utils/icons'

type ImageContent = Record<string, string>

const imgByType: Record<string, string> = {
  batch: 'batch.svg',
  catch: 'alert.svg',
  change: 'swap.svg',
  rbe: 'rbe.png',
  comment: 'comment.svg',
  complete: 'alert.svg',
  csv: 'parser-csv.svg',
  debug: 'debug.svg',
  delay: 'timer.svg',
  exec: 'cog.svg',
  feedparse: 'parser-xml.svg',
  file: 'file.svg',
  'file in': 'file-in.svg',
  'file out': 'file-out.svg',
  function: 'function.svg',
  'http response': 'white-globe.svg',
  'http in': 'white-globe.svg',
  'http request': 'white-globe.svg',
  inject: 'inject.svg',
  join: 'join.svg',
  json: 'parser-json.svg',
  'link in': 'link-out.svg',
  'link out': 'link-out.svg',
  'link inundefined': 'link-out.svg',
  'link outlink': 'link-out.svg',
  'link outreturn': 'link-return.svg',
  'link call': 'link-call.svg',
  markdown: 'parser-markdown.png',
  postgresql: 'postgresql.png',
  range: 'range.svg',
  sort: 'sort.svg',
  split: 'split.svg',
  subflow: 'subflow.svg',
  status: 'status.svg',
  switch: 'switch.svg',
  template: 'template.svg',
  trigger: 'trigger.svg',
  'link return': 'link-return.svg',
  'mqtt in': 'bridge.svg',
  'mqtt out': 'bridge.svg',
  ui_button: 'ui_button.png',
  ui_template: 'ui_template.png',
  ui_toast: 'ui_toast.png',
  ui_audio: 'feed.svg',
  ui_chart: 'ui_chart.png',
  ui_colour_picker: 'ui_colour_picker.png',
  ui_date_picker: 'ui_date_picker.png',
  ui_dropdown: 'ui_dropdown.png',
  ui_form: 'ui_form.png',
  ui_gauge: 'ui_gauge.png',
  ui_numeric: 'ui_numeric.png',
  ui_slider: 'ui_slider.png',
  ui_switch: 'ui_switch.png',
  ui_text: 'ui_text.png',
  ui_text_input: 'ui_text.png',
  'websocket in': 'white-globe.svg',
  'websocket out': 'white-globe.svg',
  'i2c scan': 'serial.svg',
  'i2c in': 'serial.svg',
  'i2c out': 'serial.svg',
  cronplus: 'timer.svg',
  Thought: 'alert.svg',
  Idea: 'light.svg',
  ClientCode: 'subflow.svg',
  GetFlows: 'subflow.svg',
  SendFlow: 'subflow.svg',
  InstallPackage: 'subflow.svg',
  PkgFile: 'file.svg',
  NodeRedInstall: 'subflow.svg',
  FlowHubPull: 'flowhub-pull.svg',
  FlowHubPush: 'flowhub-push.svg',
  FlowHubDiff: 'flowhub-diff.svg',
  osc: 'bridge-dash.svg',
  'tcp in': 'bridge-dash.svg',
  'tcp out': 'bridge-dash.svg',
  'tcp request': 'bridge-dash.svg',
  'udp in': 'bridge-dash.svg',
  'udp out': 'bridge-dash.svg',
  Contact: 'flowhub.svg',
  EmptyContact: 'flowhub.svg',
  Generator: 'flowhub.svg',
  'ut-assert-values': 'alert.svg',
  'ut-assert-debug': 'debug.svg',
  'mermaid-flowchart': 'flowhub.svg',
}

let imageContent: ImageContent | undefined = imageNameToContent

export function setImageContent(content: ImageContent): void {
  imageContent = content
}

function getContent(): ImageContent {
  if (imageContent) return imageContent
  const maybeWindow = typeof window !== 'undefined' ? window : undefined
  const globalContent = maybeWindow
    ? (maybeWindow as Window & { imageNameToContent?: ImageContent }).imageNameToContent
    : undefined
  if (globalContent) {
    imageContent = globalContent
    return imageContent
  }
  return {}
}

export function getImageSrc(
  obj: Pick<NodeRedNode, 'type' | 'mode'>,
  subflowObj: Pick<NodeRedNode, 'icon'> = {},
): string | null {
  const content = getContent()
  const typeKey = obj.type + (obj.mode || '')
  const filename = imgByType[typeKey] || imgByType[obj.type]
  if (filename && content[filename]) return content[filename]
  if (obj.type?.startsWith('subflow:')) {
    const icon = subflowObj.icon
    return (icon && content[icon]) || content['subflow.svg'] || null
  }
  return null
}
