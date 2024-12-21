import { TaskParamType } from "@/types/task";

export const ColorForHandle: Record<TaskParamType, string> = {
  [TaskParamType.BROSWER_INSTANCE]: '!bg-sky-400',
  [TaskParamType.STRING]: '!bg-amber-400',
  [TaskParamType.SELECT]: '!bg-rose-400',
  [TaskParamType.CENDENTIAL]: '!bg-teal-400'
}