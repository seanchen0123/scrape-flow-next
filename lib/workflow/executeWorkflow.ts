import 'server-only'
import prisma from '../prisma'
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from '@/types/workflow'
import { ExecutionPhase } from '@prisma/client'
import { AppNode } from '@/types/appNode'
import { TaskRegistry } from './task/registry'
import { executorRegistry } from './executor/registry'
import { Environment, ExecutionEnvironment } from '@/types/executor'
import { TaskParamType } from '@/types/task'
import { Browser, Page } from 'puppeteer'
import { revalidatePath } from 'next/cache'
import { Edge } from '@xyflow/react'
import { LogCollector } from '@/types/log'
import { createLogCollector } from '../log'

export async function executeWorkflow(executionId: string, nextRunAt?: Date) {
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

  const edges = JSON.parse(execution.definition).edges as Edge[]

  // 2. initialize workflow execution
  await initializeWorkflowExecution(executionId, execution.workflowId, nextRunAt)

  // 3. initialize phases status
  await initializePhasesStatus(execution)

  // 4. execute
  let creditsConsumed = 0
  let executionFaild = false
  for (const phase of execution.phases) {
    // 4.1 execute every phase
    const phaseExecution = await executeWorkflowPhase(phase, environment, edges, execution.userId)
    if (!phaseExecution.success) {
      executionFaild = true
      break
    }
    creditsConsumed += phaseExecution.creditsConsumed
  }

  // 5. finalize execution
  await finalizeWorkflowExecution(executionId, execution.workflowId, executionFaild, creditsConsumed)

  // 6. cleanup environment
  await cleanupEnvironment(environment)

  revalidatePath('/workflow/runs')
}

async function initializeWorkflowExecution(executionId: string, workflowId: string, nextRunAt?: Date) {
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
      lastRunId: executionId,
      ...(nextRunAt && { nextRunAt })
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

async function executeWorkflowPhase(phase: ExecutionPhase, environment: Environment, edges: Edge[], userId: string) {
  // initialize log collector
  const logCollector = createLogCollector()
  const startedAt = new Date()
  const node = JSON.parse(phase.node) as AppNode

  setupEnviormentForPhase(node, environment, edges)

  await prisma.executionPhase.update({
    where: {
      id: phase.id
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs)
    }
  })

  const creditsRequired = TaskRegistry[node.data.type].credits
  
  let success = await decrementCredits(userId, creditsRequired, logCollector)
  const creditsConsumed = success ? creditsRequired : 0
  if (success) {
    // we can execute the phase if the credits are sufficient
    success = await executePhase(phase, node, environment, logCollector)
  }

  const outputs = environment.phases[node.id].outputs

  await finalizePhase(phase.id, success, outputs, logCollector, creditsConsumed)

  return { success, creditsConsumed }
}

async function finalizePhase(phaseId: string, success: boolean, outputs: any, logCollector: LogCollector, creditsConsumed: number) {
  const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED

  await prisma.executionPhase.update({
    where: {
      id: phaseId
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      creditsConsumed,
      logs: {
        createMany: {
          data: logCollector.getAll().map(log => ({
            message: log.message,
            logLevel: log.level,
            timestamp: log.timestamp
          }))
        }
      }
    }
  })
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): Promise<boolean> {
  const runFn = executorRegistry[node.data.type]
  if (!runFn) {
    return false
  }

  const executionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(node, environment, logCollector)

  return await runFn(executionEnvironment)
}

function setupEnviormentForPhase(node: AppNode, environment: Environment, edges: Edge[]) {
  environment.phases[node.id] = { inputs: {}, outputs: {} }
  const inputs = TaskRegistry[node.data.type].inputs
  for (const input of inputs) {
    if (input.type === TaskParamType.BROSWER_INSTANCE) continue
    const inputValue = node.data.inputs[input.name]
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue
      continue
    }
    // get input value from outputs in the environment
    const connectedEdge = edges.find(edge => edge.target === node.id && edge.targetHandle === input.name)
    if (!connectedEdge) {
      console.error('Missing edge for input ', input.name, 'node id: ', node.id)
      continue
    }

    const outputValue = environment.phases[connectedEdge.source].outputs[connectedEdge.sourceHandle!]

    environment.phases[node.id].inputs[input.name] = outputValue
  }
}

function createExecutionEnvironment(
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): ExecutionEnvironment<any> {
  return {
    getInput: (name: string) => environment.phases[node.id]?.inputs[name],
    setOutput: (name: string, value: string) => (environment.phases[node.id].outputs[name] = value),

    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => (environment.browser = browser),

    getPage: () => environment.page,
    setPage: (page: Page) => (environment.page = page),

    log: logCollector
  }
}

async function cleanupEnvironment(environment: Environment) {
  if (environment.browser) {
    await environment.browser.close().catch(error => console.log('cannot close browser, reason: ', error))
  }
}

async function decrementCredits(userId: string, amount: number, logCollector: LogCollector) {
  try {
    await prisma.userBalance.update({
      where: { userId, credits: { gte: amount} },
      data: {
        credits: {
          decrement: amount
        }
      }
    })
    return true
  } catch (error) {
    logCollector.error('insufficient balance')
    return false
  }
}
