'use client'

import { CoinsIcon, HomeIcon, Layers2Icon, MenuIcon, ShieldCheckIcon } from 'lucide-react'
import React, { useState } from 'react'
import Logo from './Logo'
import Link from 'next/link'
import { Button, buttonVariants } from './ui/button'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import UserAvalibleCredits from './UserAvalibleCredits'

const routes = [
  {
    href: '',
    label: 'Home',
    icon: HomeIcon
  },
  {
    href: 'workflows',
    label: 'Workflows',
    icon: Layers2Icon
  },
  {
    href: 'credentials',
    label: 'Credentials',
    icon: ShieldCheckIcon
  },
  {
    href: 'billing',
    label: 'Billing',
    icon: CoinsIcon
  }
]

const DesktopSidebar = () => {
  const pathname = usePathname()
  const activeRoute = routes.find(route => route.href.length > 0 && pathname.includes(route.href)) || routes[0]

  return (
    <div className="hidden md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate">
      <div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
        <Logo />
      </div>
      <div className="p-2">
        <UserAvalibleCredits />
      </div>
      <div className="flex flex-col p-2">
        {routes.map(route => (
          <Link
            href={route.href}
            key={route.href}
            className={buttonVariants({
              variant: activeRoute.href === route.href ? 'sidebarActiveItem' : 'sidebarItem'
            })}
          >
            <route.icon size={20} />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function MobileSidebar() {
  const pathname = usePathname()
  const activeRoute = routes.find(route => route.href.length > 0 && pathname.includes(route.href)) || routes[0]

  const [isOpen, setOpen] = useState(false)

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size={'icon'}>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetTitle className="hidden" />
          <SheetContent className="w-[370px] sm:w-[540px] space-y-4" side={'left'}>
            <SheetHeader className="hidden">
              <SheetDescription />
            </SheetHeader>
            <Logo />
            <UserAvalibleCredits />
            <div className="flex flex-col gap-1">
              {routes.map(route => (
                <Link
                  href={route.href}
                  key={route.href}
                  className={buttonVariants({
                    variant: activeRoute.href === route.href ? 'sidebarActiveItem' : 'sidebarItem'
                  })}
                  onClick={() => setOpen(prev => !prev)}
                >
                  <route.icon size={20} />
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default DesktopSidebar
