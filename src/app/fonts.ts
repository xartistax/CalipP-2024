// app/fonts.ts
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ["100"]
})

export const fonts = {
  poppins,
}