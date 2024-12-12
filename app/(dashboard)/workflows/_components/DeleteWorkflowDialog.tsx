'use client'

import { deleteWorkflow } from '@/actions/workflows/deleteWorkflow'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  workflowName: string
  workflowId: string
}

const DeleteWorkflowDialog = ({
  open,
  setOpen,
  workflowName,
  workflowId
}: Props) => {
  const [confirmText, setConfirmText] = useState('')
  const { mutate, isPending } = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      toast.success('Workflow deleted successfully', { id: workflowId })
      setConfirmText('')
    },
    onError: () => {
      toast.error('Something went wrong', { id: workflowId })
    }
  })

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            <span className="flex flex-col py-4 gap-2">
              <span>
                If you delete this workflow, you will not be able to revocer it.
              </span>
              <span>
                If you are sure, enter <b>{workflowName}</b> to confirm:
              </span>
            </span>
            <Input
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== workflowName || isPending}
            className=" bg-destructive text-destructive-foreground hover:bg-destructive/80"
            onClick={e => {
              e.stopPropagation()
              toast.loading('Delete workflow...', { id: workflowId })
              mutate(workflowId)
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteWorkflowDialog
