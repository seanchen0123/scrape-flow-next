'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/nextAuth'

export async function getWorkflowExecutionWithPhases(executionId: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }
  const { id: userId } = session.user

  return prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
      userId
    },
    include: {
      phases: {
        orderBy: {
          number: 'asc'
        }
      }
    }
  })
}
