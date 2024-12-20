import { ExecutionEnvironment } from '@/types/executor'
import { ClickElementTask } from '../task/ClickElement'

export async function ClickElementExecutor(environment: ExecutionEnvironment<typeof ClickElementTask>): Promise<boolean> {
  try {
    const selector = environment.getInput('Selector')
    if (!selector) {
      environment.log.error('input->selector not defined')
    }

    await environment.getPage()!.click(selector)

    environment.log.info('Click element successfully')

    return true
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}
