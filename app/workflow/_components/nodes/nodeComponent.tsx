import React, { memo } from 'react'
import NodeCard from './nodeCard'
import { NodeProps } from '@xyflow/react'

const NodeComponent = memo(({id, selected }: NodeProps) => {
  return (
    <NodeCard nodeId={id} isSelected={!!selected}>AppNode</NodeCard>
  )
})

export default NodeComponent
NodeComponent.displayName = 'NodeComponent'