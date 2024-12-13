'use client'

import { Workflow } from '@prisma/client'
import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

type Props = {
  workflow: Workflow
}

const FlowEditor = ({ workflow }: Props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  return (
    <main className="w-full h-full">
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}>
        <Controls position='top-left' />
        <Background variant={BackgroundVariant.Dots} gap={12} />
      </ReactFlow>
    </main>
  )
}

export default FlowEditor
