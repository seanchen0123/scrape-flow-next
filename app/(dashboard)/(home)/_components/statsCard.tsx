import ReactCountupWrapper from '@/components/ReactCountupWrapper'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import React from 'react'

const StatsCard = ({
  title,
  value,
  icon
}: {
  title: string
  value: number
  icon: LucideIcon
}) => {
  const Icon = icon

  return (
    <Card className="relative overflow-hidden h-full">
      <CardTitle>
        <CardHeader className='flex pb-2'>{title}</CardHeader>
        <Icon
          size={120}
          className="text-muted-foreground absolute -bottom-4 -right-8 stroke-primary opacity-10"
        />
      </CardTitle>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          <ReactCountupWrapper value={value} />
        </div>
      </CardContent>
    </Card>
  )
}

export default StatsCard
