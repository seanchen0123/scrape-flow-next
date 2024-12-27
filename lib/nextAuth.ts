import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { DefaultSession, DefaultUser, NextAuthOptions, getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import prisma from './prisma'
import { signInSchema } from '@/schema/auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      username: string
      email?: string | null
      name?: string | null
    } & DefaultSession['user']
  }
  interface User extends DefaultUser {
    username: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    name?: string
    username: string
    image?: string | null
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/sign-in',
    error: '/auth/error'
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async credentials => {
        try {
          const validatedFields = signInSchema.safeParse(credentials)
          if (validatedFields.success) {
            const { username, password } = validatedFields.data

            const user = await prisma.user.findUnique({
              where: {
                username
              }
            })

            if (!user || !user.password) {
              return null
            }

            const passwordsMatch = await bcrypt.compare(password, user.password)

            if (passwordsMatch) {
              return {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
                image: user.image
              }
            }
          }
          return null
        } catch (error) {
          return null
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.email = user.email
        token.name = user.name || ''
      }
      return token
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id
        session.user.username = token.username
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.image
      }
      return session
    }
  }
}

export async function auth() {
  return await getServerSession(authOptions)
}
