'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { signOut, useSession } from 'next-auth/react'

function UserButton() {
  const session = useSession()
  if (!session.data?.user) return null

  const { user } = session.data

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={'icon'} className='rounded-full'>
          <UserAvatar username={user.username} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={async () => {
            await signOut()
          }}>Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const UserAvatar = ({ username }: { username: string }) => {
  return (
    <Avatar>
      <AvatarFallback className=" uppercase font-semibold bg-primary text-white">{username.charAt(0)}</AvatarFallback>
    </Avatar>
  )
}

export default UserButton
