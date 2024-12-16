'use client'

import TooltipWrapper from '@/components/TooltipWrapper'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import SaveBtn from './saveBtn'
import ExecuteBtn from './executeBtn'

type Props = {
  title: string
  subTitle?: string
  workflowId: string
  hideButtons?: boolean
}

const TopBar = ({ title, subTitle, workflowId, hideButtons = false }: Props) => {
  const router = useRouter()

  return (
    <header className="flex p-2 border-b-2 border-separate justify-between items-center w-full h-[60px] sticky top-0 bg-background z-10">
      <div className="flex gap-1 flex-1">
        <TooltipWrapper content="Back">
          <Button variant={'ghost'} size={'icon'} onClick={() => router.back()}>
            <ChevronLeft size={24} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subTitle && <p className="text-xs text-muted-foreground truncate text-ellipsis">{subTitle}</p>}
        </div>
      </div>
      <div className="flex flex-1 gap-1 justify-end">
        {!hideButtons && (
          <>
            <ExecuteBtn workflowId={workflowId} />
            <SaveBtn workflowId={workflowId} />
          </>
        )}
      </div>
    </header>
  )
}

export default TopBar
