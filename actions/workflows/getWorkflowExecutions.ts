'use server'

import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function getWorkflowExecutions(workflowId: string) {
  const { userId } = auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

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
