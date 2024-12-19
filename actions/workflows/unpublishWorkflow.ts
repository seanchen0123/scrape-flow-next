'use server'

import prisma from '@/lib/prisma'
import { WorkflowStatus } from '@/types/workflow'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function unpublishWorkflow(id: string) {
  const { userId } = auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId
    }
  })

  if (!workflow) {
    throw new Error('Workflow not found')
  }

  if (workflow.status === WorkflowStatus.DRAFT) {
    throw new Error('Workflow is already unpublished')
  }

  await prisma.workflow.update({
    where: {
      id,
      userId
    },
    data: {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0
    }
  })

  revalidatePath(`/workflow/editor/${id}`)
}
