'use client'

import { getAvalibleCredits } from '@/actions/billing/getAvalibleCredits'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { CoinsIcon, Loader2Icon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import ReactCountupWrapper from './ReactCountupWrapper'
import { buttonVariants } from './ui/button'

const UserAvalibleCredits = () => {
  const query = useQuery({
    queryKey: ['user-avalible-credits'],
    queryFn: () => getAvalibleCredits(),
    refetchInterval: 30 * 1000
  })

  return (
    <Link href={'/billing'} className={cn('w-full space-x-2 items-center', buttonVariants({ variant: 'outline' }))}>
      <CoinsIcon size={20} className="text-primary" />
      <span className="font-semibold capitalize">
        {query.isLoading && <Loader2Icon className="w-4 h-4 animate-spin" />}
        {!query.isLoading && query.data && <ReactCountupWrapper value={query.data} />}
        {!query.isLoading && query.data === undefined && '-'}
      </span>
    </Link>
  )
}

export default UserAvalibleCredits
