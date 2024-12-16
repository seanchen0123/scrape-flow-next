'use client'

import { cn } from '@/lib/utils'
import { useReactFlow } from '@xyflow/react'
import React, { ReactNode } from 'react'
import { useNodeComponentContext } from '../../context/NodeComponentProvider'
import { useFlowValidationContext } from '@/hooks/use-flow-validation-context'

type Props = {
  children: ReactNode
}

const NodeCard = ({ children }: Props) => {
  const { nodeId, isSelected } = useNodeComponentContext()
  const { invalidInputs } = useFlowValidationContext()
  const { getNode, setCenter } = useReactFlow()

  const hasInvalidInputs = invalidInputs.some(node => node.nodeId === nodeId)

  const onDoubleClick = () => {
    // make node position center
    const node = getNode(nodeId)
    if (!node) return
    const { position, measured } = node
    if (!position || !measured) return
    const { width, height } = measured
    if (!width || !height) return
    const x = position.x + width / 2
    const y = position.y + height / 2
    if (x === undefined || y === undefined) return
    setCenter(x, y, {
      zoom: 1,
      duration: 500
    })
  }

  return (
    <div
      onDoubleClick={onDoubleClick}
      className={cn(
        'rounded-md cursor-pointer bg-background border-2 border-separate w-[420px] text-xs gap-1 flex flex-col',
        isSelected && 'border-primary',
        hasInvalidInputs && 'border-destructive border-2'
      )}
    >
      {children}
    </div>
  )
}

export default NodeCard
