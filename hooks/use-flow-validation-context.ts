'use client'

import { FlowValidationContext } from "@/app/workflow/context/FlowValidationProviders"
import { useContext } from "react"

export const useFlowValidationContext = () => {
  const context = useContext(FlowValidationContext)
  if (!context) {
    throw new Error('useFlowValidationContext must be used within a FlowValidationProviders')
  }
  return context
}