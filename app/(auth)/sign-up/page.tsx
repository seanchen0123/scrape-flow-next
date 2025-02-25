import { Button } from '@/components/ui/button'
import Link from 'next/link'
import RegisterForm from './_components/registerForm'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="shadow-md rounded-lg flex overflow-hidden bg-slate-50 dark:bg-zinc-900">
        {/* Left section */}
        <div className="p-8 w-80 sm:w-96">
          <RegisterForm />
        </div>
        {/* Right section */}
        <div className="hidden lg:flex flex-col items-center justify-center bg-primary text-white w-96 p-8">
          <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
          <p className="text-lg mb-6">Enter your personal details and start your journey with us.</p>
          <Link href={'/sign-in'}>
            <Button variant={'outline'} className="bg-transparent hover:bg-green-500 hover:text-white border-white">
              Already have an account?
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
