import { ExecutionEnvironment } from '@/types/executor'
import pupppeteer from 'puppeteer'
import { LaunchBrowserTask } from '../task/LaunchBrowser'

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput('Website Url')
    const browser = await pupppeteer.launch({
      headless: false
    })
    environment.setBrowser(browser)
    const page = await browser.newPage()
    await page.goto(websiteUrl)
    await page.setViewport({width: 1080, height: 1024})
    environment.setPage(page)
    return true
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}