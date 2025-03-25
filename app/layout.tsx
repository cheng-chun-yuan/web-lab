import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { UserProvider } from "@/context/user-context"

const inter = Inter({ subsets: ["latin"] })
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
export const metadata: Metadata = {
  title: "Personal Website",
  description: "My personal website with message board",
  openGraph: {
    siteName: "web-lab",
    type: "website",
    title: "title",
    description: "hihihi"
  },
  twitter: {
    card: "summary_large_image",
    title: "dog",
    description: "dog is cute",
    images:`${NEXT_PUBLIC_BASE_URL}/dog.jpg`
  }
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
