import prisma from '@/lib/prisma'
import { auth } from '@/lib/nextAuth'
import React from 'react'
import Editor from '../../_components/editor'

type Props = {
  params: {
    workflowId: string
  }
}

const WorkflowPage = async ({ params }: Props) => {
  const { workflowId } = params
  const session = await auth()

  if (!session?.user.id) return <div>unauthenticatred</div>

  const { id: userId } = session.user

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId
    }
  })

  if (!workflow) return <div>Workflow not found</div>

  return <Editor workflow={workflow} />
}

export default WorkflowPage
