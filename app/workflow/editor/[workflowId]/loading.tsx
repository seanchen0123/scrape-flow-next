import { Loader2Icon } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <Loader2Icon size={30} className='animate-spin stroke-primary' />
    </div>
  )
}

export default Loading