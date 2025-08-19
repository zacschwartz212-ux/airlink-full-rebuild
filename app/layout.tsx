// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

// Client providers (NextAuth session) wrapped in a Client Component
import Providers from './providers'

// Your existing app shells
import { AppProvider } from '../lib/state'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Toaster from '../components/Toaster'
import AuthModal from '../components/AuthModal'
// If you kept SignUpModal as a no-op, you can remove this import & element.
// import SignUpModal from '../components/SignUpModal'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'AirLink • Hire local pros fast',
  description:
    'Linking homeowners with local contractors instantly. Post jobs, compare bids, and hire with confidence. Signals for pros.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Leaflet CSS in head to avoid Tailwind image constraints */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin=""
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body
        className={`${inter.className} min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-slate-950 dark:to-slate-900`}
      >
        {/* NextAuth session context (client) */}
        <Providers>
          {/* Your app state provider (client) */}
          <AppProvider>
            <Header />

            {/* Main content */}
            <main className="container-max pt-6 md:pt-8 pb-20">{children}</main>

            <Footer />
            <Toaster />

            {/* Modals */}
            <AuthModal />
            {/* <SignUpModal /> */}
          </AppProvider>
        </Providers>
      </body>
    </html>
  )
}
