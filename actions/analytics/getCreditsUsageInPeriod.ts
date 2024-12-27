import { periodToDateRange } from '@/lib/helper/dates'
import { auth } from '@/lib/nextAuth'
import prisma from '@/lib/prisma'
import { Period } from '@/types/analytics'
import { ExecutionPhaseStatus } from '@/types/workflow'
import { eachDayOfInterval, format } from 'date-fns'
import { redirect } from 'next/navigation'

type Stats = Record<string, { success: number; failed: number }>

const { COMPLETED, FAILED } = ExecutionPhaseStatus

export async function getCreditsUsageInPeriod(period: Period) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }
  const { id: userId} = session.user

  const dateRange = periodToDateRange(period)
  const executionPhases = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate
      },
      status: {
        in: [COMPLETED, FAILED]
      }
    }
  })

  const dateFormat = 'yyyy-MM-dd'
  const stats: Stats = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate
  })
    .map(date => format(date, dateFormat))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0
      }
      return acc
    }, {} as any)

  executionPhases.forEach(phase => {
    const date = format(phase.startedAt!, dateFormat)
    if (phase.status === COMPLETED) {
      stats[date].success += phase.creditsConsumed || 0
    }
    if (phase.status === FAILED) {
      stats[date].failed += phase.creditsConsumed || 0
    }
  })

  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos
  }))

  return result
}
