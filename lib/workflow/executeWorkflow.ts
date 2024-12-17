import 'server-only'
import prisma from '../prisma'
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from '@/types/workflow'
import { waitFor } from '../helper/waitFor'
import { ExecutionPhase } from '@prisma/client'
import { AppNode } from '@/types/appNode'
import { TaskRegistry } from './task/registry'

export async function executeWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId
    },
    include: {
      workflow: true,
      phases: true
    }
  })

  if (!execution) {
    throw new Error('Execution not found')
  }

  // 1. set execution environment
  const environment = {
    phases: {}
  }

  // 2. initialize workflow execution
  await initializeWorkflowExecution(executionId, execution.workflowId)

  // 3. initialize phases status
  await initializePhasesStatus(execution)

  // 4. execute
  let creditsConsumed = 0
  let executionFaild = false
  for (const phase of execution.phases) {
    // execute every phase
    const phaseExecution = await executeWorkflowPhase(phase)
    if (!phaseExecution.success) {
      executionFaild = true
      break
    }
    // consume every credits
  }

  // 5. finalize execution
  await finalizeWorkflowExecution(executionId, execution.workflowId, executionFaild, creditsConsumed)
}

async function initializeWorkflowExecution(executionId: string, workflowId: string) {
  await prisma.workflowExecution.update({
    where: {
      id: executionId
    },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING
    }
  })

  await prisma.workflow.update({
    where: {
      id: workflowId
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId
    }
  })
}

async function initializePhasesStatus(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id)
      }
    },
    data: {
      status: ExecutionPhaseStatus.PENDING
    }
  })
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFaild: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFaild ? WorkflowExecutionStatus.FAILD : WorkflowExecutionStatus.COMPLETED

  await prisma.workflowExecution.update({
    where: {
      id: executionId
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed
    }
  })

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId
      },
      data: {
        lastRunStatus: finalStatus
      }
    })
    .catch(() => {})
}

async function executeWorkflowPhase(phase: ExecutionPhase) {
  const startedAt = new Date()
  const node = JSON.parse(phase.node) as AppNode

  await prisma.executionPhase.update({
    where: {
      id: phase.id
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt
    }
  })

  const creditsRequired = TaskRegistry[node.data.type].credits
  console.log(`Executing phase ${phase.name} with ${creditsRequired} credits required`)

  // TODO: decrement user balance

  await waitFor(2000)
  const success = Math.random() < 0.7

  await finalizePhase(phase.id, success)

  return { success }
}

async function finalizePhase(phaseId: string, success: boolean) {
  const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED

  await prisma.executionPhase.update({
    where: {
      id: phaseId
    },
    data: {
      status: finalStatus,
      completedAt: new Date()
    }
  })
}
