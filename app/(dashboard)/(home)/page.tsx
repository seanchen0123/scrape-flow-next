import { getPeriods } from '@/actions/analytics/getPeriods'
import React, { Suspense } from 'react'
import PeriodSelector from './_components/periodSelector'
import { Period } from '@/types/analytics'
import { Skeleton } from '@/components/ui/skeleton'
import { getStatsCardsValue } from '@/actions/analytics/getStatsCardsValue'
import { CirclePlayIcon, WaypointsIcon } from 'lucide-react'
import StatsCard from './_components/statsCard'
import { getWorkflowExecutionStats } from '@/actions/analytics/getWorkflowExecutionStats'
import ExecutionStatusChart from './_components/executionStatusChart'

const HomePage = ({ searchParams }: { searchParams: { month?: string; year?: string } }) => {
  const currentDate = new Date()
  const { month, year } = searchParams
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear()
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="h-full py-6 flex flex-col gap-4">
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <StatsExecutionStatus selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  )
}

async function PeriodSelectorWrapper({ selectedPeriod }: { selectedPeriod: Period }) {
  const periods = await getPeriods()
  return <PeriodSelector selectedPeriod={selectedPeriod} periods={periods} />
}

async function StatsCards({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await getStatsCardsValue(selectedPeriod)

  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-2 min-h-[120px]">
      <StatsCard title="Workflow executions" value={data.workflowExecutions} icon={CirclePlayIcon} />
      <StatsCard title="Phase executions" value={data.phaseExecutions} icon={WaypointsIcon} />
    </div>
  )
}

function StatsCardSkeleton() {
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
      {[1, 2, 3].map(i => (
        <Skeleton key={i} className="w-full min-h-[120px]" />
      ))}
    </div>
  )
}

async function StatsExecutionStatus({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await getWorkflowExecutionStats(selectedPeriod)
  return <ExecutionStatusChart data={data} />
}

export default HomePage
