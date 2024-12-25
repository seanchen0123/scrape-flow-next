import 'server-only'
import { getCreditsPack, PackId } from '@/types/billing'
import Stripe from 'stripe'
import prisma from '../prisma'

export async function handleCheckoutSessionCompleted(event: Stripe.Checkout.Session) {
  if (!event.metadata) {
    throw new Error('No metadata found in event')
  }

  const { userId, packId } = event.metadata

  if (!userId) {
    throw new Error('No user id found in metadata')
  }

  if (!packId) {
    throw new Error('No pack id found in metadata')
  }

  const purchasePack = getCreditsPack(packId as PackId)

  if (!purchasePack) {
    throw new Error('No pack found with id: ' + packId)
  }

  await prisma.userBalance.upsert({
    where: {
      userId
    },
    create: {
      userId,
      credits: purchasePack.credits
    },
    update: {
      credits: {
        increment: purchasePack.credits
      }
    }
  })

  await prisma.userPurchase.create({
    data: {
      userId,
      stripeId: event.id,
      description: `${purchasePack.name} - ${purchasePack.credits} credits`,
      amount: event.amount_total!,
      currency: event.currency!
    }
  })
}
