'use server'

import { auth } from "@/lib/nextAuth"
import prisma from "@/lib/prisma"

export async function getWorkflowsForUser() {
    const session = await auth()
    if (!session?.user) {
      throw new Error('User not authenticated')
    }
    const { id: userId } = session.user

  return prisma.workflow.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  
}