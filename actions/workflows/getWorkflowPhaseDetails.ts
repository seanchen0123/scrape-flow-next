'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/nextAuth'

export async function getWorkflowPhaseDetails(phaseId: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }
  const { id: userId } = session.user

  return prisma.executionPhase.findUnique({
    where: {
      id: phaseId,
      execution: {
        userId
      }
    },
    include: {
      logs: {
        orderBy: {
          timestamp: 'asc'
        }
      }
    }
  })
}
