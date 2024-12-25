'use client'

import { purchaseCredits } from '@/actions/billing/purchaseCredits'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { creditsPack, PackId } from '@/types/billing'
import { useMutation } from '@tanstack/react-query'
import { CoinsIcon, CreditCard } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const CreditsPurchase = () => {
  const [selectedPack, setSelectedPack] = React.useState(PackId.SMALL)

  const handlePackChange = (value: PackId) => {
    setSelectedPack(value)
  }

  const mutation = useMutation({
    mutationFn: purchaseCredits,
    onSuccess: () => {
      toast.success('Goto the payment page...')
    },
    onError: () => {
      toast.error('Somethin went wrong')
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <CoinsIcon className="w-6 h-6 text-primary" />
          Purchase Credits
        </CardTitle>
        <CardDescription>Select the number of credits you want to perchase</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedPack} onValueChange={handlePackChange}>
          {creditsPack.map(pack => (
            <div
              key={pack.id}
              className="flex items-center space-x-3 bg-secondary/50 rounded-lg p-3 hover:bg-secondary"
              onClick={() => setSelectedPack(pack.id)}
            >
              <RadioGroupItem value={pack.id} id={pack.id} />
              <Label className="flex items-center justify-between w-full cursor-pointer" htmlFor={pack.id}>
                <span className="font-semibold">
                  {pack.name} - {pack.label}
                </span>
                <span className="font-bold text-primary">${(pack.price / 100).toFixed(2)}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={mutation.isPending}
          onClick={() => {
            mutation.mutate(selectedPack)
          }}
        >
          <CreditCard className="mr-2 h-5 w-5" />
          Purchase credits
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CreditsPurchase
