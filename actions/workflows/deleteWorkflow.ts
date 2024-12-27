'use server'

import { auth } from '@/lib/nextAuth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function deleteWorkflow(id: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }
  const { id: userId } = session.user

  await prisma.workflow.delete({
    where: {
      id,
      userId
    }
  })

  revalidatePath('/workflow')
}
