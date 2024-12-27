'use client'

import React, { useState } from 'react'
import Logo from '@/components/Logo'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signUpSchema, signUpSchemaType } from '@/schema/signup'
import { LucideEye, LucideEyeOff } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { register } from '@/actions/auth/register'
import { toast } from 'sonner'
import Link from 'next/link'

const RegisterForm = () => {
  const [showPwd, setShowPwd] = useState(false)
  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success('user has been created', { id: 'user register' })
    },
    onError: error => {
      console.log('user register error: ', error)
      toast.error('Something went wrong', { id: 'user register' })
    }
  })

  // 1. Define your form.
  const form = useForm<signUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      password: '',
      name: ''
    }
  })

  // 2. Define a submit handler.
  function onSubmit(values: signUpSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { username, password, name } = values
    const nickName = name ? name : username
    mutation.mutate({ username, password, name: nickName })
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input placeholder="Sean Chen" disabled={mutation.isPending} {...field} />
                  </FormControl>
                  <FormDescription>
                    The nickname is used for display, if it is not filled, it will be the same as the username
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="sean" disabled={mutation.isPending} {...field} />
                  </FormControl>
                  <FormDescription>The usernamr is used for login</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className=" relative">
                      <Input
                        placeholder="Enter your password"
                        disabled={mutation.isPending}
                        type={showPwd ? 'text' : 'password'}
                        {...field}
                      />
                      <Button
                        variant={'ghost'}
                        className=" absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={e => {
                          e.preventDefault()
                          setShowPwd(!showPwd)
                        }}
                      >
                        {showPwd ? <LucideEyeOff className=" w-5 h-5" /> : <LucideEye className=" w-5 h-5" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending} className="w-full tracking-wide text-white">
              Submit
            </Button>
          </form>
        </Form>
      </div>
      <Link
        href={'/sign-in'}
        className="mt-6 text-muted-foreground text-sm underline underline-offset-2 hover:text-white transition duration-300 lg:hidden"
      >
        Already have an account? Log in
      </Link>
    </div>
  )
}

export default RegisterForm
