import Logo from '@/components/Logo'
import { Separator } from '@/components/ui/separator'
import { Loader2Icon } from 'lucide-react'
import React from 'react'

const loading = () => {
  return (
    <div className='h-screen w-full flex items-center justify-center flex-col gap-4'>
      <Logo iconSize={50} fontSize='text-3xl' />
      <Separator className='max-w-xs' />
      <div className='flex items-center gap-2'>
        <Loader2Icon size={16} className='animate-spin stroke-primary' />
        <p className='text-muted-foreground'>Setting your accout</p>
      </div>
    </div>
  )
}

export default loading