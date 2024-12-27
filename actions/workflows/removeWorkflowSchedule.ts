'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/nextAuth'
import { revalidatePath } from 'next/cache'

export async function removeWorkflowSchedule(id: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }

  await prisma.workflow.update({
    where: {
      id: id
    },
    data: {
      cron: null,
      nextRunAt: null
    }
  })

  revalidatePath('/workflows')
}
