import React from 'react'

type Props = {
  children: React.ReactNode
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      {children}
    </div>
  )
}

export default AuthLayout
