'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import { TaskType } from '@/types/task'
import { useReactFlow } from '@xyflow/react'
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from 'lucide-react'
import { useNodeComponentContext } from '../../context/NodeComponentProvider'
import { AppNode } from '@/types/appNode'
import { createFlowNode } from '@/lib/workflow/createFlowNode'

type Props = {
  taskType: TaskType
}

const NodeHeader = ({ taskType }: Props) => {
  const task = TaskRegistry[taskType]
  const { nodeId } = useNodeComponentContext()
  const { deleteElements, getNode, addNodes } = useReactFlow()

  const deleteNode = () => {
    deleteElements({ nodes: [{ id: nodeId }] })
  }

  const copyNode = () => {
    const node = getNode(nodeId) as AppNode
    const newX = node.position.x
    const newY = node.position.y + node.measured?.height! + 20
    const newNode = createFlowNode(node.data.type, {
      x: newX,
      y: newY
    })
    addNodes([newNode])
  }
 
  return (
    <div className="flex items-center gap-2 p-2">
      <task.icon size={16} />
      <div className="flex justify-between items-center w-full">
        <p className="text-xs font-bold uppercase text-muted-foreground">{task.label}</p>
        <div className="flex gap-1 items-center">
          {task.isEntryPoint && <Badge>Entry point</Badge>}
          <Badge className="gap-2 flex items-center text-xs">
            <CoinsIcon size={16} />
            { task.credits }
          </Badge>
          {!task.isEntryPoint && (
            <>
              <Button
                variant={'ghost'}
                size={'icon'}
                onClick={deleteNode}
              >
                <TrashIcon size={12} />
              </Button>
              <Button variant={'ghost'} size={'icon'} onClick={copyNode}>
                <CopyIcon size={12} />
              </Button>
            </>
          )}
          <Button variant={'ghost'} size={'icon'} className=" drag-handle cursor-grab">
            <GripVerticalIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NodeHeader
