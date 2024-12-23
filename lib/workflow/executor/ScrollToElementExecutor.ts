import { ExecutionEnvironment } from '@/types/executor'
import { ScrollToElementTask } from '../task/ScrollToElement'

export async function ScrollToElementExecutor(
  environment: ExecutionEnvironment<typeof ScrollToElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput('Selector')
    if (!selector) {
      environment.log.error('input->selector not defined')
    }

    await environment.getPage()!.evaluate(selector => {
      const element = document.querySelector(selector)
      if (!element) {
        throw new Error(`Element ${selector} not found`)
      }
      const top = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top, behavior: 'smooth' })
    }, selector)

    environment.log.info('Scroll to element successfully')

    return true
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}
