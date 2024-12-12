'use client'

import { ThemeProvider } from "next-themes"
import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

const AppProviders = ({children}: Props) => {
  return (
    <ThemeProvider attribute='class' defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}

export default AppProviders