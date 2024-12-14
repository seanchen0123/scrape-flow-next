import { createContext, useContext } from 'react'

type NodeComponentContextType = {
  nodeId: string
  isSelected: boolean
}

const NodeComponentContext = createContext<NodeComponentContextType>({
  nodeId: '',
  isSelected: false
})

export default function NodeComponentProvider({
  children,
  nodeId,
  isSelected
}: NodeComponentContextType & { children: React.ReactNode }) {
  return <NodeComponentContext.Provider value={{ nodeId, isSelected }}>{children}</NodeComponentContext.Provider>
}

export const useNodeComponentContext = () => useContext(NodeComponentContext)