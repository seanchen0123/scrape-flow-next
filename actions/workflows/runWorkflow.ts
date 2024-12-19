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
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function runWorkflow(form: { workflowId: string; flowDefinition?: string }) {
  const { userId } = auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

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

  let excutionPlan: WorkflowExecutionPlan

  if (workflow.status === WorkflowStatus.PUBLISHED) {
    if (!workflow.executionPlan) {
      throw new Error('No execution plan found in published workflow')
    }
    excutionPlan = JSON.parse(workflow.executionPlan)
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

    excutionPlan = result.executionPlan
  }
  console.log(excutionPlan)
  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: flowDefinition,
      phases: {
        create: excutionPlan.flatMap(phase => {
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
