import { ExecutionEnvironment } from '@/types/executor'
import pupppeteer from 'puppeteer'
import { LaunchBrowserTask } from '../task/LaunchBrowser'

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput('Website Url')
    const browser = await pupppeteer.launch({
      headless: false,
      executablePath: 'C:\\Users\\tt\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
    })
    environment.log.info('Browser started successfully')
    environment.setBrowser(browser)
    const page = await browser.newPage()
    await page.goto(websiteUrl)
    await page.setViewport({width: 1080, height: 1024})
    environment.setPage(page)
    environment.log.info(`Opened page at: ${websiteUrl}`)
    return true
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}