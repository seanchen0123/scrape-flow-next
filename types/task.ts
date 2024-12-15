export enum TaskType {
  LAUNCH_BROWSER = "LAUNCH_BROWSER",
  PAGE_TO_HTML = "PAGE_TO_HTML"
}

export enum TaskParamType {
  STRING = 'STRING',
  BROSWER_INSTANCE = 'BROWSER_INSTANCE'
}

export type TaskParam = {
  name: string
  type: TaskParamType
  helperText?: string
  required?: boolean
  hideHandle?: boolean
  [key: string]: any
}