import { Workflow } from '@prisma/client'
import { ReactFlowProvider } from '@xyflow/react'
import FlowEditor from './flowEditor'
import TopBar from './topbar/topBar'

type Props = {
  workflow: Workflow
}

const Editor = ({workflow}: Props) => {
  return (
    <ReactFlowProvider>
      <div className='flex flex-col h-full w-full overflow-hidden'>
        <TopBar title='Workflow Editor' subTitle={workflow.name} workflowId={workflow.id} />
        <section className='flex h-full overflow-auto'>
          <FlowEditor workflow={workflow} />
        </section>
      </div>
    </ReactFlowProvider>
  )
}

export default Editor