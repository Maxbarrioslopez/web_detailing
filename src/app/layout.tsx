import type { Metadata } from 'next'
import './globals.css'

import Footer from '@/components/Footer/Footer'
import Navbar from '@/components/Navbar/Navbar'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const title = 'Zona Cero Garage | Detailing Automotriz Premium'
const description =
  'Zona Cero Garage transforma la presencia de tu vehiculo con lavado premium, detailing interior, pulido, proteccion y tratamientos ceramicos.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: 'Zona Cero Garage',
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
    siteName: 'Zona Cero Garage',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Zona Cero Garage',
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
