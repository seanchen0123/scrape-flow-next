import { TaskParamType, TaskType } from '@/types/task'
import { WorkflowTask } from '@/types/workflow'
import { ClockIcon, LucideProps } from 'lucide-react'

export const DelayTask = {
  type: TaskType.DELAY,
  label: 'Delay',
  icon: (props: LucideProps) => <ClockIcon className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  credits: 0,
  inputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROSWER_INSTANCE,
      required: true
    },
    {
      name: 'Delay time',
      type: TaskParamType.STRING,
      required: true
    }
  ] as const,
  outputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROSWER_INSTANCE
    }
  ] as const
} satisfies WorkflowTask
