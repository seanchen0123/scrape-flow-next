'use client'

import { createFlowNode } from '@/lib/workflow/createFlowNode'
import { TaskType } from '@/types/task'
import { Workflow } from '@prisma/client'
import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import NodeComponent from './nodes/nodeComponent'

type Props = {
  workflow: Workflow
}

const nodeTypes = {
  FlowScrapeNode: NodeComponent
}

const FlowEditor = ({ workflow }: Props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([createFlowNode(TaskType.LAUNCH_BROWSER)])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  return (
    <main className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
      >
        <Controls position="top-left" />
        <Background variant={BackgroundVariant.Dots} gap={12} />
      </ReactFlow>
    </main>
  )
}

export default FlowEditor
