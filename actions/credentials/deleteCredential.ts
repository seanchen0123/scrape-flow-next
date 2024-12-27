'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/nextAuth'
import { revalidatePath } from 'next/cache'

export async function deleteCredential(name: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }
  const { id: userId} = session.user

  await prisma.credential.delete({
    where: {
      userId_name: {
        userId,
        name
      }
    }
  })

  revalidatePath('/credentials')
}
