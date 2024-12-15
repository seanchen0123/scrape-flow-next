import { TaskParamType, TaskType } from '@/types/task'
import { CodeIcon, LucideProps } from 'lucide-react'

export const PageToHtmlTask = {
  type: TaskType.PAGE_TO_HTML,
  label: 'Get html from page',
  icon: (props: LucideProps) => <CodeIcon className="stroke-rose-400" {...props} />,
  isEntryPoint: true,
  inputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROSWER_INSTANCE,
      required: true,
    }
  ],
  outputs: [
    {
      name: 'Html',
      type: TaskParamType.STRING
    },
    {
      name: 'Web page',
      type: TaskParamType.BROSWER_INSTANCE
    }
  ]
}