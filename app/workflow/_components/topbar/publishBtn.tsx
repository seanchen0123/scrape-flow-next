'use client'

import { publishWorkflow } from '@/actions/workflows/publishWorkflow'
import { Button } from '@/components/ui/button'
import useExecutionPlan from '@/hooks/use-execution-plan'
import { useMutation } from '@tanstack/react-query'
import { useReactFlow } from '@xyflow/react'
import { UploadIcon } from 'lucide-react'
import { toast } from 'sonner'

const PublishBtn = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan()
  const { toObject } = useReactFlow()

  const mutation = useMutation({
    mutationFn: publishWorkflow,
    onSuccess: () => {
      toast.success('Workflow published', { id: workflowId })
    },
    onError: () => {
      toast.error('Something went wrong', { id: workflowId })
    }
  })

  return (
    <Button
      disabled={mutation.isPending}
      variant={'outline'}
      className="flex items-center gap-2"
      onClick={() => {
        const plan = generate()
        if (!plan) {
          return
        }

        toast.loading('Publishing workflow...', { id: workflowId })

        mutation.mutate({
          id: workflowId,
          flowDefinition: JSON.stringify(toObject())
        })
      }}
    >
      <UploadIcon size={16} className="stroke-green-400" />
      Publish
    </Button>
  )
}

export default PublishBtn
