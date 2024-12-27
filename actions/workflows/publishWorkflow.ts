'use server'

import prisma from '@/lib/prisma'
import { flowToExecutionPlan } from '@/lib/workflow/executionPlan'
import { calculateWorkflowCreditsCost } from '@/lib/workflow/helpers'
import { WorkflowStatus } from '@/types/workflow'
import { auth } from '@/lib/nextAuth'
import { revalidatePath } from 'next/cache'

export async function publishWorkflow({ id, flowDefinition }: { id: string; flowDefinition: string }) {
  const session = await auth()
    if (!session?.user) {
      throw new Error('User not authenticated')
    }
    const { id: userId } = session.user

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId
    }
  })

  if (!workflow) {
    throw new Error('Workflow not found')
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error('Workflow is not in draft state')
  }

  const flow = JSON.parse(flowDefinition)
  const result = flowToExecutionPlan(flow.nodes, flow.edges)

  if (result.error) {
    throw new Error('Flow definition not valid')
  }

  if (!result.executionPlan) {
    throw new Error('No execution plan generated')
  }

  const creditsCost = calculateWorkflowCreditsCost(flow.nodes)

  await prisma.workflow.update({
    where: {
      id,
      userId
    },
    data: {
      definition: flowDefinition,
      executionPlan: JSON.stringify(result.executionPlan),
      creditsCost,
      status: WorkflowStatus.PUBLISHED
    }
  })

  revalidatePath(`/workflow/editor/${id}`)
}
