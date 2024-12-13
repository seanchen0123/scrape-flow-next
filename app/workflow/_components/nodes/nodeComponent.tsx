import React, { memo } from 'react'
import NodeCard from './nodeCard'
import { NodeProps } from '@xyflow/react'
import NodeHeader from './nodeHeader'
import { AppNodeData } from '@/types/appNode'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import NodeInputs, { NodeInput } from './nodeInputs'

const NodeComponent = memo(({id, selected, data }: NodeProps) => {
  const nodeData = data as AppNodeData
  const task = TaskRegistry[nodeData.type]

  return (
    <NodeCard nodeId={id} isSelected={!!selected}>
      <NodeHeader taskType={nodeData.type} />
      <NodeInputs>
        {task.inputs.map(input => (
          <NodeInput key={input.name} input={input} />
        ))}
      </NodeInputs>
    </NodeCard>
  )
})

export default NodeComponent
NodeComponent.displayName = 'NodeComponent'