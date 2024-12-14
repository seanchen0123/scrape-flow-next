'use client'

import { cn } from '@/lib/utils'
import { useReactFlow } from '@xyflow/react'
import React, { ReactNode } from 'react'
import { useNodeComponentContext } from '../../context/NodeComponentProvider'

type Props = {
  children: ReactNode
}

const NodeCard = ({ children }: Props) => {
  const {nodeId, isSelected} = useNodeComponentContext()
  const { getNode, setCenter } = useReactFlow()

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
    <div onDoubleClick={onDoubleClick} className={cn('rounded-md cursor-pointer bg-background border-2 border-separate w-[420px] text-xs gap-1 flex flex-col', isSelected && 'border-primary')}>
      {children}
    </div>
  )
}

export default NodeCard
