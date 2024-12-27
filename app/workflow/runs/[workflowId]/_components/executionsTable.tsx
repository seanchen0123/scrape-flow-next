'use client'
import { getWorkflowExecutions } from '@/actions/workflows/getWorkflowExecutions'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { datesToDurationString } from '@/lib/helper/dates'
import { WorkflowExecution } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import ExecutionStatusIndicator from './executionStatusIndicator'
import { WorkflowExecutionStatus } from '@/types/workflow'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'

type InitialDataType = Awaited<ReturnType<typeof getWorkflowExecutions>>

const ExecutionsTable = ({ workflowId, initialData }: { workflowId: string; initialData: InitialDataType }) => {
  const router = useRouter()

  const query = useQuery({
    queryKey: ['executions', workflowId],
    initialData,
    queryFn: () => getWorkflowExecutions(workflowId),
    refetchInterval: 5000
  })

  return (
    <div className="border rounded-lg shadow-md overflow-auto">
      <Table className="h-full w-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right text-xs text-muted-foreground">Started at (desc)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="w-full h-full overflow-auto">
          {query.data?.map(execution => {
            const duration = datesToDurationString(execution.startedAt, execution.completedAt)

            const formattedStartedAt =
              execution.startedAt &&
              formatDistanceToNow(execution.startedAt, {
                addSuffix: true
              })

            return (
              <TableRow key={execution.id} className='cursor-pointer' onClick={() => {
                router.push(`/workflow/runs/${workflowId}/${execution.id}`)
              }}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold">{execution.id}</span>
                    <div className="text-muted-foreground text-xs">
                      <span>Triggered via</span>
                      <Badge variant={'outline'}>{execution.trigger}</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <ExecutionStatusIndicator status={execution.status as WorkflowExecutionStatus} />
                      <span className="font-semibold capitalize">{execution.status}</span>
                    </div>
                    <div className="text-muted-foreground text-xs mx-5">{duration}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">{formattedStartedAt}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default ExecutionsTable
