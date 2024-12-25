'use client'

import { downloadInvoice } from '@/actions/billing/downloadInvoice'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const InvoiceBtn = ({ id }: { id: string }) => {
  const mutation = useMutation({
    mutationFn: downloadInvoice,
    onSuccess: data => {
      window.location.href = data as string
    },
    onError: () => {
      toast.error('Something went wrong')
    }
  })

  return (
    <Button
      variant={'ghost'}
      size={'sm'}
      className="text-xs gap-2 text-muted-foreground px-1"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate(id)}
    >
      Invoice
      {mutation.isPending && <Loader2Icon className="w-4 h-4 animate-spin" />}
    </Button>
  )
}

export default InvoiceBtn
