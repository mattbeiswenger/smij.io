import './globals.css'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Smij',
  description: 'A simple URL shortener',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`bg-neutral-900 ${inter.className}`}>{children}</body>
    </html>
  )
}
