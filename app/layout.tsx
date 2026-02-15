import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { CartProvider } from '@/lib/cart-context'
import { ThemeProvider } from '@/lib/theme-context'

export const metadata: Metadata = {
  title: 'Game Plug — Buy Games, Software & Gift Cards Instantly',
  description: 'Your premier digital marketplace for games, software keys, and gift cards. Instant delivery, secure checkout, best prices.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="overflow-x-hidden antialiased">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
