import { FlowToExcutionPlanValidationError, flowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { AppNode } from "@/types/appNode";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { useFlowValidationContext } from "./use-flow-validation-context";
import { toast } from "sonner";

export default function useExecutionPlan() {
  const { toObject } = useReactFlow()
  const {setInvalidInputs, clearErrors} = useFlowValidationContext()

  const handleError = useCallback((error: any) => {
    switch(error.type) {
      case FlowToExcutionPlanValidationError.NO_ENTRY_POINT:
        toast.error('No entry point found')
        break
      case FlowToExcutionPlanValidationError.INVALID_INPUTS:
        toast.error('Not all inputs are set')
        setInvalidInputs(error.invalidElements)
        break
      default:
        toast.error('Something went wrong')
        break
    }
  }, [])
  
  const generatedExecutionPlan = useCallback(() => {
    const {nodes, edges} = toObject()
    const { executionPlan, error } = flowToExecutionPlan(nodes as AppNode[], edges)

    if (error) {
      handleError(error)
      return null
    }

    clearErrors()
    return executionPlan
  }, [toObject, handleError, clearErrors])

  return generatedExecutionPlan
}