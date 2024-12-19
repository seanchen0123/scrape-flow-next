import { AppNode } from '@/types/appNode'
import { TaskRegistry } from './task/registry'

export function calculateWorkflowCreditsCost(nodes: AppNode[]) {
  return nodes.reduce((acc, node) => acc + TaskRegistry[node.data.type].credits, 0)
}
