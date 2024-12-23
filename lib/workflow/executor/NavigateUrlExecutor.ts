import { ExecutionEnvironment } from '@/types/executor'
import { NavigateUrlTask } from '../task/NavigateUrl'

export async function NavigateUrlExecutor(
  environment: ExecutionEnvironment<typeof NavigateUrlTask>
): Promise<boolean> {
  try {
    const url = environment.getInput('URL')
    if (!url) {
      environment.log.error('input->url not defined')
    }

    await environment.getPage()!.goto(url)

    environment.log.info(`navigate to ${url}`)

    return true
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}
