import type { Metadata } from 'next'
import './globals.css'

import Footer from '@/components/Footer/Footer'
import Navbar from '@/components/Navbar/Navbar'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const title = 'Garage Zona Cero | Detailing Automotriz Premium'
const description =
  'Garage Zona Cero transforma la presencia de tu vehiculo con lavado premium, detailing interior, pulido, proteccion y tratamientos ceramicos.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: 'Garage Zona Cero',
  keywords: [
    'detailing automotriz',
    'lavado premium',
    'pulido de autos',
    'tratamiento ceramico',
    'detailing interior',
    'restauracion estetica vehicular',
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: 'Garage Zona Cero',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Garage Zona Cero',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/twitter-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
