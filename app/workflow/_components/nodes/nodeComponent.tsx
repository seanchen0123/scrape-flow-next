import React, { memo } from 'react'
import NodeCard from './nodeCard'
import { NodeProps } from '@xyflow/react'
import NodeHeader from './nodeHeader'
import { AppNodeData } from '@/types/appNode'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import NodeInputs, { NodeInput } from './nodeInputs'
import NodeComponentProvider from '../../context/NodeComponentProvider'
import NodeOutputs, { NodeOutput } from './nodeOutputs'

const NodeComponent = memo(({id, selected, data }: NodeProps) => {
  const nodeData = data as AppNodeData
  const task = TaskRegistry[nodeData.type]

  return (
    <NodeComponentProvider nodeId={id} isSelected={!!selected}>
      <NodeCard>
        <NodeHeader taskType={nodeData.type} />
        <NodeInputs>
          {task.inputs.map(input => (
            <NodeInput key={input.name} input={input} />
          ))}
        </NodeInputs>
        <NodeOutputs>
          {task.outputs.map(output => (
            <NodeOutput key={output.name} output={output} />
          ))}
        </NodeOutputs>
      </NodeCard>
    </NodeComponentProvider>
  )
})

export default NodeComponent
NodeComponent.displayName = 'NodeComponent'