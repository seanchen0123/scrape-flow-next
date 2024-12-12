'use client'

import { usePathname } from 'next/navigation'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from './ui/breadcrumb'
import { Fragment } from 'react'
import { MobileSidebar } from './Sidebar'

type Props = {}

const BreadcrumbHeader = (props: Props) => {
  const pathname = usePathname()
  const paths = pathname === '/' ? [''] : pathname.split('/')

  return (
    <div className="flex items-center">
      <MobileSidebar />
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, index) => (
            <Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink className="capitalize" href={`/${path}`}>
                  {path === '' ? 'home' : path}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

export default BreadcrumbHeader
