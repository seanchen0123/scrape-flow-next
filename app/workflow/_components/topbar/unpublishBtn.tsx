'use client'

import { unpublishWorkflow } from '@/actions/workflows/unpublishWorkflow'
import { Button } from '@/components/ui/button'
import useExecutionPlan from '@/hooks/use-execution-plan'
import { useMutation } from '@tanstack/react-query'
import { DownloadIcon, UploadIcon } from 'lucide-react'
import { toast } from 'sonner'

const UnpublishBtn = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan()

  const mutation = useMutation({
    mutationFn: unpublishWorkflow,
    onSuccess: () => {
      toast.success('Workflow unpublished', { id: workflowId })
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

        mutation.mutate(workflowId)
      }}
    >
      <DownloadIcon size={16} className="stroke-orange-500" />
      Unpublished
    </Button>
  )
}

export default UnpublishBtn
