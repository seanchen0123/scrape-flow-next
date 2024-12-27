import NextAuth from 'next-auth'
import { authOptions } from '@/lib/nextAuth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

export const { auth, signIn, signOut } = handler