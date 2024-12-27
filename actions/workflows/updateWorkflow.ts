'use server'

import prisma from '@/lib/prisma'
import { WorkflowStatus } from '@/types/workflow'
import { auth } from '@/lib/nextAuth'
import { revalidatePath } from 'next/cache'

export async function updateWorkflow({ id, definition }: { id: string; definition: string }) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }
  const { id: userId } = session.user

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId
    }
  })

  if (!workflow) {
    throw new Error('Workflow not found')
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error('Workflow is not in draft state')
  }

  await prisma.workflow.update({
    data: {
      definition
    },
    where: {
      id,
      userId
    }
  })

  revalidatePath('/workflows')
}
