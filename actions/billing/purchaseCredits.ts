'use server'

import { getAppUrl } from '@/lib/helper/appUrl'
import { stripe } from '@/lib/stripe/stripe'
import { getCreditsPack, PackId } from '@/types/billing'
import { auth } from '@/lib/nextAuth'
import { redirect } from 'next/navigation'

export async function purchaseCredits(packId: PackId) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }
  const { id: userId} = session.user

  const selectedPack = getCreditsPack(packId)

  if (!selectedPack) {
    throw new Error('Invalid pack')
  }

  const priceId = selectedPack.priceId
  const stripeSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    invoice_creation: {
      enabled: true
    },
    success_url: getAppUrl('billing'),
    cancel_url: getAppUrl('billing'),
    metadata: {
      userId,
      packId
    },
    line_items: [{ quantity: 1, price: priceId }]
  })

  if (!stripeSession.url) {
    throw new Error('Failed to create stripe session')
  }

  redirect(stripeSession.url)
}
