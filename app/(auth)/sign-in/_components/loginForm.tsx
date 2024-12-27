'use client'

import React, { useState } from 'react'
import Logo from '@/components/Logo'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signInSchema, signInSchemaType } from '@/schema/auth'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { LucideEye, LucideEyeOff } from 'lucide-react'

const LoginForm = () => {
  const router = useRouter()
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  // 1. Define your form.
  const form = useForm<signInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  // 2. Define a submit handler.
  function onSubmit(values: signInSchemaType) {
    setLoading(true)
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    signIn('credentials', {
      ...values,
      redirect: false
    })
      .then(res => {
        // console.log('res', res)
        if (res && res.status === 200) {
          toast.success('Login successful!')
          router.push('/setup')
        } else if (res && res.status === 401) {
          toast.error('username or password error!')
        } else {
          toast.error('Login faild!')
        }
      })
      .catch(error => {
        console.log('user login error: ', error)
        toast.error('Something went wrong!')
      })
      .finally(() => {
        setLoading(false)
      })
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="sean" disabled={loading} {...field} />
                  </FormControl>
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
                        disabled={loading}
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
            <Button type="submit" disabled={loading} className="w-full tracking-wide text-white">
              Submit
            </Button>
          </form>
        </Form>
      </div>
      <Link
        href={'/sign-up'}
        className="mt-6 text-muted-foreground text-sm underline underline-offset-2 hover:text-white transition duration-300 lg:hidden"
      >
        No Account? Create an account
      </Link>
    </div>
  )
}

export default LoginForm
