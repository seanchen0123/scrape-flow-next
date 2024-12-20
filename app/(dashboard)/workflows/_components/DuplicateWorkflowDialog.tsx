'use client'

import CustomDialogHeader from '@/components/CustomDialogHeader'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { duplicateWorkflowSchema, duplicateWorkflowSchemaType } from '@/schema/workflows'
import { CopyIcon, Layers2Icon, Loader2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { duplicateWorkflow } from '@/actions/workflows/duplicateWorkflow'
import { cn } from '@/lib/utils'

type Props = {
  workflowId: string
}

const DuplicateWorkflowDialog = ({ workflowId }: Props) => {
  const [open, setOpen] = useState(false)

  const form = useForm<duplicateWorkflowSchemaType>({
    resolver: zodResolver(duplicateWorkflowSchema),
    defaultValues: {
      workflowId,
      name: '',
      description: ''
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: duplicateWorkflow,
    onSuccess: () => {
      toast.success('Workflow duplicated successfully', { id: 'duplicate-workfloow' })
      setOpen(prev => !prev)
    },
    onError: () => {
      toast.error('Faild to duplicate workflow', { id: 'duplicate-workfloow' })
    }
  })

  const onSubmit = useCallback((values: duplicateWorkflowSchemaType) => {
    toast.loading('Duplicating workflow...', { id: 'duplicate-workfloow' })
    mutate(values)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'ghost'}
          size={'icon'}
          className={cn('ml-2 transition-opacity duration-200 opacity-0 group-hover/card:opacity-100')}
        >
          <CopyIcon className='w-4 h-4 text-muted-foreground cursor-pointer' />
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader title="Duplicate workflow" icon={Layers2Icon} />
        <div className="p-6">
          <Form {...form}>
            <form className="space-y-8 w-full" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Choose a descriptive and unique name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Description
                      <p className="text-xs text-primary">(optional)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of what this workflow does.
                      <br />
                      This is optional but can help you remember the workflow&apos;s purpose
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending && 'Proceed'}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DuplicateWorkflowDialog
