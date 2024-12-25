'use server'

import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function setupUser() {
  const { userId } = auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

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
