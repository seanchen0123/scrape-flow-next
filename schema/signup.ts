import { z } from "zod"
import { signInSchema } from "./auth"

export const signUpSchema = signInSchema.extend({
  name: z.string().optional()
})

export type signUpSchemaType = z.infer<typeof signUpSchema>