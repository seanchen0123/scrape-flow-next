'use server'

import parser from 'cron-parser'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/nextAuth'
import { revalidatePath } from 'next/cache'

export async function updateWorkflowCron({ id, cron }: { id: string; cron: string }) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }
  const { id: userId } = session.user

  try {
    const interval = parser.parseExpression(cron, { utc: true })

    await prisma.workflow.update({
      where: {
        id,
        userId
      },
      data: {
        cron,
        nextRunAt: interval.next().toDate()
      }
    })
  } catch (error: any) {
    console.log('invalid cron: ', error.message)
    throw new Error('Invalid cron expression')
  }

  revalidatePath('/workflows')
}
