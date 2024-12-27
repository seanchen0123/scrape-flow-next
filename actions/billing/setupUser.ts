'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/nextAuth'
import { redirect } from 'next/navigation'

export async function setupUser() {
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
    // Create a new user balance
    await prisma.userBalance.create({
      data: {
        userId,
        credits: 100
      }
    })
  }

  redirect('/')
}
