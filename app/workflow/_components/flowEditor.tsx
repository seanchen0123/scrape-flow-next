'use client'

import { createFlowNode } from '@/lib/workflow/createFlowNode'
import { TaskType } from '@/types/task'
import { Workflow } from '@prisma/client'
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import NodeComponent from './nodes/nodeComponent'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {
  workflow: Workflow
}

const nodeTypes = {
  FlowScrapeNode: NodeComponent
}

const snapGrid: [number, number] = [50, 50]
const fitViewOptions = {
  padding: 3
}

const FlowEditor = ({ workflow }: Props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [fitView, setFitView] = useState(false)
  const { setViewport } = useReactFlow()

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition)
      if (!flow) return
      setNodes(flow.nodes || [])
      setEdges(flow.edges || [])
      if (!flow.viewport) {
        setFitView(true)
        return
      }
      setFitView(false)
      const { x = 0, y = 0, zoom = 1 } = flow.viewport
      setViewport({ x, y, zoom })
    } catch (error) {
      console.error(error)
      toast.error('Error parsing workflow definition')
    }
  }, [workflow.definition, setEdges, setNodes, setViewport])

  return (
    <main className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        snapGrid={snapGrid}
        snapToGrid
        fitView={fitView}
        fitViewOptions={fitViewOptions}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} />
      </ReactFlow>
    </main>
  )
}

export default FlowEditor
