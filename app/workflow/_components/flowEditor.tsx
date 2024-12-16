'use client'

import { createFlowNode } from '@/lib/workflow/createFlowNode'
import { TaskType } from '@/types/task'
import { Workflow } from '@prisma/client'
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  getOutgoers,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import NodeComponent from './nodes/nodeComponent'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AppNode } from '@/types/appNode'
import DeletableEdge from './edges/deleteEdge'
import { TaskRegistry } from '@/lib/workflow/task/registry'

type Props = {
  workflow: Workflow
}

const nodeTypes = {
  FlowScrapeNode: NodeComponent
}

const edgeTypes = {
  default: DeletableEdge
}

const snapGrid: [number, number] = [50, 50]
const fitViewOptions = {
  padding: 3
}

const FlowEditor = ({ workflow }: Props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [fitView, setFitView] = useState(false)
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow()

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

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback((event: React.DragEvent) => {
    event?.preventDefault()
    const taskType = event.dataTransfer.getData('application/reactFlow')
    if (typeof taskType === undefined || !taskType) return

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY
    })

    const newNode = createFlowNode(taskType as TaskType, position)
    setNodes((nds) => nds.concat(newNode))
  }, [screenToFlowPosition, setNodes])

  const onConnect = useCallback((connection: Connection) => {
    setEdges(eds => addEdge({...connection, animated: true }, eds))
    if (!connection.targetHandle) return
    // Remove input value if is present on connection
    const node = nodes.find(nd => nd.id === connection.target)
    if (!node) return
    const nodeInputs = node.data.inputs
    updateNodeData(node.id, {
      inputs: {
        ...nodeInputs,
        [connection.targetHandle]: ''
      }
    })
  }, [setEdges, updateNodeData, nodes])

  const isValidConnection = useCallback((connection: Edge | Connection) => {
    // No self-connection allowed
    if (connection.source === connection.target) return false
    // Same taskParam type connection
    const sourceNode = nodes.find(node => node.id === connection.source)
    const targetNode = nodes.find(node => node.id === connection.target)
    if (!sourceNode || !targetNode) {
      console.log('invalid connection: source or target node not found')
      return false
    }
    const sourceTask = TaskRegistry[sourceNode.data.type]
    const targetTask = TaskRegistry[targetNode.data.type]
    const output = sourceTask.outputs.find(o => o.name === connection.sourceHandle)
    const input = targetTask.inputs.find(i => i.name === connection.targetHandle)
    if (input?.type !== output?.type) {
      console.log('invalid connection: taskParam type mismatch')
      return false
    }
    // No cycle allowed
    const hasCycle = (node: AppNode, visited = new Set()) => {
      if (visited.has(node.id)) return false
      visited.add(node.id)
      for (const outgoer of getOutgoers(node, nodes, edges)) {
        if (outgoer.id === connection.source) return true
        if (hasCycle(outgoer, visited)) return true
      }
    }
    const detectedCycle = hasCycle(targetNode)
    return !detectedCycle
  }, [nodes, edges])

  return (
    <main className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapGrid={snapGrid}
        snapToGrid
        fitView={fitView}
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} />
      </ReactFlow>
    </main>
  )
}

export default FlowEditor
