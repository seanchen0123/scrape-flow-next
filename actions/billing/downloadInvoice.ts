'use server'

import prisma from '@/lib/prisma'
import { stripe } from '@/lib/stripe/stripe'
import { auth } from '@/lib/nextAuth'
import { redirect } from 'next/navigation'

export async function downloadInvoice(id: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }
  const { id: userId} = session.user

  const purchase = await prisma.userPurchase.findUnique({
    where: {
      id, 
      userId
    }
  })

  if (!purchase) {
    throw new Error('Purchase not found')
  }

  const stripeSession = await stripe.checkout.sessions.retrieve(purchase.stripeId)

  if (!stripeSession.invoice) {
    throw new Error('Invoice not found')
  }

  const invoice = await stripe.invoices.retrieve(stripeSession.invoice as string)

  return invoice.hosted_invoice_url
}
