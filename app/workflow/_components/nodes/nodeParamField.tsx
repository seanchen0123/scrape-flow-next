'use client'
import { TaskParam, TaskParamType } from '@/types/task'
import StringParam from './param/stringParam'
import { useReactFlow } from '@xyflow/react'
import { AppNode } from '@/types/appNode'
import { useCallback } from 'react'
import { useNodeComponentContext } from '../../context/NodeComponentProvider'

const NodeParamField = ({ param, disabled }: { param: TaskParam, disabled: boolean}) => {
  const { nodeId } = useNodeComponentContext()
  const { updateNodeData, getNode } = useReactFlow()
  const node = getNode(nodeId) as AppNode
  const value = node.data.inputs?.[param.name] || ''

  const updateNodeParamValue = useCallback(
    (newValue: string) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node?.data.inputs,
          [param.name]: newValue
        }
      })
    },
    [updateNodeData, param.name, nodeId, node?.data.inputs]
  )

  switch (param.type) {
    case TaskParamType.STRING:
      return <StringParam param={param} value={value} updateNodeParamValue={updateNodeParamValue} disabled={disabled} />
    default:
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not implemented</p>
        </div>
      )
  }
}

export default NodeParamField
