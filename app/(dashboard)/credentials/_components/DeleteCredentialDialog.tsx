'use client'

import { deleteCredential } from '@/actions/credentials/deleteCredential'
import { deleteWorkflow } from '@/actions/workflows/deleteWorkflow'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'
import { XIcon } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  name: string

}

const DeleteCredentialDialog = ({name
}: Props) => {
  const [confirmText, setConfirmText] = useState('')
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: deleteCredential,
    onSuccess: () => {
      toast.success('Credential deleted successfully', { id: name })
      setConfirmText('')
    },
    onError: () => {
      toast.error('Something went wrong', { id: name })
    }
  })

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={'destructive'} size={'icon'} >
          <XIcon size={18} />
        </Button>
      </AlertDialogTrigger>
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
                If you are sure, enter <b>{name}</b> to confirm:
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
            disabled={confirmText !== name || isPending}
            className=" bg-destructive text-destructive-foreground hover:bg-destructive/80"
            onClick={e => {
              e.stopPropagation()
              toast.loading('Delete credential...', { id: name })
              mutate(name)
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCredentialDialog
