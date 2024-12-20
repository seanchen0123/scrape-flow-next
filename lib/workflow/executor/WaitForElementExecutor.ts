import { ExecutionEnvironment } from '@/types/executor'
import { waitFor } from '@/lib/helper/waitFor'
import { WaitForElementTask } from '../task/WaitForElement'

export async function WaitForElementExecutor(
  environment: ExecutionEnvironment<typeof WaitForElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput('Selector')
    if (!selector) {
      environment.log.error('input->selector not defined')
    }

    const visibility = environment.getInput('Visibility')
    if (!visibility) {
      environment.log.error('input->visibility not defined')
    }

    await environment.getPage()!.waitForSelector(selector, {
      visible: visibility === 'visible',
      hidden: visibility === 'hidden'
    })

    environment.log.info(`Element ${selector} became: ${visibility}`)

    await waitFor(1500)
    return true
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}
