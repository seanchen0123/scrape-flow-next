'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/nextAuth'

export async function getCredentialsForUser() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }
  const { id: userId} = session.user

  return prisma.credential.findMany({
    where: {
      userId
    },
    orderBy: {
      name: 'asc'
    }
  })
}
