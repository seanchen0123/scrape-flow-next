'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/nextAuth'
import { redirect } from 'next/navigation'

export async function getAvalibleCredits() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }
  const { id: userId} = session.user

  const balance = await prisma.userBalance.findUnique({
    where: {
      userId
    }
  })

  if (!balance) {
    return -1
  }

  return balance.credits
}
