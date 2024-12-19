import { getWorkflowExecutions } from '@/actions/workflows/getWorkflowExecutions'
import TopBar from '../../_components/topbar/topBar'
import { Suspense } from 'react'
import { InboxIcon, Loader2Icon } from 'lucide-react'
import { waitFor } from '@/lib/helper/waitFor'
import ExecutionsTable from './_components/executionsTable'

const ExecutionsPage = ({ params: { workflowId } }: { params: { workflowId: string } }) => {
  return (
    <div className="w-full h-full overflow-auto">
      <TopBar workflowId={workflowId} hideButtons title="All runs" subTitle="List of all your workflow runs" />
      <Suspense
        fallback={
          <div className="flex w-full h-full justify-center items-center">
            <Loader2Icon size={30} className="animate-spin stroke-primary" />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={workflowId} />
      </Suspense>
    </div>
  )
}

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
  const excutions = await getWorkflowExecutions(workflowId)

  if (!excutions) {
    return <div>No data</div>
  }

  if (excutions.length === 0) {
    return (
      <div className="container w-full p-4 py-6 mx-auto">
        <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">No runs have been triggered yet for this workflow</p>
            <p className="text-sm text-muted-foreground">You can trigger a new run in the editor page</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container p-4 py-4 w-full mx-auto'>
      <ExecutionsTable workflowId={workflowId} initialData={excutions} />
    </div>
  )
}

export default ExecutionsPage
