import { waitFor } from '@/lib/helper/waitFor'
import { Environment, ExecutionEnvironment } from '@/types/executor'
import pupppeteer from 'puppeteer'
import { LaunchBrowserTask } from '../task/LaunchBrowser'

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
  try {
    const websitUrl = environment.getInput('Website Url')
    const browser = await pupppeteer.launch({
      headless: false
    })
    await waitFor(3000)
    await browser.close()
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}