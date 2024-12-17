'use client'

import { getWorkflowExecutionWithPhases } from '@/actions/workflows/getWorkflowExecutionWithPhases'
import { getWorkflowPhaseDetails } from '@/actions/workflows/getWorkflowPhaseDetails'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { datesToDurationString } from '@/lib/helper/dates'
import { getPhasesTotalCost } from '@/lib/helper/phases'
import { WorkflowExecutionStatus } from '@/types/workflow'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import {
  CalendarIcon,
  CircleDashedIcon,
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  LucideIcon,
  WorkflowIcon
} from 'lucide-react'
import React, { ReactNode, useState } from 'react'

type ExecutionData = Awaited<ReturnType<typeof getWorkflowExecutionWithPhases>>

const ExecutionViewer = ({ initialData }: { initialData: ExecutionData }) => {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)

  const query = useQuery({
    queryKey: ['execution', initialData?.id],
    initialData,
    queryFn: async () => getWorkflowExecutionWithPhases(initialData!.id),
    refetchInterval: q => (q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false)
  })

  const phaseDetails = useQuery({
    queryKey: ['phaseDetails', selectedPhase],
    enabled: selectedPhase !== null,
    queryFn: () => getWorkflowPhaseDetails(selectedPhase!)
  })

  const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING

  const duration = datesToDurationString(query.data?.startedAt, query.data?.completedAt)

  const creditsConsumed = getPhasesTotalCost(query.data?.phases || [])

  return (
    <div className="flex w-full h-full">
      <aside className="w-[440px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden">
        <div className="py-4 px-2">
          {/* status label */}
          <ExecutionLabel label="Status" icon={CircleDashedIcon} value={query.data?.status} />
          {/* started at label */}
          <ExecutionLabel
            label="Started at"
            icon={CalendarIcon}
            value={
              <span className=" lowercase">
                {query.data?.startedAt
                  ? formatDistanceToNow(new Date(query.data?.startedAt), { addSuffix: true })
                  : '-'}
              </span>
            }
          />
          {/* duration label */}
          <ExecutionLabel
            label="Duration"
            icon={ClockIcon}
            value={duration ? duration : <Loader2Icon className="animate-spin" size={20} />}
          />
          {/* credits consumed label */}
          <ExecutionLabel label="Credits consumed" icon={CoinsIcon} value={creditsConsumed} />
        </div>
        <Separator />
        <div className="flex justify-center items-center py-2 px-4">
          <div className="text-muted-foreground flex items-center gap-2">
            <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
            <span className="font-semibold">Phases</span>
          </div>
        </div>
        <Separator />
        <div className="h-full overflow-auto px-2 py-4">
          {query.data?.phases.map((phase, index) => (
            <Button
              key={phase.id}
              variant={selectedPhase === phase.id ? 'secondary' : 'ghost'}
              className="w-full justify-between"
              onClick={() => {
                if (isRunning) return
                setSelectedPhase(phase.id)
              }}
            >
              <div className="flex items-center gap-2">
                <Badge variant={'outline'}>{index + 1}</Badge>
                <p className="font-semibold">{phase.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">{phase.status}</p>
            </Button>
          ))}
        </div>
      </aside>
      <div className="flex w-full h-full overflow-auto">
         
      </div>
    </div>
  )
}

function ExecutionLabel({ icon, label, value }: { icon: LucideIcon; label: ReactNode; value: ReactNode }) {
  const Icon = icon
  return (
    <div className="flex justify-between items-center py-2 px-4 text-sm">
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon size={20} className="stroke-muted-foreground/80" />
        <span>{label}</span>
      </div>
      <div className="font-semibold capitalize flex gap-2 items-center">{value}</div>
    </div>
  )
}

export default ExecutionViewer
