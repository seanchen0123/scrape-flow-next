'use server'

import prisma from '@/lib/prisma'
import { Period } from '@/types/analytics'
import { auth } from '@/lib/nextAuth'
import { redirect } from 'next/navigation'

export async function getPeriods() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }
  const { id: userId} = session.user

  const years = await prisma.workflowExecution.aggregate({
    where: {
      userId
    },
    _min: { startedAt: true }
  })

  const currentYear = new Date().getFullYear()
  const minYear = years._min.startedAt
    ? years._min.startedAt.getFullYear()
    : currentYear

  const periods: Period[] = []

  for (let year = minYear; year <= currentYear; year++) {
    for (let month = 0; month <= 11; month++) {
      periods.push({
        year,
        month
      })
    }
  }

  return periods
}
