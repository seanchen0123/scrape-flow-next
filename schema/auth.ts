import { z } from 'zod'

export const signInSchema = z.object({
  username: z.string({ required_error: 'Username is required' })
    .min(1, 'Username is required'),
  password: z.string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
})

export type signInSchemaType = z.infer<typeof signInSchema>