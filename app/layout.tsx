import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WiFi QR Code Generator",
  description: "Generate WiFi QR codes effortlessly. Share your WiFi network securely and let guests connect instantly by scanning a QR code. Fast, easy, and secure WiFi access.",
  keywords: ["WiFi QR Code Generator", "WiFi QR Code", "Generate WiFi QR", "Secure WiFi Access", "QR Code for WiFi", "WiFi sharing"],
  
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}



import './globals.css'