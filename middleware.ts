export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/',
    '/billing/(.*)*',
    '/credentials/(.*)*',
    '/workflows/(.*)*',
    '/workflow/(.*)*',
    '/setup/(.*)*',
    '/api/workflows/(.*)*'
  ],
}
