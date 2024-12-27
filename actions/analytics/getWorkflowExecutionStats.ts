'use server'

import { periodToDateRange } from '@/lib/helper/dates'
import prisma from '@/lib/prisma'
import { Period } from '@/types/analytics'
import { WorkflowExecutionStatus } from '@/types/workflow'
import { auth } from '@/lib/nextAuth'
import { eachDayOfInterval, format } from 'date-fns'
import { redirect } from 'next/navigation'

type Stats = Record<string, { success: number; failed: number }>

const { COMPLETED, FAILED } = WorkflowExecutionStatus

export async function getWorkflowExecutionStats(period: Period) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }
  const { id: userId} = session.user

  const dateRange = periodToDateRange(period)
  const executions = await prisma.workflowExecution.findMany({
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

  executions.forEach(execution => {
    const date = format(execution.startedAt!, dateFormat)
    if (execution.status === COMPLETED) {
      stats[date].success += 1
    }
    if (execution.status === FAILED) {
      stats[date].failed += 1
    }
  })

  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos
  }))

  return result
}
