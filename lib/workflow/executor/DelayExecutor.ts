import { ExecutionEnvironment } from '@/types/executor'
import { DelayTask } from '../task/Delay'
import { waitFor } from '@/lib/helper/waitFor'

export async function DelayExecutor(environment: ExecutionEnvironment<typeof DelayTask>): Promise<boolean> {
  try {
    const time = environment.getInput('Delay time')
    if (!time) {
      environment.log.error('input->time not defined')
    }

    await waitFor(parseInt(time) * 1000)

    environment.log.info(`Workflow delayed for ${time} seconds`)
    return true
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}
