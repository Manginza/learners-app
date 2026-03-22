import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans"
})

export const metadata: Metadata = {
  title: "SA Learner's Licence Practice Tests",
  description: "Prepare for your South African learner's licence test with realistic 60-question practice exams for Code 8, Code 10, and Code 14.",
  keywords: ["learners licence", "South Africa", "driving test", "K53", "code 8", "code 10", "code 14", "practice test"],
  openGraph: {
    title: "SA Learner's Licence Practice Tests",
    description: "Practice for your South African learner's licence test",
    type: "website",
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a73e8",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
