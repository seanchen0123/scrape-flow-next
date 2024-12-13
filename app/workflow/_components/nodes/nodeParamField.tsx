'use client'

import { Input } from "@/components/ui/input"
import { TaskParam, TaskParamType } from "@/types/task"
import StringParam from "./param/stringParam"

type Props = {
  param: TaskParam
}

const NodeParamField = ({param}: Props) => {
  switch (param.type) {
    case TaskParamType.STRING:
      return <StringParam param={param} />
    default:
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not implemented</p>
        </div>
      ) 
  }
}

export default NodeParamField
