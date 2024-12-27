'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/nextAuth'

export async function getWorkflowExecutions(workflowId: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }
  const { id: userId } = session.user

  return prisma.workflowExecution.findMany({
    where: {
      workflowId,
      userId
    },
    orderBy: {
      createAt: 'desc'
    }
  })
}
