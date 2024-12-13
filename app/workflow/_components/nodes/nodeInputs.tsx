import { cn } from '@/lib/utils'
import { TaskParam } from '@/types/task'
import { Handle, Position } from '@xyflow/react'
import { ReactNode } from 'react'
import NodeParamField from './nodeParamField'

type Props = {
  children: ReactNode
}

const NodeInputs = ({ children }: Props) => {
  return <div className="flex flex-col divide-y gap-2">{children}</div>
}

export function NodeInput({ input }: { input: TaskParam }) {
  return (
    <div className="flex justify-start relative p-3 bg-secondary w-full">
      <NodeParamField param={input} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          type="target"
          position={Position.Left}
          className={cn(
            '!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4'
          )}
        />
      )}
    </div>
  )
}

export default NodeInputs
