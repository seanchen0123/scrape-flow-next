'use server'

import { sysmmetricEncrypt } from '@/lib/encryption'
import prisma from '@/lib/prisma'
import { createCredentialSchema, createCredentialSchemaType } from '@/schema/credential'
import { auth } from '@/lib/nextAuth'
import { revalidatePath } from 'next/cache'

export async function createCredential(form: createCredentialSchemaType) {
  const { success, data } = createCredentialSchema.safeParse(form)

  if (!success) {
    throw new Error('Invalid form data')
  }

  const session = await auth()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }
  const { id: userId} = session.user

  // Encrypt the value
  const encryptedValue = sysmmetricEncrypt(data.value)
  const result = await prisma.credential.create({
    data: {
      userId,
      name: data.name,
      value: encryptedValue
    }
  })

  if (!result) {
    throw new Error('Failed to create credential')
  }

  revalidatePath('/credentials')
}
