'use client'

import { runWorkflow } from '@/actions/workflows/runWorkflow'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { PlayIcon } from 'lucide-react'
import { toast } from 'sonner'

const RunBtn = ({ workflowId }: { workflowId: string }) => {
  const mutation = useMutation({
    mutationFn: runWorkflow,
    onSuccess: () => {
      toast.success('Workflow started', { id: workflowId })
    },
    onError: () => {
      toast.error('Something went wrong', { id: workflowId })
    }
  })

  return (
    <Button
      variant={'outline'}
      size={'sm'}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading('Scheduling run...', { id: workflowId })
        mutation.mutate({
          workflowId
        })
      }}
    >
      <PlayIcon />
    </Button>
  )
}

export default RunBtn
