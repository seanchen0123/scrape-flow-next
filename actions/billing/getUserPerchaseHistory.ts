import prisma from '@/lib/prisma'
import { auth } from '@/lib/nextAuth'
import { redirect } from 'next/navigation'

export async function getUserPerchaseHistory() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }
  const { id: userId} = session.user

  return prisma.userPurchase.findMany({
    where: { userId },
    orderBy: {
      date: 'desc'
    }
  })
}
