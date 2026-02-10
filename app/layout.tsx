import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { CartProvider } from '@/lib/cart-context'

export const metadata: Metadata = {
  title: 'GameVerse — Buy Games, Software & Gift Cards Instantly',
  description: 'Your premier digital marketplace for games, software keys, and gift cards. Instant delivery, secure checkout, best prices.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-neon-dark overflow-x-hidden">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
