import { TaskType } from '@/types/task'
import { LaunchBrowserExecutor } from './LaunchBrowserExecutor'
import { PageToHtmlExecutor } from './PageToHtmlExecutor'
import { ExecutionEnvironment } from '@/types/executor'
import { WorkflowTask } from '@/types/workflow'
import { ExtractTextFromElementExecutor } from './ExtractTextFromElementExecutor'
import { FillInputExecutor } from './FillInputExecutor'
import { ClickElementExecutor } from './ClickElementExecutor'
import { WaitForElementExecutor } from './WaitForElementExecutor'
import { DelayExecutor } from './DelayExecutor'
import { DeliveryViaWebhookExecutor } from './DeliveryViaWebhookExecutor'
import { ExtractDataWithAIExecutor } from './ExtractDataWithAIExecutor'
import { ReadPropertyFromJsonExecutor } from './ReadPropertyFromJsonExecutor'
import { AddPropertyToJsonExecutor } from './AddPropertyToJsonExecutor'
import { NavigateUrlExecutor } from './NavigateUrlExecutor'
import { ScrollToElementExecutor } from './ScrollToElementExecutor'

type ExecutorFn<T extends WorkflowTask> = (environment: ExecutionEnvironment<T>) => Promise<boolean>

type RegistryType = {
  [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>
}

export const executorRegistry: RegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_ELEMENT: WaitForElementExecutor,
  DELAY: DelayExecutor,
  DELIVERY_VIA_WEBHOOK: DeliveryViaWebhookExecutor,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAIExecutor,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonExecutor,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonExecutor,
  NAVIGATE_URL: NavigateUrlExecutor,
  SCROLL_TO_ELEMENT: ScrollToElementExecutor
}
