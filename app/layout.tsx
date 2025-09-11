import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Suspense } from "react"

const geistSans = GeistSans
const geistMono = GeistMono

export const metadata: Metadata = {
  title: "EconoLearn - 경제 학습 플랫폼",
  description: "20대를 위한 경제 용어 학습 및 퀀트 분석 플랫폼",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <Navigation />
          <main>{children}</main>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
