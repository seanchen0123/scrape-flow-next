import { ExecutionEnvironment } from '@/types/executor'
import { DeliveryViaWebhookTask } from '../task/DeliveryViaWebhook'

export async function DeliveryViaWebhookExecutor(environment: ExecutionEnvironment<typeof DeliveryViaWebhookTask>): Promise<boolean> {
  try {
    const targetURL = environment.getInput('Target URL')
    if (!targetURL) {
      environment.log.error('input->targetURL not defined')
    }

    const body = environment.getInput('Body')
    if (!body) {
      environment.log.error('input->body not defined')
    }

    const response = await fetch(targetURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const statusCode = response.status
    if (statusCode !== 200) {
      environment.log.error(`Failed to send data with webhook. Status code: ${statusCode}`)
      return false
    }

    const responseBody = await response.json()
    environment.log.info(`Send data with webhook successfully. Response body: ${JSON.stringify(responseBody, null, 4)}`)

    return true
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}
