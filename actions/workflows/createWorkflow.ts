'use server'

import prisma from '@/lib/prisma'
import { createFlowNode } from '@/lib/workflow/createFlowNode'
import { createWorkflowSchema, createWorkflowSchemaType } from '@/schema/workflows'
import { AppNode } from '@/types/appNode'
import { TaskType } from '@/types/task'
import { WorkflowStatus } from '@/types/workflow'
import { auth } from '@/lib/nextAuth'
import { Edge } from '@xyflow/react'
import { redirect } from 'next/navigation'

export async function createWorkflow(form: createWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form)
  if (!success) {
    throw new Error('Invalid form data')
  }

  const session = await auth()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }
  const { id: userId} = session.user

  const initialFLow: {nodes: AppNode[], edges: Edge[]} = {
    nodes: [],
    edges: []
  }
  initialFLow.nodes.push(createFlowNode(TaskType.LAUNCH_BROWSER))

  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialFLow),
      ...data
    }
  })

  if (!result) {
    throw new Error('Failed to create workflow')
  }

  redirect(`/workflow/editor/${result.id}`)
}
