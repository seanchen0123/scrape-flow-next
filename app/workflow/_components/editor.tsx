import { Workflow } from '@prisma/client'
import { ReactFlowProvider } from '@xyflow/react'
import FlowEditor from './flowEditor'
import TopBar from './topbar/topBar'
import TaskMenu from './taskMenu'
import FlowValidationProviders from '../context/FlowValidationProviders'
import { WorkflowStatus } from '@/types/workflow'

type Props = {
  workflow: Workflow
}

const Editor = ({ workflow }: Props) => {
  return (
    <FlowValidationProviders>
      <ReactFlowProvider>
        <div className="flex flex-col h-full w-full overflow-hidden">
          <TopBar
            title="Workflow Editor"
            subTitle={workflow.name}
            workflowId={workflow.id}
            isPublished={workflow.status === WorkflowStatus.PUBLISHED}
          />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationProviders>
  )
}

export default Editor
