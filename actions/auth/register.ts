'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

type DataType = {
  name: string
  username: string
  password: string
}

export async function register({
  name,
  username,
  password
}: DataType) {

  const user = await prisma.user.findUnique({
    where: {
      username
    }
  })
  console.log(user)

  if (user) {
    throw new Error('Username was existed')
  }

  const nickName = name ? name : username
  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      name: nickName,
      username,
      password: hashedPassword
    }
  })

  redirect('/sign-in')
}

