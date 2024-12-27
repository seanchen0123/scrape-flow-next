'use server'

import prisma from '@/lib/prisma'
import { executeWorkflow } from '@/lib/workflow/executeWorkflow'
import { flowToExecutionPlan } from '@/lib/workflow/executionPlan'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
  WorkflowStatus
} from '@/types/workflow'
import { auth } from '@/lib/nextAuth'
import { redirect } from 'next/navigation'

export async function runWorkflow(form: { workflowId: string; flowDefinition?: string }) {
  const session = await auth()
    if (!session?.user) {
      throw new Error('User not authenticated')
    }
    const { id: userId } = session.user

  const { workflowId, flowDefinition } = form
  if (!workflowId) {
    throw new Error('Workflow ID is required')
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId
    }
  })

  if (!workflow) {
    throw new Error('Workflow not found')
  }

  let executionPlan: WorkflowExecutionPlan
  let workflowDefinition = flowDefinition

  if (workflow.status === WorkflowStatus.PUBLISHED) {
    if (!workflow.executionPlan) {
      throw new Error('No execution plan found in published workflow')
    }
    executionPlan = JSON.parse(workflow.executionPlan)
    workflowDefinition = workflow.definition
  } else {
    // workflow is  a draft
    if (!flowDefinition) {
      throw new Error('Flow definition is not defined')
    }

    const flow = JSON.parse(flowDefinition)
    const result = flowToExecutionPlan(flow.nodes, flow.edges)
    if (result.error) {
      throw new Error('Flow definition is not valid')
    }

    if (!result.executionPlan) {
      throw new Error('No execution plan generated')
    }

    executionPlan = result.executionPlan
  }
  console.log(executionPlan)
  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: workflowDefinition,
      phases: {
        create: executionPlan.flatMap(phase => {
          return phase.nodes.flatMap(node => {
            return {
              userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label
            }
          })
        })
      }
    },
    select: {
      id: true,
      phases: true
    }
  })

  if (!execution) {
    throw new Error('Workflow execution not created')
  }

  // run this on backend
  executeWorkflow(execution.id)

  redirect(`/workflow/runs/${workflowId}/${execution.id}`)
}
