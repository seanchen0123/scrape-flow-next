import { TaskParamType } from "@/types/task";

export const ColorForHandle: Record<TaskParamType, string> = {
  [TaskParamType.BROSWER_INSTANCE]: '!bg-sky-400',
  [TaskParamType.STRING]: '!bg-amber-400'
}