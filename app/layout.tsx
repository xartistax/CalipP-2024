// app/layout.tsx
import { fonts } from './fonts'
import { Providers } from './providers'
import "./globals.css";


import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'CaliP Music',
  description: 'Bridging Cultures, Elevating Consciousness, and Inspiring Change Through Music.',

  openGraph: {
    title: 'CaliP Music',
    description: 'Bridging Cultures, Elevating Consciousness, and Inspiring Change Through Music.',
    url: 'https://www.calipmusic.com',
    images: [
        {
            url: '/img_og.jpg', // Optimized for 1.91:1 aspect ratio (1200x630)
            width: 1200,
            height: 630,
            alt: 'Cali P. Music',
        },
    ],
},

twitter: {
  card: 'summary_large_image',
  title: 'CaliP Music',
  description: 'Bridging Cultures, Elevating Consciousness, and Inspiring Change Through Music.',
  images: ['/img_twitter.jpg'], // Optimized for 2:1 aspect ratio (1200x600)
},

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang='de' className={fonts.poppins.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}