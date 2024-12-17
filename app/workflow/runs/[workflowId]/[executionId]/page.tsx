import { getWorkflowExecutionWithPhases } from '@/actions/workflows/getWorkflowExecutionWithPhases'
import TopBar from '@/app/workflow/_components/topbar/topBar'
import { Loader2Icon } from 'lucide-react'
import React, { Suspense } from 'react'
import ExecutionViewer from './_components/executionViewer'

type Props = {
  params: {
    workflowId: string
    executionId: string
  }
}

const ExecutionViewerPage = ({ params: { workflowId, executionId } }: Props) => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <TopBar workflowId={workflowId} title="Workflow run details" subTitle={`Run ID: ${executionId}`} hideButtons />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={executionId} />
        </Suspense>
      </section>
    </div>
  )
}

async function ExecutionViewerWrapper({ executionId }: { executionId: string }) {
  

  const workflowExecution = await getWorkflowExecutionWithPhases(executionId)

  if (!workflowExecution) {
    return <div>Not found</div>
  }

  return <ExecutionViewer initialData={workflowExecution} />
  
}

export default ExecutionViewerPage
